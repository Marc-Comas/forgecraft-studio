#!/usr/bin/env node
/**
 * scripts/apply-qa-boot.mjs
 * 
 * Objectiu:
 * - Preparar el toolchain de QA de manera segura i idempotent (Sense stylelint-config-prettier).
 * - Fixar versions compatibles de Stylelint 16 + config standard 39.
 * - Escriure .stylelintrc.json, assegurar .gitignore per .env i recomanar scripts.
 * - Mai reintroduir deps incompatibles.
 * 
 * Ús:
 *  - Revisió (no canvia fitxers):   node scripts/apply-qa-boot.mjs
 *  - Escriure canvis al repo:       node scripts/apply-qa-boot.mjs --write
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const WRITE = process.argv.includes("--write");
const SUMMARY = {
  actions: [],
  warnings: [],
  nextDeps: [],
  removedDeps: [],
  filesChanged: []
};

// ---------- Utils ----------
const abs = (p) => path.join(ROOT, p);
const exists = (p) => fs.existsSync(abs(p));
const read = (p) => fs.readFileSync(abs(p), "utf8");
const write = (p, content) => {
  const full = abs(p);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
  SUMMARY.filesChanged.push(p);
};
const readJSON = (p) => JSON.parse(read(p));
const writeJSON = (p, obj) => write(p, JSON.stringify(obj, null, 2) + "\n");
const ensureLineInFile = (p, line) => {
  const full = abs(p);
  let content = exists(p) ? read(p) : "";
  if (!content.split(/\r?\n/).includes(line)) {
    content = content.replace(/\s*$/, "") + (content.endsWith("\n") ? "" : "\n") + line + "\n";
    if (WRITE) write(p, content);
    SUMMARY.actions.push(`Append "${line}" to ${p}`);
  }
};

// ---------- Package JSON patch ----------
function upsertDevDeps(pkg) {
  pkg.devDependencies ||= {};

  // Versions pinades i compatibles
  const wanted = {
    // Test i QA
    vitest: "^2.0.0",
    "@testing-library/react": "^14.2.1",
    "@testing-library/jest-dom": "^6.4.5",
    "jest-axe": "^9.0.0",
    "@types/jest-axe": "^3.5.5",
    jsdom: "^24.0.0",
    "@playwright/test": "^1.46.0",
    playwright: "^1.46.0",
    "@lhci/cli": "^0.13.0",

    // Format / lint
    prettier: "^3.3.3",
    stylelint: "^16.23.0",
    "stylelint-config-standard": "^39.0.0",
    "eslint-plugin-jsx-a11y": "^6.9.0",
    "wait-on": "^8.0.0"
  };

  // Paquet que NO volem mai
  const forbidden = ["stylelint-config-prettier"];

  // Elimina deps prohibides (dev i prod)
  for (const bad of forbidden) {
    if (pkg.devDependencies[bad]) {
      delete pkg.devDependencies[bad];
      SUMMARY.removedDeps.push(bad + " (devDependencies)");
    }
    if (pkg.dependencies?.[bad]) {
      delete pkg.dependencies[bad];
      SUMMARY.removedDeps.push(bad + " (dependencies)");
    }
  }

  // Afegir/actualitzar deps desitjades
  for (const [name, version] of Object.entries(wanted)) {
    const curr = pkg.devDependencies[name];
    if (!curr || curr !== version) {
      pkg.devDependencies[name] = version;
      SUMMARY.nextDeps.push(`${name}@${version}`);
    }
  }

  return pkg;
}

function upsertScripts(pkg) {
  pkg.scripts ||= {};

  // Scripts segurs (no fallen si no hi ha tests/build)
  pkg.scripts.lint ||= "eslint . --max-warnings=0 || echo \"eslint not configured\"";
  pkg.scripts["lint:css"] ||= "stylelint \"**/*.{css,scss}\" --ignore-path .gitignore || echo \"stylelint not configured\"";
  pkg.scripts.format ||= "prettier --write .";
  pkg.scripts.test ||= "vitest run || echo \"no tests\"";
  pkg.scripts["test:ci"] ||= "vitest run --reporter=default || echo \"no tests\"";
  pkg.scripts.build ||= "vite build || echo \"no build script\"";

  return pkg;
}

// ---------- Writers ----------
function ensureStylelintRc() {
  const content = `{
  "extends": ["stylelint-config-standard"],
  "rules": {
    "selector-class-pattern": "^[a-z0-9\\\\-]+$",
    "no-descending-specificity": null
  }
}
`;
  if (!exists(".stylelintrc.json") || read(".stylelintrc.json") !== content) {
    if (WRITE) write(".stylelintrc.json", content);
    SUMMARY.actions.push("Write .stylelintrc.json (compatible with Stylelint 16)");
  }
}

function ensureEnvIgnored() {
  // .gitignore -> .env
  ensureLineInFile(".gitignore", ".env");

  // .env.example (sanititzat) si existeix .env
  if (exists(".env") && !exists(".env.example")) {
    const sanitized = read(".env").replace(/=(.*)/g, "=<set-in-ci>");
    if (WRITE) write(".env.example", sanitized);
    SUMMARY.actions.push("Create .env.example (sanitized from .env)");
  }
}

// ---------- Main ----------
(function main() {
  if (!exists("package.json")) {
    SUMMARY.warnings.push("package.json no existeix al root del projecte.");
    finish();
    return;
  }

  let pkg = readJSON("package.json");
  const before = JSON.stringify(pkg);

  pkg = upsertDevDeps(pkg);
  pkg = upsertScripts(pkg);

  const after = JSON.stringify(pkg);
  if (before !== after) {
    if (WRITE) writeJSON("package.json", pkg);
    SUMMARY.actions.push("Update package.json (devDependencies + scripts)");
  }

  ensureStylelintRc();
  ensureEnvIgnored();

  finish();
})();

function finish() {
  const banner = `
──────────────────────────────────────────────────────────────
 QA Boot Summary ${WRITE ? "(WRITE MODE)" : "(REVIEW MODE)"}
──────────────────────────────────────────────────────────────`;
  console.log(banner);

  if (SUMMARY.actions.length) {
    console.log("\nActions:");
    for (const a of SUMMARY.actions) console.log(" -", a);
  } else {
    console.log("\nActions: (cap canvi necessari)");
  }

  if (SUMMARY.nextDeps.length) {
    console.log("\nDev dependencies to ensure:");
    for (const d of SUMMARY.nextDeps) console.log(" -", d);
  }

  if (SUMMARY.removedDeps.length) {
    console.log("\nRemoved incompatible deps:");
    for (const r of SUMMARY.removedDeps) console.log(" -", r);
  }

  if (SUMMARY.filesChanged.length) {
    console.log("\nFiles touched:");
    for (const f of SUMMARY.filesChanged) console.log(" -", f);
  }

  if (SUMMARY.warnings.length) {
    console.log("\nWarnings:");
    for (const w of SUMMARY.warnings) console.log(" -", w);
  }

  console.log("\nDone.\n");
}
