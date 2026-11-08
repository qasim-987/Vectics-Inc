# Sending bulk email to your customers

How to get a campaign from your customer list into inboxes — without landing in spam and without
breaking consent rules.

**Your starting point:** the site already sends email through **Resend** (`src/app/api/contact/route.ts`).
That means the hardest part — a verified sending domain and API key — is likely already done, and bulk
sending can reuse the same account.

---

## 1. Choose your path

| | **A. Resend Broadcasts** (dashboard) | **B. Sender script in this repo** | **C. Full ESP** (Mailchimp / Brevo / Kit) |
|---|---|---|---|
| Best for | One-off announcements, newsletters | Targeted B2B outreach from your own list, repeatable campaigns | Drip sequences, signup forms, A/B tests, automations |
| Setup time | ~15 min | ~20 min (already built) | 1–2 hours |
| Needs code | No | Runs locally, no deploy needed | No |
| Unsubscribe handling | Automatic | Signed 1-click links → `/api/unsubscribe` | Automatic |
| Personalisation | `{{{FIRST_NAME}}}` merge tags | Any CSV column: `{{company}}`, `{{industry}}` | Merge tags |
| Segmentation | Per-audience/topic | Tags in your CSV (`--segment vip`) | Tags/segments |
| Cost | Same Resend plan | Same Resend plan (free tier ≈100/day) | Free tier, then per-contact |
| Control | Medium | Full (you own the list + logs) | Medium |

**Recommendation for you:** start with **B** (it's built and tested, and keeps your list in your own
hands), and use **A** when you just need to fire a quick newsletter. Only move to **C** if you want
automated drip campaigns and hosted signup forms.

---

## 2. One-time setup (~20 minutes)

### 2.1 Authenticate your sending domain (skip if already done for the contact form)

In Resend → **Domains → Add Domain**, add your domain, then publish the DNS records it gives you:

| Record | Purpose | Without it |
|---|---|---|
| `TXT` SPF (`v=spf1 include:...`) | Proves you're allowed to send for the domain | Messages land in spam |
| `TXT` DKIM (`resend._domainkey`) | Cryptographic signature | Gmail/Yahoo reject bulk mail |
| `TXT` DMARC (`_dmarc`, start with `p=none`) | Tells mailbox providers you police spoofing | Bulk senders get throttled |

**Use a separate subdomain for marketing** — e.g. `mail.vectisoperations.tech` — and keep
`vectisoperations.tech` for transactional mail (contact-form replies, invoices). If one reputation
tanks, the other survives.

### 2.2 Environment variables

Add to `.env.local` (local) and to **Vercel → Project → Settings → Environment Variables** (production):

```bash
RESEND_API_KEY=re_...                    # same key the contact form uses
CONTACT_FROM_EMAIL=Vectis Inc. <hello@mail.vectisoperations.tech>
CONTACT_TO_EMAIL=hello@vectisoperations.tech   # also used as Reply-To
EMAIL_UNSUBSCRIBE_SECRET=<32+ random chars>    # openssl rand -base64 32
NEXT_PUBLIC_SITE_URL=https://vectisoperations.tech
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...            # server-only, never NEXT_PUBLIC_
```

`EMAIL_UNSUBSCRIBE_SECRET` signs the unsubscribe links. **Rotating it breaks every link already
delivered**, so set it once and keep it.

### 2.3 Suppression store (10 minutes, do not skip)

Unsubscribes must persist somewhere; without this, someone who opts out will be mailed again next
campaign. Run `supabase/email-schema.sql` in the Supabase SQL editor. It creates:

- `email_suppressions` — the do-not-mail list, written by `/api/unsubscribe`
- `email_contacts` — optional home for your growing list
- `email_campaigns` — optional audit trail

No security policy grants access to the public roles, so the table is only reachable with the
service-role key (which the API route and the script use).

Without Supabase configured, `/api/unsubscribe` **refuses to pretend** — it shows a "we couldn't
process this automatically, email us" page rather than silently dropping the request.

---

## 3. Build the list before you send

Garbage in, spam folder out. Three rules:

**1. Only mail people with a reason to hear from you.** Existing customers, people who submitted the
contact form, people who asked for updates. A purchased or scraped list will burn your domain in a
single send — and it is illegal in most of your likely markets.

**2. Keep consent evidence.** For each address store *when* and *where* they signed up
(`consent_at`, `consent_source` in `email_contacts`). If someone complains, this is your defence.

**3. Clean the list.** Remove role addresses (`info@`, `sales@`, `noreply@`), typos
(`gmial.com`, `gmai.com`), duplicates, and anyone who unsubscribed, bounced, or complained.

Your CSV format — one row per person, header row required, `tags` separated by `;`:

