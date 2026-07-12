# Argus — AI business monitoring platform (demo build)

A working front-end for the Argus product idea: a marketing site (`index.html`) plus a real dashboard app (`dashboard.html`) with tabs, filters, integrations, and live sample alerts.

```
argus-app/
├── index.html          marketing / landing page
├── dashboard.html       the app: Overview · Alerts · Integrations · Settings
├── css/styles.css       shared styles for both
├── js/site.js           landing page interactions
├── js/dashboard.js       dashboard logic (tabs, filters, mock data, charts)
├── js/oauth-config.js   OAuth app credentials — you fill these in
└── assets/logo.svg      the Argus mark
```

## What's real vs. what's sample data — please read this part

- **The Meta and Google "Connect" buttons build real OAuth login URLs.** Click them today and you'll see a message saying they need your own app credentials — fill those in and the button opens the actual Meta/Google login screen. Getting a live token *back* into the app after login needs a small backend step (below).
- **The other integrations (Shopify, HubSpot, Salesforce, Stripe, etc.) connect via a pasted API key/token**, the same pattern tools like Zapier use for non-OAuth services. In this demo, the key is just kept in memory for the session — nothing is sent anywhere.
- **Every chart, KPI, and alert in the dashboard is sample data**, clearly labeled. Wiring up real numbers means building the actual monitoring backend — see "What's next" at the bottom.

That's not a limitation I added quietly — it's the honest state of a project that started as a landing page an hour ago. The goal here is to get you a real, deployable, good-looking product shell to show people, iterate on, and eventually wire up to live data.

---

## Part 1 — Publish it on GitHub Pages (5 minutes)

1. Create a **new, separate repo** on GitHub — e.g. `argus-app` (Settings → your repos → New).
2. From your terminal, inside this `argus-app` folder:
   ```bash
   cd argus-app
   git init
   git add .
   git commit -m "Argus v0.1 — dashboard demo"
   git branch -M main
   git remote add origin https://github.com/<your-username>/argus-app.git
   git push -u origin main
   ```
3. On GitHub: open the repo → **Settings → Pages** → under "Build and deployment", Source = **Deploy from a branch**, Branch = `main`, folder = `/ (root)` → **Save**.
4. Wait ~1 minute, then visit `https://<your-username>.github.io/argus-app/`.

Every time you `git push` after that, the live site updates automatically within a minute or two.

---

## Part 2 — Making the Connect buttons real

### Meta Ads Manager

1. Go to [developers.facebook.com](https://developers.facebook.com) → **My Apps → Create App** → choose "Business" type.
2. In the app dashboard, add the **Marketing API** product.
3. Under **App Settings → Basic**, copy your **App ID**.
4. Under **Facebook Login → Settings**, add a **Valid OAuth Redirect URI**: `https://<your-username>.github.io/argus-app/oauth-callback.html` (you'll need to create this page — see below).
5. Paste the App ID into `js/oauth-config.js` → `ARGUS_OAUTH_CONFIG.meta.appId`.
6. Note: `ads_management` and `ads_read` are **advanced permissions** — Meta requires **App Review** with a screencast and use-case explanation before real ad accounts can grant them in production. Development mode works immediately for your own test accounts/admins.

### Google Ads

1. Go to [console.cloud.google.com](https://console.cloud.google.com) → create a project → **APIs & Services → Credentials → Create OAuth client ID** (type: Web application).
2. Add an **Authorized redirect URI**: same pattern as above.
3. Copy the **Client ID** into `js/oauth-config.js` → `ARGUS_OAUTH_CONFIG.google.clientId`.
4. Separately, apply for a **Google Ads API developer token** at [ads.google.com](https://ads.google.com) → API Center. New tokens start in **test mode** (your own accounts only) and need Google's approval to go to **basic/standard access** for other users' accounts.

### The part GitHub Pages can't do: exchanging the code for a token

After someone logs in, Meta/Google redirect back to your `redirect_uri` with a short-lived `code` in the URL. Turning that `code` into a usable access token requires your **App Secret / Client Secret** — and a secret can never live in a static site's JavaScript, because anyone can view it.

Cheapest ways to add that one small backend step without running a server 24/7:
- **Cloudflare Workers** or **Vercel/Netlify Functions** — a single serverless function that takes the `code`, calls Meta/Google's token endpoint server-side (where the secret lives as an environment variable), and stores the resulting token.
- You'd also want a small database (even a free tier of Supabase or Firebase) to store tokens per user/account.

This is a genuinely different, larger build than the dashboard shell — happy to help you scope and build that backend when you're ready.

---

## Part 3 — Wiring the "paste a token" integrations

For Shopify, HubSpot, Salesforce, Zoho, Stripe, and Zendesk, the realistic no-backend path many small tools use is a **private/custom app token**, generated inside each platform's own settings (e.g. Shopify → Apps → Develop apps; HubSpot → Settings → Integrations → Private Apps). The demo's modal already accepts a pasted token — the next step is sending that token to your backend (once you have one) instead of just holding it in memory.

---

## Part 4 — What's next, realistically

The landing page and dashboard are the easy 5%. The doc that started this project was right that the hard, valuable part is:

1. **Validate first.** Use this live site to get 10 agencies / 20 advertisers to say "yes, I'd pay for this" before building the monitoring backend.
2. **Smallest real product:** Meta + Google Ads only, polling for spend/CPC/CPA/budget anomalies, alerting via WhatsApp. Skip CRM/ecommerce until Starter tier has paying users.
3. **The genuinely hard part:** the false-alert problem (smart baselines, not fixed thresholds) and the root-cause explanations — that's where an LLM call over recent account history earns its keep.

Come back when you're ready to scope that backend — polling schedule, anomaly detection logic, and the token-exchange service are a different project from this one, and worth planning properly rather than bolting on quickly.
