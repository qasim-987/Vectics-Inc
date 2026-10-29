const http = require("http");
const { spawn } = require("child_process");

function request(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => resolve({ status: res.statusCode, headers: res.headers, body }));
    });
    req.on("error", reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runTests() {
  const port = 3012;
  const baseUrl = `http://127.0.0.1:${port}`;
  const server = spawn(process.execPath, [require.resolve("next/dist/bin/next"), "start", "-p", String(port), "-H", "127.0.0.1"], {
    stdio: "ignore",
    env: { ...process.env, RESEND_API_KEY: "", CONTACT_FROM_EMAIL: "" },
  });

  try {
    let ready = false;
    for (let attempt = 0; attempt < 30; attempt += 1) {
      await sleep(500);
      try {
        const response = await request(`${baseUrl}/`);
        if (response.status === 200) {
          ready = true;
          break;
        }
      } catch {}
    }
    if (!ready) throw new Error("Next.js production server did not start.");

    const pageChecks = [
      { path: "/", expected: ["Software built around how your business works", "AI business automation", "AI agents", "Custom websites", "Web apps", "Dashboards", "Internal tools", "API integrations", "Our approach"] },
      { path: "/about", expected: ["About Vectis", "We build software", "How we work"] },
      { path: "/contact", expected: ["Tell us what your business needs", "Send an inquiry", "Before we talk"] },
      { path: "/privacy", expected: ["Privacy Policy"] },
      { path: "/terms", expected: ["Terms of Use"] },
    ];

    for (const page of pageChecks) {
      const response = await request(`${baseUrl}${page.path}`);
      if (response.status !== 200) throw new Error(`${page.path} returned ${response.status}.`);
      for (const phrase of page.expected) {
        if (!response.body.toLowerCase().includes(phrase.toLowerCase())) {
          throw new Error(`${page.path} is missing expected copy: ${phrase}`);
        }
      }
      if (/<img\b|<image\b|next\/image/i.test(response.body)) {
        throw new Error(`${page.path} contains inline image markup or next/image imports.`);
      }
      if (!response.body.includes('property="og:image"') || !response.body.includes('name="twitter:card" content="summary_large_image"')) {
        throw new Error(`${page.path} is missing its Open Graph or Twitter social-card metadata.`);
      }
      if (response.body.toLowerCase().includes("forza")) {
        throw new Error(`${page.path} contains a removed parent-company reference.`);
      }
    }

    const legacyRoutes = ["/clients", "/work", "/blog", "/company", "/distributionlife", "/demos/intent-iq", "/services/ui-ux-design"];
    for (const path of legacyRoutes) {
      const response = await request(`${baseUrl}${path}`);
      const redirectTargetIsCorrect = response.headers.location === "/#services" || response.body.includes("NEXT_REDIRECT;replace;/#services");
      if (![307, 308].includes(response.status) || !redirectTargetIsCorrect) {
        throw new Error(`${path} should redirect to /#services; received ${response.status}.`);
      }
    }

    const sitemap = await request(`${baseUrl}/sitemap.xml`);
    if (sitemap.status !== 200 || !sitemap.body.includes("/contact") || sitemap.body.includes("/clients")) {
      throw new Error("The sitemap does not match the current public site routes.");
    }

    const home = await request(`${baseUrl}/`);
    if (!home.body.includes("Skip to main content") || !home.body.includes('aria-controls="mobile-menu"')) {
      throw new Error("The homepage is missing its skip link or mobile navigation controls.");
    }

    const missingFields = JSON.stringify({ firstName: "", email: "invalid", message: "" });
    const invalid = await request(`${baseUrl}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(missingFields) },
      body: missingFields,
    });
    if (invalid.status !== 400) throw new Error("Contact API did not reject invalid form input.");

    const formWithoutCredentials = JSON.stringify({
      firstName: "Test User",
      email: "test@example.com",
      message: "A valid test inquiry about business software.",
      formLoadedAt: Date.now() - 5000,
    });
    const unavailable = await request(`${baseUrl}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(formWithoutCredentials) },
      body: formWithoutCredentials,
    });
    if (unavailable.status !== 503) throw new Error("Contact API should report missing server email configuration.");

    const rateLimitIp = "198.51.100.42";
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const limitedPayload = JSON.stringify({
        name: "Rate Limit Test",
        email: "rate-limit@example.com",
        service: "AI agents",
        message: "Testing the contact API request limit behavior.",
        formLoadedAt: Date.now() - 5000,
      });
      const response = await request(`${baseUrl}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(limitedPayload), "x-real-ip": rateLimitIp },
        body: limitedPayload,
      });
      if (response.status !== 503) throw new Error(`Expected missing-email 503 before the rate limit; got ${response.status}.`);
    }
    const limitedPayload = JSON.stringify({
      name: "Rate Limit Test",
      email: "rate-limit@example.com",
      message: "Testing the contact API request limit behavior.",
      formLoadedAt: Date.now() - 5000,
    });
    const rateLimited = await request(`${baseUrl}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(limitedPayload), "x-real-ip": rateLimitIp },
      body: limitedPayload,
    });
    if (rateLimited.status !== 429 || !rateLimited.headers["retry-after"]) {
      throw new Error("Contact API did not enforce its per-instance request limit.");
    }

    console.log("Vectis site checks passed: core pages, redirects, social metadata, mobile navigation, sitemap, contact validation, and rate limiting.");
  } finally {
    server.kill();
  }
}

runTests().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
