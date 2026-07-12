# CivicPulse AI — Backend

Express + MongoDB API for the CivicPulse AI frontend. Covers auth, issue reporting
with photo/geolocation, AI-drafted complaint emails, AI document guidance, and
AI government scheme matching.

## Stack

- **Node.js / Express** — REST API
- **MongoDB / Mongoose** — data store (geospatial index on issues for map queries)
- **JWT (access + rotating refresh tokens)** — auth, refresh token stored server-side and rotated on every use
- **Cloudinary** — issue photo storage
- **Google Gemini (`@google/genai`)** — categorization, complaint drafting, document guides, scheme matching
- **Nodemailer** — sends the AI-drafted complaint emails
- **helmet, cors, express-rate-limit, express-mongo-sanitize, compression** — hardening & performance

## Setup

```bash
cd civicpulse-backend
npm install
cp .env.example .env   # fill in MongoDB URI, JWT secrets, Cloudinary, Gemini key, SMTP creds
npm run dev             # nodemon, http://localhost:5000
```

Generate strong values for `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET`, e.g.:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

For Gmail SMTP, use an **App Password** (not your normal password) — enable 2FA on the account first, then generate one under Google Account → Security → App passwords.

## Auth model

- **Access token**: short-lived (15m), sent as an httpOnly cookie *and* returned in the JSON body so it can also be sent as `Authorization: Bearer <token>` from mobile/non-cookie clients.
- **Refresh token**: longer-lived (10d), httpOnly cookie, stored on the user document, **rotated on every refresh** — the old token stops working the moment a new one is issued, so a leaked-but-unused old token becomes worthless as soon as the legitimate client refreshes.
- Passwords hashed with bcrypt (cost factor 12).

Mirrors the same access/refresh + silent-interceptor pattern already used in Saarthi, so the frontend axios setup should feel familiar: on a 401, call `POST /api/v1/auth/refresh`, retry the original request once.

## API Reference

Base URL: `/api/v1`

### Auth
| Method | Route | Auth | Body |
|---|---|---|---|
| POST | `/auth/register` | — | `fullName, email, password, phone?` |
| POST | `/auth/login` | — | `email, password` |
| POST | `/auth/refresh` | refresh cookie | — |
| POST | `/auth/logout` | ✅ | — |
| GET | `/auth/me` | ✅ | — |
| PATCH | `/auth/me` | ✅ | `fullName?, phone?, age?, gender?, annualIncome?, state?, category?, occupation?` |

### Issues (pothole / streetlight / trash)
| Method | Route | Auth | Notes |
|---|---|---|---|
| POST | `/issues` | ✅ | `multipart/form-data`: `description, lat, lng, address?, photo?`. AI categorizes type/department/priority server-side. |
| GET | `/issues` | ✅ | Query: `status, type, mine=true, near=lng,lat, radiusKm` |
| GET | `/issues/:id` | ✅ | |
| PATCH | `/issues/:id/status` | ✅ (admin) | `{ status }` |

### Complaints (AI-drafted emails: waterlogging / inefficient service / crime rate)
| Method | Route | Auth | Body |
|---|---|---|---|
| POST | `/complaints/draft` | ✅ | `issueCategory: waterlogging|inefficient_service|crime_rate, area, details` → returns AI-generated subject + body |
| POST | `/complaints/:id/send` | ✅ | `recipientEmail?` (falls back to a default authority address per category) |
| GET | `/complaints` | ✅ | Lists your drafted/sent complaints |

### Documents (how to create/update, + official link)
| Method | Route | Auth | Body |
|---|---|---|---|
| POST | `/documents/guide` | ✅ | `documentName, action: create|update` → steps, required docs, fee, official portal link |

### Schemes (matched by age/gender/income)
| Method | Route | Auth | Body |
|---|---|---|---|
| GET | `/schemes` | — | Full reference list of seeded schemes |
| POST | `/schemes/match` | ✅ | Optional overrides: `age, gender, annualIncome, category, state, occupation` (defaults to your saved profile) → AI-ranked matches with eligibility reasoning + how-to-apply + official link |

## Security notes

- All AI-facing and auth routes are rate-limited separately from the general API (`strictLimiter`, 20 req/15min) to control both abuse and Gemini API cost.
- `express-mongo-sanitize` strips `$`/`.` operators from all incoming input to block NoSQL injection.
- `helmet` sets standard security headers; CORS is locked to `CLIENT_URL`.
- Uploaded images are validated by MIME type and capped at 8MB, streamed through a local temp dir (auto-deleted after Cloudinary upload) rather than held in memory.
- Scheme/document AI calls are **grounded** against a seeded reference list (`src/data/schemes.js`, `src/data/documents.js`) so the model can't invent scheme names or fake application links.
- The issue categorization AI call has a deterministic keyword-based fallback (`keywordFallbackCategorize`) so report submission never hard-fails if Gemini is unreachable.

## Wiring up the frontend

None of the existing frontend components call this API yet — `IssueWizardModal.jsx`'s AI step is currently a mock `setTimeout`. To connect it:
1. Add an `src/lib/api.js` axios instance with `baseURL` pointing here and `withCredentials: true`, plus a response interceptor that calls `/auth/refresh` on 401 and retries once.
2. Replace the `setTimeout` mock in `IssueWizardModal.jsx`'s `handleContinue` with a real `multipart/form-data` POST to `/issues` (attach `uploadedFile` as `photo`, plus geolocation from the browser's `navigator.geolocation`).
3. Add login/register screens (there currently are none in the frontend) gating access to `DashboardPage`/`PublicPortalPage`.
4. Wire `AssistantPage.jsx` to `/complaints/draft`, `/documents/guide`, and `/schemes/match` for its respective flows.

Happy to build any of these out next if useful.
