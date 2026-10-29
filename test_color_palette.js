const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const loadConfig = require("tailwindcss/loadConfig");
const resolveConfig = require("tailwindcss/resolveConfig");

const config = loadConfig(path.join(__dirname, "tailwind.config.ts"));
const colors = resolveConfig(config).theme.colors;
const css = fs.readFileSync(path.join(__dirname, "src/app/globals.css"), "utf8");

function rgb(color) {
  if (/^#[0-9a-f]{6}$/i.test(color)) {
    return color.slice(1).match(/../g).map((channel) => parseInt(channel, 16));
  }

  const variable = /^rgb\(var\((--[\w-]+)\) \/ <alpha-value>\)$/.exec(color);
  assert.ok(variable, `Expected a hex color or Tailwind RGB variable: ${color}`);
  const declaration = new RegExp(`${variable[1]}:\\s*(\\d+)\\s+(\\d+)\\s+(\\d+)\\s*;`).exec(css);
  assert.ok(declaration, `Missing RGB variable ${variable[1]}`);
  return declaration.slice(1).map(Number);
}

function luminance(color) {
  const channels = rgb(color).map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrast(foreground, background) {
  const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

// Every semantic and legacy Tailwind alias resolves to one of the approved tokens.
const approved = ["bg", "surface", "border", "text", "text-muted", "accent", "accent-hover", "dark", "dark-text"]
  .map((token) => rgb(`rgb(var(--${token}-rgb) / <alpha-value>)`));
function assertApprovedPalette(value, name = "colors") {
  if (typeof value === "string") {
    if (["transparent", "currentColor", "inherit"].includes(value)) return;
    const channels = rgb(value);
    assert.ok(approved.some((entry) => entry.every((channel, index) => channel === channels[index])), `${name} must resolve to an approved palette token`);
    return;
  }
  for (const [key, child] of Object.entries(value)) assertApprovedPalette(child, `${name}.${key}`);
}
assertApprovedPalette(colors);

// Normal-sized text should meet WCAG AA on every light/dark surface in use.
const pairs = [
  ["Body text on white surface", colors.content.DEFAULT, colors.surface.DEFAULT],
  ["Muted text on white surface", colors.content.muted, colors.surface.DEFAULT],
  ["Body text on page background", colors.content.DEFAULT, colors.canvas.DEFAULT],
  ["Muted text on page background", colors.content.muted, colors.surface.muted],
  ["Subtle text on page background", colors.content.subtle, colors.surface.muted],
  ["Accent on page background", colors.brass.deep, colors.canvas.DEFAULT],
  ["Blue accent on white", colors.brand.DEFAULT, colors.surface.DEFAULT],
  ["Blue accent on page background", colors.brand.DEFAULT, colors.surface.muted],
  ["Button text on blue", "#ffffff", colors.brand.DEFAULT],
  ["Button text on hover", "#ffffff", colors.brand.deep],
  ["Body text on neutral section", colors.paper.DEFAULT, colors.ink.soft],
  ["Muted text on neutral section", colors.muted.DEFAULT, colors.ink.soft],
  ["Footer text on dark", colors.darkText, colors.dark],
  ["Footer muted text on dark", colors.darkText, colors.dark],
  ["Contact label on surface", colors.brand.light, colors.ink.card],
  ["Accent text on white", colors.accent.red, colors.surface.DEFAULT],
];

for (const [name, foreground, background] of pairs) {
  const ratio = contrast(foreground, background);
  assert.ok(ratio >= 4.5, `${name} must have at least 4.5:1 contrast (got ${ratio.toFixed(2)}:1)`);
  console.log(`${name}: ${ratio.toFixed(2)}:1`);
}

// Homepage and inner-page aliases should resolve to the same shared tokens.
for (const [name, actual, expected] of [
  ["white surface", colors.surface.DEFAULT, colors.canvas.raised],
  ["muted surface", colors.surface.muted, colors.canvas.DEFAULT],
  ["body text", colors.content.DEFAULT, colors.char.DEFAULT],
  ["secondary text", colors.content.muted, colors.char.soft],
  ["blue accent", colors.brand.DEFAULT, colors.brass.deep],
]) {
  assert.deepEqual(rgb(actual), rgb(expected), `${name} aliases are out of sync`);
}

console.log("Color palette checks passed.");
