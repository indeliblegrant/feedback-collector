# Feedback Collector

A small full-stack app for collecting and reviewing feedback. Visitors leave a star rating and a comment. An admin page lists every review with summary stats, filters, delete, and CSV export.

- **Frontend:** React (JavaScript) built with Vite, plain CSS, no router (page switching uses state)
- **Backend:** plain PHP 8 with PDO, no framework, no Composer
- **Database:** SQLite (a single file)

> **Portfolio project note:** the Admin page has **no authentication by design**. Anyone with the URL can view and delete reviews. Do not store real or sensitive data in a deployed demo.

## Features

**Submit page**
- Optional name (max 100 characters)
- Required 5-star rating with hover preview, keyboard accessible (real buttons with aria-labels)
- Required comment, max 500 characters, with a live counter
- Inline validation errors, a "Submitting..." state, and a thank-you message
- Server-side validation too, so the API never trusts the browser

**Admin page**
- Table of reviews (date, name, rating as stars, comment), newest first
- Summary cards: total reviews and average rating (1 decimal)
- Filter by star rating (All, 1 to 5) and search comment text
- Delete with an inline confirm step
- Friendly empty states, plus loading and error states with a "Try again" button
- **Export CSV** of the currently filtered reviews (`feedback-YYYY-MM-DD.csv`)
  - Every field is wrapped in double quotes and inner quotes are doubled
  - Formula injection protection: cells starting with `=`, `+`, `-` or `@` get a leading `'`

## Project structure

```
feedback-collector/
├── index.html
├── package.json
├── .env.example              # frontend env (VITE_API_BASE_URL)
├── src/
│   ├── main.jsx
│   ├── App.jsx               # switches between Submit and Admin using state
│   ├── index.css
│   ├── components/           # one component per file, each with its own CSS
│   │   ├── NavBar.jsx
│   │   ├── SubmitPage.jsx
│   │   ├── FeedbackForm.jsx
│   │   ├── StarRating.jsx    # clickable stars
│   │   ├── StarDisplay.jsx   # read-only stars
│   │   ├── AdminPage.jsx
│   │   ├── SummaryCards.jsx
│   │   ├── ReviewFilters.jsx
│   │   ├── ReviewTable.jsx
│   │   ├── ReviewRow.jsx
│   │   ├── ExportButton.jsx
│   │   ├── EmptyState.jsx
│   │   └── ErrorMessage.jsx
│   ├── hooks/
│   │   └── useReviews.js     # loads and deletes reviews through the API
│   └── utils/
│       ├── api.js            # the only place that calls fetch
│       └── exportCsv.js      # CSV building, escaping and download
└── backend/
    ├── .env.example          # backend env
    ├── .htaccess             # blocks private files when served from a subfolder
    ├── bin/
    │   └── init-db.php       # creates the database from the terminal
    ├── data/                 # SQLite file lives here (git-ignored, created automatically)
    ├── public/
    │   ├── index.php         # single entry point and router
    │   └── .htaccess         # sends all requests to index.php (Apache)
    └── src/
        ├── Env.php
        ├── Database.php
        ├── Cors.php
        ├── Response.php
        ├── ReviewRepository.php   # all the SQL
        └── ReviewController.php   # validation and responses
```

## Requirements

- Node.js 18+ and npm
- PHP 8.0+ with the `pdo_sqlite` and `mbstring` extensions
- Git

Check PHP:

```bash
php -v
php -m    # should list pdo_sqlite and mbstring
```

## Local setup

### 1. Clone and install

```bash
git clone <your-repo-url> feedback-collector
cd feedback-collector
npm install
```

### 2. Configure the environment files

```bash
cp .env.example .env
cp backend/.env.example backend/.env
```

On Windows PowerShell use `Copy-Item` instead of `cp`.

Frontend `.env` (project root):

```
VITE_API_BASE_URL=http://localhost:8000
```

Backend `backend/.env` for local development:

```
APP_ENV=local
APP_DEBUG=false
DB_PATH=data/app.sqlite
ALLOWED_ORIGINS=http://localhost:5173
SESSION_SAMESITE=Lax
SESSION_SECURE=false
API_BASE_PATH=
```

### 3. Create the database

```bash
cd backend
php bin/init-db.php
```

This creates `backend/data/app.sqlite` and the `reviews` table. It is safe to run more than once and never deletes data. The API also creates the database automatically on its first request.

### 4. Run it (two terminals)

Backend, from the `backend` folder:

```bash
php -S localhost:8000 -t public public/index.php
```

Frontend, from the project root:

```bash
npm run dev
```

Open http://localhost:5173. Restart `npm run dev` after changing `.env`, because Vite reads it at startup.

## Environment variables

### Frontend (`.env`)

| Variable | Description |
| --- | --- |
| `VITE_API_BASE_URL` | Base URL of the PHP API, no trailing slash. Baked in at build time, so rebuild or redeploy after changing it. |

### Backend (`backend/.env`)

| Variable | Description |
| --- | --- |
| `APP_ENV` | `local` or `production`. |
| `APP_DEBUG` | `true` shows real error messages in API responses. Keep `false` in production. |
| `DB_PATH` | SQLite file location. Relative paths start from the backend folder. Keep it outside `public/`. |
| `ALLOWED_ORIGINS` | Websites allowed to call the API, comma separated, no trailing slash. |
| `SESSION_SAMESITE` | Reserved for a future login. Not used yet. |
| `SESSION_SECURE` | Reserved for a future login. Not used yet. |
| `API_BASE_PATH` | Only needed when the API is served from a subfolder. Empty for local `php -S`. |

