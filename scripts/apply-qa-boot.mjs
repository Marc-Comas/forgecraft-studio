#!/usr/bin/env node
// scripts/apply-qa-boot.mjs
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const WRITE = process.argv.includes("--write");
const REVIEW = !WRITE || process.argv.includes("--review");

function abs(p) { return path.join(ROOT, p); }
function exists(p) { return fs.existsSync(p); }
function readJSON(p) { return JSON.parse(fs.readFileSync(p, "utf8")); }
function ensureDirForFile(absFilePath) {
  const dir = path.dirname(absFilePath);
  fs.mkdirSync(dir, { recursive: true });
}
function writeFileRel(relPath, content) {
  const target = abs(relPath);
  ensureDirForFile(target);
  fs.writeFileSync(target, content, "utf8");
}

const files = {
  ".github/workflows/ci.yml": `name: CI
on: [push, pull_request]
jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci || npm i
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test -- --coverage
      - run: npm run a11y:check
      - run: npm run build
      - run: npm run lhci
      - name: E2E
        run: npm run e2e -- --reporter=line
`,
  "lighthouserc.json": `{
  "ci": {
    "collect": { "staticDistDir": "dist" },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "interactive": ["error", { "maxNumericValue": 200, "aggregationMethod": "p75" }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500, "aggregationMethod": "p75" }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1, "aggregationMethod": "p75" }],
        "total-byte-weight": ["error", { "maxLength": 350000 }]
      }
    }
  }
}
`,
  "delivery.manifest.json": `{
  "name": "forgecraft-studio",
  "stack": ["vite","react","ts"],
  "routes": ["/","/generator","/projects"],
  "env_required": ["VITE_SUPABASE_URL","VITE_SUPABASE_ANON_KEY"],
  "scripts": ["dev","build","test","lint","e2e","lhci","format","typecheck","a11y:check"],
  "quality": { "coverage_min": 0.8, "lighthouse_min": 0.9, "axe_critical_violations": 0 }
}
`,
  ".env.example": `# Env de ejemplo (no subas .env reales)
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
`,
  ".prettierrc": `{
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "semi": true
}
`,
  ".stylelintrc.json": `{
  "extends": ["stylelint-config-standard", "stylelint-config-prettier"],
  "rules": {
    "selector-class-pattern": "^[a-z0-9\\-]+$",
    "no-descending-specificity": null
  }
}
`,
  ".editorconfig": `root = true
[*]
charset = utf-8
end_of_line = lf
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true
`,
  ".github/PULL_REQUEST_TEMPLATE.md": `## Descripción
- [ ] Cambios principales

## Checklist de calidad
- [ ] Tests unitarios (coverage >= 80%)
- [ ] A11y (jest-axe sin críticos)
- [ ] E2E básicos verdes
- [ ] LHCI (perf >= 0.9, interactive p75 <= 200ms)
- [ ] Typecheck sin errores
- [ ] Documentación/README actualizada

## Evidencias
`,
  "CODEOWNERS": `* @Marc-Comas
`,
  "vitest.config.ts": `import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup-tests.ts']
  }
});
`,
  "tests/setup-tests.ts": `import '@testing-library/jest-dom';
`,
  "tests/a11y/a11y.smoke.test.ts": `import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import App from '../../src/App';

expect.extend(toHaveNoViolations);

describe('A11y smoke', () => {
  it('App no tiene violaciones críticas', async () => {
    const { container } = render(<App />);
    const results = await axe(container);
    const criticals = results.violations.filter(v => v.impact === 'critical');
    expect(criticals).toHaveLength(0);
  });
});
`,
  "playwright.config.ts": `import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  use: { baseURL: 'http://localhost:4173', trace: 'on-first-retry' },
  webServer: { command: 'npm run preview', url: 'http://localhost:4173', reuseExistingServer: !process.env.CI },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }]
});
`,
  "tests/e2e/smoke.spec.ts": `import { test, expect } from '@playwright/test';

test('home carga y muestra título', async ({ page }) => {
  await page.goto('/');
  const title = page.locator('h1, [data-testid="title"], [role="heading"]');
  await expect(title).toBeVisible();
});

test('ruta desconocida muestra 404 o fallback', async ({ page }) => {
  await page.goto('/_noexiste_');
  const fallback = page.locator('text=404').or(page.locator('[data-testid="not-found"]'));
  await expect(fallback).toBeVisible({ timeout: 5000 });
});
`
};

