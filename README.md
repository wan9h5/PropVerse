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
Seeding creates 30 draft asset records. The first collection ships with five visual references, each with an image and prompts in six languages. After seeding, publish the collection to the local database with:

    node --env-file=.env --import tsx prisma/collections/publish-first-release.ts

The command treats already published collection records as complete. The remaining 25 records are drafts. Open http://127.0.0.1:3000/zh-CN/library after starting the dev server.

## Local MySQL (Docker)

Use Node.js 20.6+ (Node 22 or 24 recommended). Local commands run from this repository.
The local instance is isolated from other projects:
- Compose project: propverse-local
- MySQL 8.0: 127.0.0.1:3307, database/user: propverse
- Persistent volume: propverse-local_mysql-data
- Database passwords and the admin token are in ignored .env; do not commit them.

For a new checkout, copy .env.example to .env, replace both password placeholders
and the admin token with random secrets, and use the same app password in
MYSQL_PASSWORD and DATABASE_URL. URL-encode passwords in DATABASE_URL.
Then run:

    npm install
    npm run db:up
    npx prisma validate
    npm run db:generate
    npm run db:push
    npm run db:seed
    npm run db:verify

The seed loads .env explicitly, runs in a transaction, and only creates missing
records. It preserves existing names, ordering, publication state and content.
It creates five categories with six translated names each, plus 30 DRAFT assets
with initial Simplified Chinese names (12/8/5/4/1 per category). Full prompts,
other asset locales, images and 3D models still require authoring and review.
The verification command reads all nine tables and reports counts and a data
fingerprint; identical fingerprints before and after reseeding confirm no changes.

db:push is for the initial local database. Review schema differences before
applying future changes to a populated database. Do not use reset, force-reset,
accept-data-loss, Docker volume removal, or pruning on this environment.
To resume an existing local database, run npm run db:up. Preserve its .env
credentials with its volume; changing MYSQL_PASSWORD does not rotate an
already initialized MySQL user's password. No Vercel deployment is required.