```csv
email,first_name,last_name,company,industry,tags,last_contact
aisha.khan@example.com,Aisha,Khan,Northwind Logistics,logistics,vip;manufacturing,2026-09-14
bilal.raza@example.com,Bilal,Raza,Meridian Clinics,healthcare,newsletter,2026-10-02
```

See `campaigns/contacts.example.csv`. Exporting from Supabase:

```sql
select email, first_name, last_name, company, tags::text, last_contact
from email_contacts
where not exists (select 1 from email_suppressions s where s.email = email_contacts.email);
```

> Real customer lists must never be committed to Git. `.gitignore` already blocks
> `campaigns/*.csv` (except the example) and `campaigns/logs/`.

---

## 4. Sending with this repo

### 4.1 Write the message

Copy `campaigns/templates/example.json` and edit it. Placeholders use any CSV column, with an
optional fallback after `|`:

```json
{
  "subject": "{{first_name|there}}, a quick idea for {{company|your team}}",
  "html": "<p>Hi {{first_name|there}},</p>...",
  "text": "Hi {{first_name|there}}, ..."
}
```

- Values are **HTML-escaped automatically** in `html`, so an apostrophe in a company name can't break
  the markup.
- `{{unsubscribe_url}}` is available if you want to place the link yourself; otherwise a compliant
  footer is appended automatically.
- Keep HTML small and table-free where you can. Send the `text` version too — it helps deliverability
  and accessibility.

### 4.2 Dry run (default — sends nothing)

```bash
npm run campaign -- --contacts campaigns/my-list.csv --template campaigns/templates/august.json
```

Shows how many recipients survived filtering, which ones were skipped and why, a sample subject after
merge, and writes a rendered preview to `campaigns/logs/<id>.preview.html`. **Open it before sending.**

### 4.3 Check your segments

```bash
npm run campaign -- --contacts campaigns/my-list.csv --template campaigns/templates/x.json --list-tags
```

### 4.4 Send a real test to yourself

```bash
npm run campaign -- --contacts campaigns/my-list.csv --template campaigns/templates/x.json \
  --send --test you@vectisoperations.tech
```

The subject is prefixed `[TEST]`. Check on phone and desktop, click the unsubscribe link, and confirm
the row lands in `email_suppressions`.

### 4.5 Send for real

```bash
# Targeted: only the VIPs
npm run campaign -- --contacts campaigns/my-list.csv --template campaigns/templates/x.json \
  --segment vip --send

# Everyone (first 100 only, while the domain is warming up)
npm run campaign -- --contacts campaigns/my-list.csv --template campaigns/templates/x.json \
  --send --limit 100
```

Each run writes `campaigns/logs/<campaign-id>.csv` (per-recipient status + Resend message id) and
`.json` (full config and counts). Exit code is non-zero if any recipient failed.

### How the sender behaves

| Behaviour | Detail |
|---|---|
| Dry run by default | Nothing is sent without `--send` |
| Batching | 100 messages per Resend batch call, 1s pause between batches (`--delay`) |
| Deduplication | Case-insensitive; first occurrence wins |
| Validation | Invalid addresses skipped, never sent |
| Suppression | Local `campaigns/suppressions.json` ∪ Supabase `email_suppressions` |
| Personalisation | Any CSV column, HTML-escaped, with fallbacks |
| Unsubscribe | Signed per-recipient link + RFC 8058 one-click headers |
| Logging | CSV + JSON per campaign in `campaigns/logs/` (git-ignored) |
| Mock mode | `--mock` exercises the whole pipeline offline |

---

## 5. Or send from the Resend dashboard (no code)

1. **Audiences → Create audience** (e.g. "Customers 2026").
2. **Add contacts** — paste or import your CSV. A `tags` column becomes contact properties; create one
   audience per segment if you want to target by list.
3. **Broadcasts → New broadcast** — pick the audience, choose the domain from step 2.1, write the
   email. Resend inserts the unsubscribe link and handles opt-outs for you.
4. **Send a test**, then **schedule** or send.

Do this when you want a quick newsletter; the opt-outs live in Resend, separate from the Supabase
suppression list, so pick one system and stay in it.

---

## 6. Deliverability: the part that decides whether this works

**Warm up slowly.** A new sending domain has no reputation; a 2,000-recipient first send looks exactly
like a spammer. Rough schedule:

| Day | Volume | To whom |
|---|---|---|
| 1–2 | 50–100 | Your most engaged contacts (recent customers, people who replied to you) |
| 3–4 | 150–250 | Still engaged contacts |
| 5–7 | 400–600 | Add the colder half of the list |
| 8+ | 1,000–2,000/day | Whole list, if spam complaints stay near zero |

Stop and slow down if you see bounces above ~3% or complaints above ~0.1%.

**Content rules that matter:**

- One clear ask per email. Long emails with five links look promotional.
- Write like a person. `Hi Aisha,` beats `Dear Valued Customer`.
- No URL shorteners, no image-only emails, no attachments, no ALL CAPS subjects.
- Include your real business name and a physical address in the footer — required by US law and it
  reduces complaint rates everywhere.
