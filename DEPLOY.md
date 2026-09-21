# Deploy it — the exact steps

The game is built, tested and committed. This is the shortest path from the
folder on your machine to a real website with your own domain.

Everything here is free except the domain (~$12–15/year).

---

## Step 1 — Look at it locally first

```bash
cd "C:/Users/P C/Downloads/bible-puzzle-quest"
npm run dev
```

Open <http://localhost:3000>. Play a few rounds. Try each difficulty level.

When you're happy, stop it with `Ctrl+C`.

---

## Step 2 — Put it on GitHub

The repository is already initialised with your first commit. It just needs a
home online.

**a.** Go to <https://github.com/new>. Name it `bible-story-puzzle`. Leave it
**Public** or Private (either deploys fine). **Do not** tick "Add a README" —
the repo already has one.

**b.** GitHub shows you a URL like `https://github.com/YOURNAME/bible-story-puzzle.git`.
Use it here:

```bash
git branch -M main
git remote add origin https://github.com/YOURNAME/bible-story-puzzle.git
git push -u origin main
```

From this moment the repository is the project. Not this folder, not your
laptop. If it isn't pushed, it doesn't exist.

---

## Step 3 — Deploy to Vercel (two minutes, free)

1. Go to <https://vercel.com> and sign in **with your GitHub account**.
2. **Add New… → Project**.
3. Find `bible-story-puzzle` in the list and click **Import**.
4. Change nothing. Vercel detects Next.js on its own.
5. Click **Deploy**.

You get a live URL: `bible-story-puzzle.vercel.app`.

Open it on your phone. Send it to someone. It's real and it's public.

**From now on, every `git push` to `main` redeploys automatically.** You never
upload anything by hand again.

```bash
git add -A
git commit -m "Shorter timer on round 7"
git push
```

### Netlify instead, if you prefer

Sign in with GitHub → **Add new site → Import an existing project** → pick the
repo → build command `npm run build`, publish directory `out` → Deploy.

### Or no host at all

```bash
npm run build
```

The `out/` folder (1.4 MB) is the entire website. Copy it to a USB stick, open
`index.html`, and the game runs with no internet whatsoever. Useful for a church
hall with no wifi.

---

## Step 4 — Test it properly

Now that it's on a real URL:

- [ ] Open it on **your own phone**, not just a desktop browser
- [ ] Play a full 20-round game start to finish without reloading
- [ ] Try all four difficulty levels
- [ ] Try it on a tablet, and on a projector if it's for a classroom
- [ ] Turn wifi off after the page loads — it should keep working
- [ ] In browser devtools, throttle the network to Slow 3G and reload
- [ ] **Watch four or five real children play it without helping them**

That last one will teach you more in twenty minutes than everything else
combined. You'll find out whether the timers are right, whether the tiles are
big enough, and whether anyone notices the Peek button.

Then tune `src/content/modes.ts` — every timing and grid number lives in that one
file for exactly this reason — commit, push, and it's live.

### Testing a risky change without touching the live site

```bash
git checkout -b faster-timers
# make changes
git push -u origin faster-timers
```

Vercel builds that branch at its own separate URL. Test there, then merge into
`main` when you're happy.

---

## Step 5 — Buy the domain

Only now — once it works and children have played it.

**Registrar:** Cloudflare Registrar (sells at cost), Namecheap, or Porkbun.
Roughly $12–15/year. Buy the domain from a registrar, *not* through your host —
keeping them separate means you can move hosts whenever you like.

Names worth checking:
`biblestorypuzzle.com` · `biblepuzzle.app` · `storypuzzle.bible` ·
`twentywonders.com`

**Point it at Vercel:**

1. Vercel → your project → **Settings → Domains → Add**
2. Type your domain
3. Vercel shows you exactly which DNS records to create
4. Add those records at your registrar
5. Wait — usually ten minutes, occasionally a few hours

HTTPS is issued automatically and free. Nothing else to configure.

Finally, put the live URL at the top of `README.md` and push.

---

## What it costs to run

| | |
|---|---|
| Hosting | **$0** — free tier covers this comfortably |
| AI / API calls at runtime | **$0** — there are none |
| Database | **$0** — there isn't one |
| Domain | **~$12–15/year** |
| Artwork | one-off image generation |

---

## The five rules that stop it scattering again

1. **The GitHub repo is the project.** Not a folder in Downloads.
2. **Commit every time something works.** Small commits, plain messages.
3. **One branch deploys.** `main` → production, automatically.
4. **Assets live in the repo.** The images are committed files, not links.
5. **Content in one file.** `src/content/stories.ts`.
