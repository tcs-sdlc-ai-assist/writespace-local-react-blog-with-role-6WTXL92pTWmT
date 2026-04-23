# Deployment Guide

This document covers everything you need to deploy **WriteSpace** to production. Since WriteSpace is a fully client-side application with no backend or environment variables, deployment is straightforward on any static hosting platform.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Build for Production](#build-for-production)
- [Vercel Deployment](#vercel-deployment)
  - [Option 1: Auto-Deploy from GitHub](#option-1-auto-deploy-from-github)
  - [Option 2: Vercel CLI](#option-2-vercel-cli)
  - [SPA Rewrite Configuration](#spa-rewrite-configuration)
- [Other Hosting Platforms](#other-hosting-platforms)
  - [Netlify](#netlify)
  - [GitHub Pages](#github-pages)
  - [Cloudflare Pages](#cloudflare-pages)
  - [Self-Hosted (Nginx)](#self-hosted-nginx)
- [Environment Variables](#environment-variables)
- [CI/CD Notes](#cicd-notes)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

- **Node.js** >= 18
- **npm** >= 9
- A GitHub, GitLab, or Bitbucket repository containing the project source code

---

## Build for Production

Run the following commands to generate optimized static files:

```bash
# Install dependencies
npm install

# Build for production
npm run build
```

This outputs all static assets to the `dist/` directory. You can preview the production build locally before deploying:

```bash
npm run preview
```

The preview server runs at [http://localhost:4173](http://localhost:4173) by default.

### Build Output

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
```

The `dist/` directory is the only artifact needed for deployment. Upload or serve this directory from any static hosting provider.

---

## Vercel Deployment

Vercel is the recommended hosting platform for WriteSpace. The project includes a pre-configured `vercel.json` file for seamless deployment.

### Option 1: Auto-Deploy from GitHub

This is the easiest approach and enables automatic deployments on every push.

1. **Push your repository** to GitHub (or GitLab / Bitbucket).

2. **Import the project** in [Vercel](https://vercel.com):
   - Go to your Vercel dashboard.
   - Click **"Add New…"** → **"Project"**.
   - Select your repository from the list.

3. **Configure build settings** — Vercel auto-detects Vite, but verify the following:

   | Setting            | Value           |
   | ------------------ | --------------- |
   | Framework Preset   | Vite            |
   | Build Command      | `npm run build` |
   | Output Directory   | `dist`          |
   | Install Command    | `npm install`   |
   | Node.js Version    | 18.x or later   |

4. **Click "Deploy"** — Vercel will install dependencies, build the project, and deploy it.

5. **Automatic deployments** are now enabled:
   - Every push to the `main` branch triggers a **production deployment**.
   - Every push to other branches or pull requests triggers a **preview deployment** with a unique URL.

### Option 2: Vercel CLI

For manual or local deployments using the Vercel CLI:

```bash
# Install the Vercel CLI globally
npm install -g vercel

# Login to your Vercel account
vercel login

# Deploy from the project root (first time — follow the prompts)
vercel

# Deploy directly to production
vercel --prod
```

The CLI will detect the Vite configuration and apply the correct build settings automatically.

### SPA Rewrite Configuration

WriteSpace uses client-side routing via React Router v6. All routes must be rewritten to `index.html` so the React app can handle them. The included `vercel.json` handles this:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

This ensures that navigating directly to any route (e.g., `/blogs`, `/admin`, `/blogs/read/some-id`) serves `index.html` instead of returning a 404.

> **Important:** Do not remove or modify `vercel.json` unless you understand the impact on client-side routing. Without this rewrite rule, refreshing the browser on any route other than `/` will result in a 404 error.

---

## Other Hosting Platforms

### Netlify

1. Push your repository to GitHub.
2. Import the project in [Netlify](https://netlify.com).
3. Set the build settings:

   | Setting          | Value           |
   | ---------------- | --------------- |
   | Build Command    | `npm run build` |
   | Publish Directory| `dist`          |

4. Create a `netlify.toml` file in the project root (or add a `_redirects` file to `public/`):

   **Option A — `netlify.toml`:**

   ```toml
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

   **Option B — `public/_redirects`:**

   ```
   /*    /index.html   200
   ```

5. Deploy.

### GitHub Pages

GitHub Pages does not natively support SPA rewrites. Use a `404.html` workaround:

1. Add a `404.html` file to the `public/` directory with the same content as `index.html`.
2. Update `vite.config.js` to set the correct base path if deploying to a subpath:

   ```js
   export default defineConfig({
     plugins: [react()],
     base: '/your-repo-name/',
   })
   ```

3. Build and deploy the `dist/` directory to the `gh-pages` branch.

> **Note:** GitHub Pages has limitations with client-side routing. Vercel or Netlify are preferred for a smoother experience.

### Cloudflare Pages

1. Push your repository to GitHub.
2. Import the project in [Cloudflare Pages](https://pages.cloudflare.com).
3. Set the build settings:

   | Setting          | Value           |
   | ---------------- | --------------- |
   | Build Command    | `npm run build` |
   | Build Output     | `dist`          |

4. Cloudflare Pages automatically handles SPA routing — no additional configuration is needed.

### Self-Hosted (Nginx)

If you are serving the `dist/` directory from your own Nginx server, add the following to your server block to support client-side routing:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

The `try_files` directive ensures that all routes fall back to `index.html`.

---

## Environment Variables

WriteSpace does **not** require any environment variables. All data is stored entirely in the browser using `localStorage`. There are no API keys, database connection strings, or server-side secrets to configure.

| Variable | Required | Description |
| -------- | -------- | ----------- |
| —        | —        | None needed |

If you extend the project in the future to include a backend API, you can add environment variables using Vite's built-in support:

- Create a `.env` file in the project root.
- Prefix all client-side variables with `VITE_` (e.g., `VITE_API_URL`).
- Access them in code via `import.meta.env.VITE_API_URL`.

See the [Vite environment variables documentation](https://vitejs.dev/guide/env-and-mode.html) for details.

---

## CI/CD Notes

### Automatic Deployments with Vercel + GitHub

Once connected, Vercel handles CI/CD automatically:

- **Production deploys** are triggered on every push to the `main` branch.
- **Preview deploys** are triggered on every push to any other branch or on pull request creation.
- Each preview deployment gets a unique URL for testing before merging.

No additional CI/CD pipeline configuration (e.g., GitHub Actions) is required for basic deployment.

### Adding a CI Pipeline (Optional)

If you want to add linting, testing, or other checks before deployment, you can create a GitHub Actions workflow:

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: npm

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build
```

This workflow runs on every push and pull request to `main`, ensuring the project builds successfully. Vercel will still handle the actual deployment separately.

### Branch Protection (Recommended)

For team workflows, consider enabling branch protection on `main`:

1. Go to your GitHub repository → **Settings** → **Branches**.
2. Add a branch protection rule for `main`.
3. Enable **"Require status checks to pass before merging"**.
4. Select the Vercel deployment check and/or your CI workflow as required checks.

This ensures that only code that builds and deploys successfully can be merged into production.

---

## Troubleshooting

### Routes return 404 on page refresh

**Cause:** The hosting platform is not configured to rewrite all routes to `index.html`.

**Fix:** Ensure your hosting platform has SPA rewrite rules configured. See the platform-specific sections above.

### Blank page after deployment

**Cause:** The `base` path in `vite.config.js` does not match the deployment URL.

**Fix:** If deploying to the root of a domain (e.g., `https://yourapp.vercel.app/`), no changes are needed — the default base path (`/`) is correct. If deploying to a subpath, update `vite.config.js`:

```js
export default defineConfig({
  plugins: [react()],
  base: '/your-subpath/',
})
```

### Old data persists after redeployment

**Cause:** WriteSpace stores all data in `localStorage`, which persists across deployments.

**Fix:** This is expected behavior. Users retain their data between deployments. If you need to reset data during development, clear `localStorage` manually via the browser's developer tools:

```js
localStorage.removeItem('writespace_session');
localStorage.removeItem('writespace_users');
localStorage.removeItem('writespace_posts');
```

### Build fails with dependency errors

**Cause:** Outdated or missing dependencies.

**Fix:** Delete `node_modules` and `package-lock.json`, then reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## Summary

| Item                  | Value                                      |
| --------------------- | ------------------------------------------ |
| Build Command         | `npm run build`                            |
| Output Directory      | `dist`                                     |
| Node.js Version       | >= 18                                      |
| Environment Variables | None required                              |
| SPA Rewrites          | All routes → `index.html` (via `vercel.json`) |
| Recommended Platform  | [Vercel](https://vercel.com)               |