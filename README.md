# PropVerse

A visual reference library for global AI short-film creators.

PropVerse helps creators find objects, architecture, culture, landscapes and special visual references they can picture but cannot easily describe. Each asset provides professionally written prompts and on-site visual references. Assets may include AI-generated 2D images and AI-generated 3D preview models.

## Phase 1
- Five categories: Objects, Architecture, Culture, Landscapes, Special.
- Six locales: Simplified Chinese, Traditional Chinese, English, Korean, Japanese and French.
- First content batch: 30 asset records.
- AI-generated 2D image references and selected 3D models rendered with Three.js.
- No asset download or export.
- Admin-managed content with draft/review/published lifecycle.
- Next.js App Router, MySQL, Prisma, Cloudflare R2 and Vercel.

## Local development
1. Copy `.env.example` to `.env` and configure `DATABASE_URL` and `ADMIN_API_TOKEN`.
2. Install dependencies: `npm install`.
3. Generate Prisma client: `npm run db:generate`.
4. Apply schema: `npm run db:push`.
5. Seed categories and 30 draft asset records: `npm run db:seed`.
6. Start: `npm run dev`.

## Admin
Open `/zh-CN/admin` and enter `ADMIN_API_TOKEN`. The admin API supports listing, creating, updating and deleting assets. Public Library pages only expose PUBLISHED assets.

## Important
The 30 initial asset records are draft records only. They do not yet contain generated reference images, 3D models or complete six-language prompts. Those need to be created, reviewed and registered before publication.
