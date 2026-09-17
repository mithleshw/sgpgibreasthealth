# Pink Wave 2026 — Be Breast Aware

A bilingual (Hindi / English) breast-cancer awareness web app for the
**SGPGI Breast Health Program, Lucknow**, built for the Pink Wave 2026
Breast Cancer Awareness Walkathon — Sunday 4 October 2026, 1090 Chauraha, Lucknow.

**Live:** https://mithleshw.github.io/sgpgibreasthealth/

Opens from a WhatsApp link or the poster QR. No install, no login, no account.
Works offline once loaded. Around 700 KB in total.

---

## What it contains

| Module | |
|---|---|
| **Myth or Fact** | 14 shuffled cards — swipe or tap. Every explanation comes from the department's *Myths & Facts* page, with its statistics. |
| **Spot the Sign** | 9 rounds — tap the abnormality. Includes a normal control round so it does not train false alarms. |
| **Self-Examination** | The 7 steps from the printed brochure, with the brochure's own photographs, plus the technique figures and the three palpation patterns. |
| **Pink Pledge** | A shareable certificate carrying the person's name and score. |
| **Brochure** | Both PDFs, behind a short form (name, city, role). |
| **Videos** | The department's full awareness series and its long-form talks. |

Every clinical line is traced to SGPGI's own published material. Sources are
noted in comments in `content.js`.

---

## Files

```
index.html              app shell, styles, all screens
content.js              ← ALL TEXT, both languages. The faculty sign-off file.
app.js                  journey, quiz, tap detection, trainer, certificate
sw.js                   offline service worker
manifest.webmanifest    installable as a home-screen app
icon-192.png/512.png    app icon
img/                    11 photographs from the brochure (WebP + JPEG)
brochure_eng.pdf        served by the download form
brochure_hin.pdf        served by the download form
```

---

## Deploying

The site is plain static files — no build step.

**Publishing on GitHub Pages**

1. Repository → **Settings** → **Pages**
2. *Source*: **Deploy from a branch**
3. *Branch*: **main**, folder **/ (root)** → **Save**
4. Wait 1–2 minutes, then open the URL above

### ⚠️ After changing `app.js` or `content.js`, bump the version in TWO places

Otherwise phones that already opened the site keep serving the old copy and it
will look as though your edit did nothing.

1. `index.html` — the two script tags at the bottom: `?v=4` → `?v=5`
2. `sw.js` — the cache name `pinkwave-v4` → `pinkwave-v5`, **and** the two
   matching `?v=4` entries in the `ASSETS` list

They must all be the same number.

---

## Configuration

Three values at the top of `app.js`:

```js
const SITE_URL     = "https://mithleshw.github.io/sgpgibreasthealth/";
const REGISTER_URL = "https://forms.gle/REPLACE_ME";   // ← walkathon registration form
const ANALYTICS    = "";                                // ← empty = nothing is collected
```

---

## Analytics

Two separate things, deliberately kept apart.

**Traffic** — page views, country, region, device, referrer. Add your Umami
snippet in the commented block near the bottom of `index.html`. Country is
resolved when the request arrives and **the IP address is never stored**.

**Research data** — set `ANALYTICS` to a Supabase (or similar) endpoint and the
app posts one row per meaningful action:

| event | carries |
|---|---|
| `view` | which screen |
| `answer` | which myth, correct or not, which way they answered |
| `tap_sign` | which sign, hit or miss |
| `step_done` | which self-exam step |
| `pattern_pick` | which palpation pattern |
| `complete` | final score |
| `pledge` | the name typed on the certificate |
| `brochure_download` | name, city, role, language |
| `share`, `video_play` | — |

Each row also carries an anonymous `session_id`, timestamp and language.

**Not collected anywhere:** IP address, precise location, phone number, email.

> If this data is intended for publication, it becomes human-subjects research
> and needs SGPGI IEC approval **before** collection begins.

---

## Known gaps

- **Step 7 has no photograph** — it is text-only in the brochure, so it uses a diagram.
- **Spot the Sign is illustrated, not photographic** — the brochure contains no
  images of dimpling, peau d'orange, nipple retraction or discharge.
- **Error in the printed Hindi brochure:** step 4 says *"ज्यादातर निपिल का स्राव
  हानिकारक होता है"* ("most nipple discharge is harmful"). The English brochure and
  the website both say the opposite. **The app uses the corrected Hindi.**
  The printed Hindi brochure should be fixed at its next reprint.

---

## Disclaimer

For awareness and education only. Not a diagnosis, and no substitute for
examination by a doctor.

**Breast Clinic**, Dept. of Endocrine & Breast Surgery, SGPGIMS
C-Block, Ground Floor, Old Building · Raebareli Road, Lucknow 226014
+91-522-2494409 · Monday to Friday, 9 AM – 5 PM

---

Made by **drmithleshw** using Claude AI
© drmithleshw · SGPGI Breast Health Program, Lucknow
