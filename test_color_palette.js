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

// Normal-sized text should meet WCAG AA on every surface it commonly uses.
const pairs = [
  ["Content on white", colors.content.DEFAULT, colors.surface.DEFAULT],
  ["Muted content on white", colors.content.muted, colors.surface.DEFAULT],
  ["Muted content on gray", colors.content.muted, colors.surface.muted],
  ["Subtle content on gray", colors.content.subtle, colors.surface.muted],
  ["Homepage accent on gray", colors.brass.deep, colors.canvas.DEFAULT],
  ["Blue accent on white", colors.brand.DEFAULT, colors.surface.DEFAULT],
  ["Blue accent on gray", colors.brand.DEFAULT, colors.surface.muted],
  ["Button text on blue", "#ffffff", colors.brand.DEFAULT],
  ["Button text on hover", "#ffffff", colors.brand.deep],
  ["Hero text on navy", colors.paper.DEFAULT, colors.ink.soft],
  ["Muted text on navy", colors.muted.DEFAULT, colors.ink.soft],
  ["Footer labels on navy", colors.muted.dark, colors.ink.deep],
  ["Contact label on navy", colors.brand.light, colors.ink.card],
  ["Error text on white", colors.accent.red, colors.surface.DEFAULT],
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