const SUMMARY = { created: [], updated: [], warnings: [], nextDeps: [] };

try {
  // 1) Escribir/actualizar archivos
  const overwritable = new Set(Object.keys(files)); // todos son seguros aquí
  for (const [rel, content] of Object.entries(files)) {
    const target = abs(rel);
    const existsNow = exists(target);
    if (!existsNow) {
      if (WRITE) writeFileRel(rel, content);
      SUMMARY.created.push(rel);
    } else if (overwritable.has(rel)) {
      if (WRITE) writeFileRel(rel, content);
      SUMMARY.updated.push(rel);
    }
  }

  // 2) .gitignore: añade entradas sin duplicar
  const giPath = abs(".gitignore");
  const adds = ["node_modules", "dist", ".env", "playwright-report", "test-results", "lhci_reports"];
  let gi = exists(giPath) ? fs.readFileSync(giPath, "utf8") : "";
  const set = new Set(gi.split("\n").filter(Boolean));
  for (const line of adds) set.add(line);
  const giOut = Array.from(set).join("\n") + "\n";
  if (WRITE) writeFileRel(".gitignore", giOut);
  SUMMARY.updated.push(".gitignore");

  // 3) package.json: fusionar scripts
  const pkgPath = abs("package.json");
  if (!exists(pkgPath)) {
    SUMMARY.warnings.push("No se encontró package.json. ¿Es un proyecto Node?");
  } else {
    const pkg = readJSON(pkgPath);
    pkg.scripts ||= {};
    const add = {
      dev: pkg.scripts.dev || "vite",
      build: pkg.scripts.build || "vite build",
      preview: pkg.scripts.preview || "vite preview",
      test: pkg.scripts.test || "vitest run",
      "test:watch": pkg.scripts["test:watch"] || "vitest",
      typecheck: pkg.scripts.typecheck || "tsc --noEmit",
      lint: pkg.scripts.lint || "eslint . --ext .ts,.tsx --max-warnings 0",
      format: pkg.scripts.format || "prettier --check .",
      "format:write": pkg.scripts["format:write"] || "prettier --write .",
      "a11y:check": pkg.scripts["a11y:check"] || "vitest run tests/a11y --reporter=dot",
      e2e: pkg.scripts.e2e || "playwright test",
      lhci: pkg.scripts.lhci || "lhci autorun"
    };
    const before = JSON.stringify(pkg.scripts);
    Object.assign(pkg.scripts, add);
    const after = JSON.stringify(pkg.scripts);
    if (before !== after && WRITE) fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf8");
    if (before !== after) SUMMARY.updated.push("package.json (scripts)");

    // Dev deps sugeridas
    const suggested = [
      "vitest","@testing-library/react","@testing-library/jest-dom","jest-axe","@types/jest-axe","jsdom",
      "@playwright/test","playwright","@lhci/cli",
      "prettier","stylelint","stylelint-config-standard","stylelint-config-prettier",
      "eslint-plugin-jsx-a11y","wait-on"
    ];
    const current = Object.assign({}, pkg.devDependencies, pkg.dependencies);
    const missing = suggested.filter(d => !current || !current[d]);
    if (missing.length) SUMMARY.nextDeps = missing;
  }

  // 4) Doble runner check
  const hasVitest = exists(abs("vitest.config.ts")) || exists(abs("vitest.config.js"));
  const hasJest = exists(abs("jest.config.ts")) || exists(abs("jest.config.js"));
  if (hasVitest && hasJest) SUMMARY.warnings.push("Detectado Vitest y Jest. Mantén solo UNO (recomendado: Vitest).");

  // 5) .env en repo
  if (exists(abs(".env"))) SUMMARY.warnings.push("Se detectó .env en el repo. Sube solo .env.example y usa GitHub Secrets. Rota claves.");

  // 6) Salida
  const banne
