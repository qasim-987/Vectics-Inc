# Contact form email setup

The contact form sends submissions server-side through Resend. It does not report success until the provider accepts the message.

1. Create a Resend API key and verify a domain you control in Resend.
2. Add these server-only environment variables to the deployment (and to a local `.env.local` for development):
   - `RESEND_API_KEY` — Resend API key; never expose it through a `NEXT_PUBLIC_` variable.
   - `CONTACT_FROM_EMAIL` — sender using the verified domain, e.g. `Vectis Website <website@yourdomain.example>`.
   - `CONTACT_TO_EMAIL` — inbox that should receive inquiries. Defaults to `hello@vectisoperations.tech`.
3. Redeploy after setting the variables.

If email delivery is not configured or the provider is unavailable, the API returns an error and the form offers the direct email address instead of pretending the inquiry was sent. WhatsApp and social-profile links are intentionally omitted until the owner supplies real URLs/numbers.
