# Vike Vercel Kit

Reusable starter kit for Vike projects that need:

- prerendered HTML for SEO and Google
- client-side navigation after hydration
- Vercel static deployment

## What to copy into a project

- `vite.config.ts.template` -> `vite.config.ts`
- `pages/+config.ts.template` -> `pages/+config.ts`
- `pages/+onBeforeRoute.ts.template` -> `pages/+onBeforeRoute.ts`
- `pages/index/+config.ts.template` -> `pages/index/+config.ts`
- `pages/index/+onBeforePrerenderStart.ts.template` -> `pages/index/+onBeforePrerenderStart.ts`
- `pages/about/+config.ts.template` -> `pages/about/+config.ts`
- `pages/about/+onBeforePrerenderStart.ts.template` -> `pages/about/+onBeforePrerenderStart.ts`
- `vercel.json.template` -> `vercel.json`

## Project-specific placeholders

Replace every placeholder with values from the target project:

- `__PROJECT_NAME__`
- `__PROJECT_DESCRIPTION__`
- `__DEFAULT_LANG__`
- `__SUPPORTED_LANGS__`
- `__ROUTES__`
- `__SITE_URL__`
- `__PAGE_TITLES__`
- `__PAGE_DESCRIPTIONS__`

## Notes

- This kit is for static prerender + client-side routing.
- Do not use experimental Vercel SSR adapters unless you explicitly need runtime SSR.
- If a project has more routes, add more page-level `+config.ts` and `+onBeforePrerenderStart.ts` files using the same pattern.
