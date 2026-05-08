# Database Schema

SQLite database. File path controlled by `DATABASE_URL` env var (default: `./dietitian.db`).
Tables are auto-created on first API call. Swap SQLite for Postgres/MySQL in production by replacing `better-sqlite3` with your driver and updating `lib/db.ts`.

---

## `clients`
Core client registry.

| Column | Type | Notes |
|---|---|---|
| id | INTEGER PK | Auto-increment |
| name | TEXT | Full name |
| email | TEXT UNIQUE | Login/contact |
| phone | TEXT | WhatsApp number |
| age | INTEGER | |
| gender | TEXT | `male`, `female`, `other` |
| health_goal | TEXT | `weight_management`, `sugar_control`, `pcos`, `other` |
| status | TEXT | `active` / `inactive` |
| inactive_reason | TEXT | Nullable — why deactivated |
| notes | TEXT | Dietitian's private notes |
| created_at | TEXT | ISO datetime |
| updated_at | TEXT | ISO datetime |

---

## `packages`
Product packages that can be sold to clients.

| Column | Type | Notes |
|---|---|---|
| id | INTEGER PK | |
| name | TEXT | e.g. "Weight Management" |
| description | TEXT | Marketing copy |
| category | TEXT | Same enum as `health_goal` |
| price | INTEGER | Amount in INR (paise-free) |
| duration_months | INTEGER | Length of program |
| created_at | TEXT | |

---

## `client_packages`
Join table linking clients to packages (subscription record).

| Column | Type | Notes |
|---|---|---|
| id | INTEGER PK | |
| client_id | INTEGER FK → clients | |
| package_id | INTEGER FK → packages | |
| start_date | TEXT | YYYY-MM-DD |
| end_date | TEXT | Nullable = ongoing |
| is_active | INTEGER | 1 = active, 0 = ended |
| created_at | TEXT | |

---

## `health_metrics`
Weight readings per client over time (used for graph).

| Column | Type | Notes |
|---|---|---|
| id | INTEGER PK | |
| client_id | INTEGER FK | |
| weight_kg | REAL | e.g. 73.5 |
| recorded_at | TEXT | ISO datetime |
| source | TEXT | `manual` or `email` |
| notes | TEXT | Optional note |

---

## `diet_plans`
A diet plan belongs to one client and has multiple versions (each edit creates a new version).

| Column | Type | Notes |
|---|---|---|
| id | INTEGER PK | |
| client_id | INTEGER FK | |
| title | TEXT | e.g. "Week 3 Weight Loss Plan" |
| created_at | TEXT | |

---

## `diet_plan_versions`
Each edit to a diet plan creates a new version row. The OCR/structured data is stored as JSON in `ocr_data`.

| Column | Type | Notes |
|---|---|---|
| id | INTEGER PK | |
| diet_plan_id | INTEGER FK | |
| version_number | INTEGER | 1, 2, 3... |
| image_path | TEXT | Path to uploaded image (nullable) |
| ocr_data | TEXT | JSON: `{breakfast, lunch, snacks, dinner, totalCalories, notes}` |
| changelog | TEXT | What changed in this version |
| created_at | TEXT | |

### `ocr_data` JSON shape
```json
{
  "breakfast": { "items": ["Oats", "Eggs"], "calories": 350, "protein": "18g", "carbs": "42g", "fat": "8g" },
  "lunch":     { "items": [...], "calories": 480, ... },
  "snacks":    { ... },
  "dinner":    { ... },
  "totalCalories": 1460,
  "notes": "Avoid sugar. Drink 3L water daily."
}
```

---

## `payments`
Payment records per client. Screenshots uploaded as files.

| Column | Type | Notes |
|---|---|---|
| id | INTEGER PK | |
| client_id | INTEGER FK | |
| package_id | INTEGER FK | Nullable |
| amount | INTEGER | INR |
| status | TEXT | `paid`, `unpaid`, `pending` |
| screenshot_path | TEXT | Path to payment screenshot |
| notes | TEXT | |
| paid_at | TEXT | When paid (nullable) |
| due_date | TEXT | YYYY-MM-DD |
| created_at | TEXT | |

---

## `notifications`
Scheduled notification rules per client (not individual sends).

| Column | Type | Notes |
|---|---|---|
| id | INTEGER PK | |
| client_id | INTEGER FK | |
| type | TEXT | `health_metric_request`, `payment_reminder`, `whatsapp` |
| frequency | TEXT | `weekly`, `biweekly`, `monthly`, `custom` |
| custom_days | INTEGER | Used when frequency = `custom` |
| message | TEXT | Template message body |
| next_send_at | TEXT | When to send next |
| last_sent_at | TEXT | When last sent |
| is_active | INTEGER | 1 = enabled |
| created_at | TEXT | |

---

## `images`
Generic image attachments per client.

| Column | Type | Notes |
|---|---|---|
| id | INTEGER PK | |
| client_id | INTEGER FK | |
| path | TEXT | Relative file path under `/public/uploads/` |
| type | TEXT | `diet_plan`, `payment`, `progress` |
| created_at | TEXT | |

---

## `activity_log`
Audit trail shown on the Dashboard feed.

| Column | Type | Notes |
|---|---|---|
| id | INTEGER PK | |
| type | TEXT | `client_added`, `payment_received`, `diet_plan_updated`, `metric_recorded`, `client_deactivated` |
| description | TEXT | Human-readable event description |
| client_name | TEXT | Denormalized for quick display |
| created_at | TEXT | |

---

## `meal_items`
Library of food/ingredient entries used as recommendations in the diet plan builder.

| Column | Type | Notes |
|---|---|---|
| id | INTEGER PK | |
| name | TEXT | e.g. "Oats Porridge" |
| category | TEXT | `breakfast`, `lunch`, `snacks`, `dinner`, `any` |
| calories_per_serving | INTEGER | kcal |
| protein | TEXT | e.g. "18g" |
| carbs | TEXT | e.g. "42g" |
| fat | TEXT | e.g. "8g" |
| serving_size | TEXT | e.g. "1 bowl (200g)" |
| health_tags | TEXT | JSON array: `["pcos","weight_management","high_protein"]` |
| notes | TEXT | Clinical note |
| created_at | TEXT | |

### Health tag values
`weight_management`, `sugar_control`, `pcos`, `high_protein`, `low_carb`

---

## `whatsapp_messages`
Log of WhatsApp conversations with clients (manually recorded or via API integration).

| Column | Type | Notes |
|---|---|---|
| id | INTEGER PK | |
| client_id | INTEGER FK | |
| direction | TEXT | `inbound` (from client) / `outbound` (from you) |
| message | TEXT | Message content |
| phone_number | TEXT | Client's WhatsApp number |
| is_read | INTEGER | 0 = unread, 1 = read |
| received_at | TEXT | Timestamp of message |
| created_at | TEXT | When logged in CMS |
