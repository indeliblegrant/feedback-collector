# Feedback Collector

A small full-stack app for collecting and reviewing feedback. Visitors leave a star rating and a comment. An admin page lists every review with summary stats, filters, delete, and CSV export.

- **Frontend (this repository):** React (JavaScript) built with Vite, plain CSS, no router (page switching uses state)
- **Backend (hosted separately, not in this repository):** plain PHP 8 with PDO and a SQLite database

> **Portfolio project note:** the Admin page has **no authentication by design**. Anyone with the URL can view and delete reviews. Do not store real or sensitive data in the deployed demo.

## Features

**Submit page**
- Optional name (max 100 characters)
- Required 5-star rating with hover preview, keyboard accessible (real buttons with aria-labels)
- Required comment, max 500 characters, with a live counter
- Inline validation errors, a "Submitting..." state, and a thank-you message

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
├── .env.example              # VITE_API_BASE_URL
└── src/
    ├── main.jsx
    ├── App.jsx               # switches between Submit and Admin using state
    ├── index.css
    ├── components/           # one component per file, each with its own CSS
    │   ├── NavBar.jsx
    │   ├── SubmitPage.jsx
    │   ├── FeedbackForm.jsx
    │   ├── StarRating.jsx    # clickable stars
    │   ├── StarDisplay.jsx   # read-only stars
    │   ├── AdminPage.jsx
    │   ├── SummaryCards.jsx
    │   ├── ReviewFilters.jsx
    │   ├── ReviewTable.jsx
    │   ├── ReviewRow.jsx
    │   ├── ExportButton.jsx
    │   ├── EmptyState.jsx
    │   └── ErrorMessage.jsx
    ├── hooks/
    │   └── useReviews.js     # loads and deletes reviews through the API
    └── utils/
        ├── api.js            # the only place that calls fetch
        └── exportCsv.js      # CSV building, escaping and download
```

## Requirements

- Node.js 18+ and npm
- Git
- A running backend that follows the API contract below. The PHP backend is not part of this repository, so you need your own copy of it, or any server that implements the same three routes.

## Local setup

### 1. Clone and install

```bash
git clone <your-repo-url> feedback-collector
cd feedback-collector
npm install
```

### 2. Configure the environment

```bash
cp .env.example .env
```

On Windows PowerShell use `Copy-Item .env.example .env`.

Set the backend address in `.env` (no trailing slash):

```
VITE_API_BASE_URL=http://localhost:8000
```

Use your live API address instead if you want to develop against the deployed backend. In that case the backend's `ALLOWED_ORIGINS` must include `http://localhost:5173`.

### 3. Run it

```bash
npm run dev
```

Open http://localhost:5173. Restart `npm run dev` after changing `.env`, because Vite reads it at startup.

### Build

```bash
npm run build
npm run preview
```

## Environment variables

| Variable | Description |
| --- | --- |
| `VITE_API_BASE_URL` | Base URL of the PHP API, no trailing slash. Baked in at build time, so rebuild or redeploy after changing it. |

`.env` is git-ignored. Only `.env.example` is committed.

## API contract

The frontend expects these routes under `VITE_API_BASE_URL`:

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/reviews` | List all reviews |
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

Expected status codes: `200` list, `201` created, `204` deleted (no body), `404` not found, `422` validation failed. Error responses are JSON with a `message` and, for `422`, an `errors` object keyed by field (`name`, `rating`, `comment`). The frontend shows these messages inline.

The backend must also send CORS headers allowing the frontend's origin, and answer `OPTIONS` preflight requests (the app sends `POST` with JSON and `DELETE`).

## Deployment (Vercel)

1. Import the repository into Vercel (Vite is detected automatically).
2. Under **Settings → Environment Variables**, add `VITE_API_BASE_URL` set to the live API base URL (no trailing slash).
3. Redeploy. The variable is applied at build time, so saving it alone changes nothing.
4. Add the Vercel URL to the backend's allowed origins (`ALLOWED_ORIGINS`). It must match exactly: `https`, no trailing slash, no path. Preview deployments get random URLs and will be blocked unless added.

## Backend notes (separate codebase)

The PHP backend is kept outside this repository. Summary of how it is set up:

- Plain PHP 8 with PDO, SQLite database in a `data/` folder outside the public web root
- Single entry point (`public/index.php`) that routes the three API routes
- Settings in `backend/.env`: `APP_ENV`, `APP_DEBUG`, `DB_PATH`, `ALLOWED_ORIGINS`, `API_BASE_PATH` (only for subfolder hosting) and reserved `SESSION_*` values
- When hosted in a subfolder, `API_BASE_PATH` must match the URL used by the frontend, for example `/feedback-collector/public` for `.../feedback-collector/public/reviews`, or `/feedback-collector/public/index.php` if URL rewriting is not available
- The `data/` folder must be writable by the web server user, and neither `data/` nor `.env` may be reachable by URL
- Never run the server as root

## Troubleshooting

| Problem | Cause and fix |
| --- | --- |
| "Could not reach the server" | The backend is down, or `VITE_API_BASE_URL` is wrong. |
| Requests go to `undefined/reviews` | `VITE_API_BASE_URL` was not set when the app was built. Set it and redeploy. |
| CORS error in the browser console | The backend's `ALLOWED_ORIGINS` does not exactly match the frontend address. |
| `{"message":"Not found."}` from the API | The URL does not match the backend's `API_BASE_PATH`, or URL rewriting is not working. |
| Changes to `.env` have no effect | Restart `npm run dev` (or redeploy on Vercel). |

## Security notes

- **No authentication by design.** This is a demo. Anyone who can reach the API can list and delete reviews. Add a login before using it for real data.
- CSV export neutralises spreadsheet formulas and escapes quotes, commas and line breaks.
- The backend validates all input again and uses prepared statements for every query.

## Possible next steps

- Admin login
- Pagination for large numbers of reviews
- Unit tests for `exportCsv.js` and the form validation
- Add the backend to a repository of its own, with a README for it
