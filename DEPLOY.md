# Deploy landing page to juliemeng.com (Squarespace domain)

Squarespace does not host this Vite app directly. Host the built site on **Vercel** (free, works well with GitHub), then point your Squarespace-managed domain at Vercel.

## 1. Deploy on Vercel

1. Push this repo to GitHub (`jumengo/track-record`).
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import `track-record`.
3. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`.
4. Deploy. Production builds use `.env.production` (`VITE_LANDING_MODE=true`), so visitors get the landing page.
5. Optional env vars in Vercel → **Settings → Environment Variables**:
   - `VITE_LINKEDIN_URL`
   - `VITE_CONTACT_EMAIL`

After deploy you get a URL like `https://track-record-xxx.vercel.app`. Open it and confirm the landing page, audio, and tonearm work.

## 2. Add your domain in Vercel

1. Project → **Settings → Domains**.
2. Add `juliemeng.com` and `www.juliemeng.com`.
3. Vercel shows the DNS records you need (often similar to below).

## 3. Update DNS in Squarespace

1. [Squarespace](https://account.squarespace.com) → **Domains** → **juliemeng.com** → **DNS Settings** (or **DNS / Nameservers**).
2. If the domain still points at a Squarespace site you are replacing, disconnect or unpublish that site so the root domain can go to Vercel.
3. Add or update records (use the exact values Vercel shows; these are typical):

| Host | Type  | Value                 |
|------|-------|-----------------------|
| `@`  | A     | `76.76.21.21`         |
| `www`| CNAME | `cname.vercel-dns.com`|

4. Remove conflicting old `@` / `www` records that point to Squarespace hosting if Vercel tells you to.
5. DNS can take from a few minutes up to 48 hours. Vercel will issue HTTPS automatically.

## 4. Set the primary domain

In Vercel **Domains**, set `juliemeng.com` as primary and enable redirect from `www` → apex (or the reverse), whichever you prefer.

## 5. Verify

- `https://juliemeng.com` shows the turntable landing page.
- Play button, tonearm mute, and contact links work.
- Mobile layout looks acceptable.

## Local vs production

| Environment | Landing page |
|-------------|----------------|
| Production (`npm run build`) | Yes (`.env.production`) |
| Local dev with `.env` | Yes if `VITE_LANDING_MODE=true` |
| Full portfolio locally | `VITE_LANDING_MODE=false npm run dev` |

## Alternatives

- **Netlify**: connect the same repo; publish directory `dist`; add `_redirects` with `/* /index.html 200`; same Squarespace DNS idea with Netlify’s A/CNAME targets.
- **Keep Squarespace for email only**: you can leave MX records unchanged when updating A/CNAME for the website.