`.env` files are git-ignored. Only the `.env.example` files are committed.

## API

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/reviews` | List all reviews, newest first |
| `POST` | `/reviews` | Create a review. Body: `{ "name": "", "rating": 1-5, "comment": "..." }` |
| `DELETE` | `/reviews/{id}` | Delete a review |

Review object:

```json
{
  "id": "a1b2c3d4e5f60718",
  "name": "Ada",
  "rating": 5,
  "comment": "Great service",
  "createdAt": "2026-11-07T15:39:17Z"
}
```

Status codes: `200` list, `201` created, `204` deleted, `404` not found, `422` validation failed (with an `errors` object per field), `500` server error. All SQL uses prepared statements.

## Deployment

### Backend (PHP host)

1. Upload the contents of `backend/` to the server, for example as `/var/www/html/feedback-collector/`.
2. Create `backend/.env` on the server with production values:

   ```
   APP_ENV=production
   APP_DEBUG=false
   DB_PATH=data/app.sqlite
   ALLOWED_ORIGINS=https://your-frontend.vercel.app
   SESSION_SAMESITE=None
   SESSION_SECURE=true
   API_BASE_PATH=/feedback-collector/public
   ```

   `ALLOWED_ORIGINS` must match the frontend address exactly: `https`, no trailing slash, no path. List several origins separated by commas.
3. Make the `data` folder writable by the web server user (see Troubleshooting) and create the database:

   ```bash
   sudo -u www-data php bin/init-db.php
   ```
4. Confirm `https://your-domain/feedback-collector/public/reviews` returns `[]`.
5. Confirm private files are blocked. These must **not** be readable:
   - `https://your-domain/feedback-collector/.env`
   - `https://your-domain/feedback-collector/data/app.sqlite`

If possible, point the site's document root directly at `backend/public`. Then `data/` and `.env` are never reachable by URL.

#### If `/reviews` returns `{"message":"Not found."}`

The router removes `API_BASE_PATH` from the start of the URL and expects `/reviews` to be left. The base path must match the URL you actually use:

| URL you open | `API_BASE_PATH` |
| --- | --- |
| `.../feedback-collector/public/reviews` (rewrites working) | `/feedback-collector/public` |
| `.../feedback-collector/public/index.php/reviews` (no rewrites) | `/feedback-collector/public/index.php` |

Rewrites need `public/.htaccess`, Apache `mod_rewrite`, and `AllowOverride All`. On Nginx, `.htaccess` is ignored and the server block needs `try_files $uri /index.php?$query_string;`.

### Frontend (Vercel)

1. Import the repository into Vercel (Vite is detected automatically).
2. Under **Settings → Environment Variables**, add `VITE_API_BASE_URL` set to the live API base URL (no trailing slash), for example `https://your-domain/feedback-collector/public`.
3. Redeploy. The variable is applied at build time, so saving it alone changes nothing.
4. Add the Vercel URL to `ALLOWED_ORIGINS` on the backend. Preview deployments have random URLs and will be blocked by CORS unless added.

## Troubleshooting

| Problem | Cause and fix |
| --- | --- |
| `Cannot redeclare class ...` | A PHP file contains the wrong class. Each file in `backend/src` should declare the class matching its filename. Check with `grep -n "^final class" src/*.php`. |
| `unable to open database file` | PHP cannot create or write the `data` folder. Give the web user ownership: `sudo chown -R www-data:www-data data && sudo chmod 775 data`. Use your own user if you run `php -S`. |
| `attempt to write a readonly database` | The database file is owned by a different user (often root after using plain `sudo`). Fix ownership of `data/` and `data/app.sqlite`. Run the init script as the web user, not root. |
| Writes still fail although permissions look right | The service may be sandboxed (systemd `ProtectSystem`), or SELinux may block writes. Add `ReadWritePaths=<data folder>` with `sudo systemctl edit apache2`, or run `sudo chcon -R -t httpd_sys_rw_content_t data`. |
| "Could not reach the server" in the app | The backend is down, or `VITE_API_BASE_URL` is wrong or was not set before the build. |
| CORS error in the browser console | `ALLOWED_ORIGINS` does not exactly match the frontend address. |
| Requests go to `undefined/reviews` | `VITE_API_BASE_URL` was not set when the frontend was built. Set it and redeploy. |

Set `APP_DEBUG=true` temporarily to see the real error message in API responses, and set it back to `false` afterwards.

## Security notes

- **No authentication by design.** This is a demo. Anyone who can reach the API can list and delete reviews. Add a login before using this for real data.
- **Never run the server as root**, even locally. It makes the database root-owned and gives every request full system access.
- All SQL uses PDO prepared statements.
- Input is validated on both the client and the server.
- CSV export neutralises spreadsheet formulas and escapes quotes, commas and line breaks.
- `.env` and `data/` must never be web-accessible.
- Back up `data/app.sqlite`, since it holds the only copy of the reviews.

## Possible next steps

- Admin login using the reserved `SESSION_*` settings
- Pagination for large numbers of reviews
- Unit tests for `exportCsv.js` and the validation rules
- Rate limiting on `POST /reviews`
