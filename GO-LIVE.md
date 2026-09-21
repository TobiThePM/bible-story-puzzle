# Go live — the short version

You bought a domain today. Here is the whole path from this folder to that
domain, in six steps. Budget about an hour, most of which is waiting.

Everything here is free except the domain you already paid for.

---

## Before you start

Have these three things open:

1. A **GitHub** account — <https://github.com/signup> (free)
2. A **Vercel** account — <https://vercel.com/signup>, and **sign up with GitHub** (free)
3. Your **domain registrar login** — wherever you bought the domain today

The code is ready. Eight commits, nothing uncommitted, branch `main`.

---

## Step 1 — Put the code on GitHub

**1a.** Go to <https://github.com/new>

- Repository name: `bible-story-puzzle`
- Public or Private — both work
- **Do NOT** tick "Add a README", "Add .gitignore", or "Choose a license".
  The project already has them and ticking these will cause a conflict.

Click **Create repository**.

**1b.** GitHub now shows a page with a URL like
`https://github.com/YOURNAME/bible-story-puzzle.git`. Copy it.

**1c.** Back on your machine, run these two commands — replace `YOURNAME`:

```bash
cd "C:/Users/P C/Downloads/bible-puzzle-quest"
git remote add origin https://github.com/YOURNAME/bible-story-puzzle.git
git push -u origin main
```

**A browser window will pop up asking you to sign in to GitHub.** That is normal
— it is Windows' Git Credential Manager. Sign in, and the push completes.

Refresh the GitHub page. Your code is there.

---

## Step 2 — Deploy on Vercel

1. Go to <https://vercel.com/new>
2. Find `bible-story-puzzle` in the list and click **Import**
3. **Change nothing.** Vercel detects Next.js by itself.
4. Click **Deploy**

Wait about two minutes. You get a live URL:

```
https://bible-story-puzzle.vercel.app
```

It is real and public. Open it.

---

## Step 3 — Test it properly, before the domain

Do this now, while it costs nothing to fix.

- Open the Vercel URL **on your phone**
- Play a Quick (5 puzzle) game start to finish
- Try each difficulty level
- Turn wifi off after the page loads — it should keep working
- Open the Story Library

If something is wrong, fix it locally, then:

```bash
git add -A
git commit -m "Fix whatever it was"
git push
```

Vercel redeploys automatically in about a minute. **From now on, every push to
`main` goes live by itself.** You never upload anything by hand again.

---

## Step 4 — Connect your domain

**4a.** In Vercel: your project → **Settings** → **Domains** → type your domain
→ **Add**.

**4b.** Vercel now shows you the exact DNS records to create. It is normally two:

| Type | Name | Value |
|---|---|---|
| A | `@` | an IP address Vercel gives you |
| CNAME | `www` | a `.vercel-dns.com` address Vercel gives you |

**Use exactly the values Vercel shows you on screen.** Do not copy them from
anywhere else, including this file — they differ by account and they change.

**4c.** Log in to your registrar (where you bought the domain), find **DNS** or
**DNS Records** or **Manage DNS**, and add those records.

If there are existing A or CNAME records for `@` or `www` — often a parking
page the registrar added — delete those first, or they will fight yours.

---

## Step 5 — Wait

DNS takes anywhere from **ten minutes to a few hours**. A domain bought today
can occasionally take up to 48 hours to settle worldwide.

Vercel's Domains page shows the status by itself. When it turns to a green tick
/ "Valid Configuration", you are live.

**HTTPS is automatic and free.** There is no certificate to buy or configure.

---

## Step 6 — Finish up

Put your live URL at the top of `README.md`, then:

```bash
git add -A
git commit -m "Add live URL"
git push
```

Done. The game is a real product at your own address.

---

## Making changes from now on

```bash
cd "C:/Users/P C/Downloads/bible-puzzle-quest"
npm run dev          # play with it locally at http://localhost:3000
# ...make changes...
git add -A
git commit -m "What you changed"
git push             # live in about a minute
```

**One rule:** never run `npm run build` while `npm run dev` is running. They
share the `.next` folder and the dev server will start returning 500 errors.
Stop one before starting the other.

---

## Before children actually use it

Two things from the README checklist, neither of which blocks going live, but
both of which matter before a class sees it:

1. **Proofread the twenty verses against a printed Bible.** They are King James
   (public domain) but were written from memory.
2. **Run `node scripts/process-art.mjs`** and improve any illustration that
   fails the confusable-tile check, so no puzzle has two tiles a child cannot
   tell apart.

---

## If something goes wrong

| Problem | Fix |
|---|---|
| `git push` rejected | You ticked "Add a README" when creating the repo. Run `git pull --rebase origin main` then push again. |
| Vercel build fails | Run `npm run build` locally and read the error. It will be the same one. |
| Domain shows "Invalid Configuration" | The DNS records are wrong or an old record is still there. Recheck against what Vercel shows. |
| Domain still not working after 24h | Confirm you edited DNS at the registrar that actually holds the domain. |
| Site loads but images do not | Hard-refresh with Ctrl+F5. |