- Ask a question: replies are the strongest possible signal that you're not spam.
- Avoid `Re:`/`Fwd:` tricks in subjects. They get you reported.

**Do not** send HTML that renders blank in a text-only client, and do not send the same person the
same offer twice in a week.

---

## 7. Consent and the law — read this before the first send

Not legal advice; if you're sending at volume into the EU or UK, get a local opinion.

| Market | What applies | Practical rule |
|---|---|---|
| **US** (CAN-SPAM) | No prior consent needed for B2B, but mandatory: accurate headers, honest subject, ad identification, **physical postal address**, working opt-out honoured within 10 business days | Honour every opt-out same-day; keep the address in your footer |
| **UK** (PECR + UK GDPR) | Emails to **limited companies** are outside PECR, but GDPR still applies. Sole traders/partnerships need consent or the "soft opt-in" (existing customer, similar product, opt-out offered) | Log where each address came from; offer opt-out in every message |
| **EU** (ePrivacy + GDPR) | Rules vary by member state — Germany requires prior consent even for B2B. Legitimate interest can work, but must be documented | Safest default: consent, or an existing customer relationship |
| **Pakistan** | No dedicated anti-spam statute; PECA 2016 and consumer-protection principles still apply | Same behaviour as above: identify yourself, offer opt-out, honour it |

Non-negotiable in every case:

1. **Every email has a working unsubscribe link** — the sender adds one automatically.
2. **One click must work** — `/api/unsubscribe` also answers the RFC 8058 one-click POST that Gmail and
   Yahoo send, without a confirmation page.
3. **Opt-outs are permanent** — the suppression list is checked on every campaign, and the script
   refuses to mail suppressed addresses even if they're still in your CSV.
4. **Never re-import an unsubscribed address.** The Supabase table is the source of truth; keep it.

Gmail/Yahoo bulk-sender rules (5,000+/day): SPF **and** DKIM **and** a DMARC record, one-click
unsubscribe, and spam complaints under 0.3%. All three are covered by the setup above.

---

## 8. Track and follow up

- **Watch the log, not just the dashboard.** `campaigns/logs/<id>.csv` shows exactly who failed and the
  provider error.
- **Remove hard bounces immediately** and add them to the suppression list with `reason = 'bounce'`:
  ```sql
  insert into email_suppressions (email, reason, source)
  values ('bounced@example.com', 'hard-bounce', 'manual')
  on conflict (email) do nothing;
  ```
- **Follow up once**, not five times. One reminder after 4–7 days to non-responders is normal; more
  than that is harassment and it trains spam filters against you.
- **Replies are the metric that matters** for B2B outreach. The template in this repo ends with a
  question for exactly that reason.

---

## 9. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `401` from Resend | Bad/absent `RESEND_API_KEY` | Re-copy the key; check for stray spaces |
| `403` / "domain is not verified" | Sending from an unverified domain | Finish DNS verification, or send from `onboarding@resend.dev` for tests |
| `fetch failed` for every recipient | No network / DNS blocked | Check connectivity; use `--mock` to validate the campaign offline |
| Unsubscribe link shows "not valid" | `EMAIL_UNSUBSCRIBE_SECRET` differs between the machine that sent and the deployment | Same secret everywhere, including Vercel |
| Everyone lands in spam | No DMARC, brand-new domain, or too much volume too fast | Add DMARC, use a subdomain, follow §6 warm-up |
| "Could not complete automatically" on unsubscribe | Supabase env vars missing | Set `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`, run the schema |
| Script sends to someone who opted out | Suppression not visible | The unsubscribe was recorded in Resend's audience, not Supabase (or vice versa) — pick one system |
| Dry run shows 0 recipients | `email` column missing/named differently, or every row filtered | Check the "Skipped" line in the output |

---

## 10. Files in this change

| File | What it does |
|---|---|
| `scripts/email-campaign.mjs` | The sender: CSV → validated, deduped, personalised, suppressed, batched Resend sends + logs |
| `scripts/check-unsubscribe-token.mjs` | Asserts sender and API sign/verify identically (`npm test`) |
| `src/lib/unsubscribe-token.ts` | Shared HMAC signing/verification |
| `src/app/api/unsubscribe/route.ts` | Unsubscribe page (GET) + one-click endpoint (POST) |
| `supabase/email-schema.sql` | Suppression, contacts, and campaign tables |
| `campaigns/templates/example.json` | Editable message template |
| `campaigns/contacts.example.csv` | CSV format reference |

Commands:

```bash
npm test                          # verify unsubscribe signing (run after any change)
npm run campaign:dry              # dry run against the example list
npm run campaign:tags             # list segments
npm run campaign -- --contacts <csv> --template <json> [--segment a,b] [--limit n] --send
```
