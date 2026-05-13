# BookVerse Frontend

React + Vite frontend for BookVerse.

## Local Setup

Use Node `20.19+`, `22.13+`, or `24+`.

```bash
npm install
npm run dev
```

Create a local `.env` file from `.env.example`:

```bash
VITE_API_URL=http://localhost:5000/api
```

## Production Build

```bash
npm run lint
npm run build
npm run preview
```

## Vercel Deployment

Use these settings in Vercel:

- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

Add this environment variable in the Vercel project settings:

```bash
VITE_API_URL=https://your-api-domain.com/api
```

The included `vercel.json` rewrites all routes to `index.html`, so direct visits to routes like `/catalog`, `/product/:id`, and `/dashboard` work correctly.
