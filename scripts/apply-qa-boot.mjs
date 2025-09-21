#!/usr/bin/env node
// scripts/apply-qa-boot.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = process.cwd();
const writeMode = process.argv.includes("--write");
const reviewMode = process.argv.includes("--review") || !writeMode;

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
  ".env.example": `# Env de ejemplo (no subir .env reales)
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

## Screenshots o evidencias
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
  timeout: 30_000,
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry'
  },
  webServer: {
    command: 'npm run preview',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ]
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

const ensureDir = (fp) => fs.mkdirSync(path.dirname(fp), { recursive: true });
const exists = (p) => fs.existsSync(p);
const readJSON = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const writeFile = (fp, content) => {
  ensureDir(path.join(ROOT, path.dirname(fp)));
  fs.writeFileSync(path.join(ROOT, fp), content, "utf8");
};

const summary = { created: [], updated: [], warnings: [], nextDeps: [] };

// 1) Create or update files (non-destructive where applicable)
for (const [rel, content] of Object.entries(files)) {
  const fp = path.join(ROOT, rel);
  if (!exists(fp)) {
    if (!reviewMode) writeFile(rel, content);
    summary.created.push(rel);
  } else {
    // Only overwrite safe scaffolds; skip if user already has content in those areas
    const overwritable = [
      ".github/workflows/ci.yml",
      "lighthouserc.json",
      "delivery.manifest.json",
      ".env.example",
      ".prettierrc",
      ".stylelintrc.json",
      ".editorconfig",
      ".github/PULL_REQUEST_TEMPLATE.md",
      "CODEOWNERS",
      "tests/setup-tests.ts",
      "tests/a11y/a11y.smoke.test.ts",
      "playwright.config.ts",
      "tests/e2e/smoke.spec.ts",
      "vitest.config.ts"
    ];
    if (overwritable.includes(rel)) {
      if (!reviewMode) writeFile(rel, content);
      summary.updated.push(rel);
    }
  }
}

// 2) .gitignore → añade entradas sin duplicar
const gitignorePath = path.join(ROOT, ".gitignore");
const gitignoreAdds = ["node_modules", "dist", ".env", "playwright-report", "test-results", "lhci_reports"];
let giContent = exists(gitignorePath) ? fs.readFileSync(gitignorePath, "utf8") : "";
for (const line of gitignoreAdds) {
  if (!giContent.split("\n").includes(line)) giContent += (giContent.endsWith("\n") ? "" : "\n") + line + "\n";
}
if (!reviewMode) writeFile(".gitignore", giContent);
summary.updated.push(".gitignore");

// 3) package.json: merge scripts de forma segura
const pkgPath = path.join(ROOT, "package.json");
if (!exists(pkgPath)) {
  summary.warnings.push("No se encontró package.json. Este repo no parece un proyecto Node.");
} else {
  const pkg = readJSON(pkgPath);
  pkg.scripts ||= {};
  const addScripts = {
    "dev": pkg.scripts.dev || "vite",
    "build": pkg.scripts.build || "vite build",
    "preview": pkg.scripts.preview || "vite preview",
    "test": pkg.scripts.test || "vitest run",
    "test:watch": pkg.scripts["test:watch"] || "vitest",
    "typecheck": pkg.scripts.typecheck || "tsc --noEmit",
    "lint": pkg.scripts.lint || "eslint . --ext .ts,.tsx --max-warnings 0",
    "format": pkg.scripts.format || "prettier --check .",
    "format:write": pkg.scripts["format:write"] || "prettier --write .",
    "a11y:check": pkg.scripts["a11y:check"] || "vitest run tests/a11y --reporter=dot",
    "e2e": pkg.scripts.e2e || "playwright test",
    "lhci": pkg.scripts.lhci || "lhci autorun"
  };
  const before = JSON.stringify(pkg.scripts);
  Object.assign(pkg.scripts, addScripts);
  const after = JSON.stringify(pkg.scripts);
  if (before !== after) {
    if (!reviewMode) fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf8");
    summary.updated.push("package.json (scripts)");
  }

  // Dev dependencies sugeridas (solo las listamos; no instalamos)
  const suggested = [
    "vitest","@testing-library/react","@testing-library/jest-dom","jest-axe","@types/jest-axe","jsdom",
    "@playwright/test","playwright","@lhci/cli",
    "prettier","stylelint","stylelint-config-standard","stylelint-config-prettier",
    "eslint-plugin-jsx-a11y","wait-on"
  ];
  const currentDeps = Object.assign({}, pkg.devDependencies, pkg.dependencies);
  const missing = suggested.filter((d) => !currentDeps || !currentDeps[d]);
  if (missing.length) summary.nextDeps = missing;
}

// 4) Detect runner
const hasVitestCfg = exists(path.join(ROOT, "vitest.config.ts")) || exists(path.join(ROOT, "vitest.config.js"));
const hasJestCfg = exists(path.join(ROOT, "jest.config.ts")) || exists(path.join(ROOT, "jest.config.js"));
if (hasVitestCfg && hasJestCfg) {
  summary.warnings.push("Detectado Vitest y Jest. Mantén solo UNO para evitar conflictos.");
}

// 5) .env warning
if (exists(path.join(ROOT, ".env"))) {
  summary.warnings.push("Se detectó .env en el repo. Sube solo .env.example y usa GitHub Secrets. Rota claves expuestas.");
}

// 6) Output resumen
const banner = `
Forgecraft QA Boot — ${reviewMode ? "REVIEW" : "WRITE"} MODE
-----------------------------------------------------------`;
console.log(banner);
console.log("Archivos creados:", summary.created);
console.log("Archivos actualizados:", summary.updated);
if (summary.nextDeps.length) {
  console.log("\nDependencias de desarrollo sugeridas (instala estas):\n",
    "npm i -D " + summary.nextDeps.join(" "));
}
if (summary.warnings.length) {
  console.log("\nAdvertencias:");
  for (const w of summary.warnings) console.log(" -", w);
}
console.log("\nListo.");
