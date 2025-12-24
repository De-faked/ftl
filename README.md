# Fos7a Taibah Institute

Official website for Fos7a Taibah Institute, a premier Arabic language center located in Al-Madinah Al-Munawwarah.

## About
Part of PT Dima Khriza Group Co.

## Features

- **Course Advisor**: Interactive tool to recommend courses based on student needs.
- **Student Portal**: Dashboard for managing enrollments, documents, and generating visa letters.
- **Course Management**: Detailed course listings with real-time capacity tracking.
- **Admin Dashboard**: Kanban-style application tracking and student management.
- **Multilingual**: Full support for English, Arabic, and Indonesian (RTL/LTR).

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Vite
- Lucide React

## Getting Started

1. Clone the repository
   ```bash
   git clone https://github.com/fos7a-taibah/website.git
   ```
2. Install dependencies
   ```bash
   npm install
   ```
3. Run the development server
   ```bash
   npm run dev
   ```

## Local setup

1. Copy the example environment file to a local override and edit the values from your Supabase project (Settings → API → Project URL and anon/publishable key):
   ```bash
   cp .env.example .env.local
   ```
2. Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` with the public (client-exposed) values from Supabase. **Do not** use secret or service role keys in the frontend.
3. Install dependencies and start the dev server:
   ```bash
   npm install
   npm run dev
   ```
4. Open the browser console and confirm the `SUPABASE SESSION` log appears while in dev mode.

## Deployment

Live production deployment: http://ftl.ptdima.sa/

### Automated (Netlify via GitHub Actions)
Pushes to `main` or `work` trigger the Netlify deploy workflow located at `.github/workflows/netlify-deploy.yml`. To enable it:

1. Create two repository secrets in GitHub:
   - `NETLIFY_AUTH_TOKEN` – a personal access token from Netlify with deploy permissions.
   - `NETLIFY_SITE_ID` – the Netlify site ID for `ftl.ptdima.sa`.
2. Push your changes to `main` or `work`. The action will install dependencies, run `npm run build`, and deploy the `dist/` directory to Netlify.

#### Quick path to get fixes live
If you want updates to appear on http://ftl.ptdima.sa/ as soon as you finish coding:

1. Commit your changes locally.
   ```bash
   git add .
   git commit -m "<meaningful message>"
   ```
2. Push directly to `main` or `work` (whichever is configured for production).
   ```bash
   git push origin main   # or: git push origin work
   ```
3. Watch the **Actions** tab in GitHub for the “Deploy to Netlify” run. Once it finishes, Netlify will publish the new build to `ftl.ptdima.sa` automatically.

If you push to a different branch, open a PR and merge it into `main` or `work`; the deploy will run after the merge.

### Manual (Local Netlify CLI)

If you prefer to deploy from your machine:

1. Install dependencies and build the site:
   ```bash
   npm ci
   npm run build
   ```
2. Deploy with the Netlify CLI (requires `NETLIFY_AUTH_TOKEN` to be set):
   ```bash
   npx netlify-cli deploy --dir=dist --prod --message "Manual deploy"
   ```

For smoke testing before a production push, you can substitute `--prod` with `--draft` to create a preview deploy URL.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

Copyright (c) 2024 Fos7a Taibah Institute
