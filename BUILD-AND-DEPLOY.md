# From idea to a real website you own

Companion to `SPEC.md`. This answers: how does this stop being something inside a chat window and become a website at its own address that works whether or not any AI is involved?

---

## 1. The key fact: this game has no AI in it

Worth stating plainly, because it changes everything about hosting.

AI writes the code. AI generates the twenty images. After that, **the AI is gone.** The finished game is ordinary HTML, CSS and JavaScript. It makes no calls to Claude, no calls to OpenAI, no calls to any API at all. There is no server doing anything clever. There is no database in v1.

Practical consequences:
- **No running AI costs.** Ever. Not per player, not per month.
- **No API keys** to leak, rotate, or get billed for.
- **Nothing to break** when a model is deprecated or a price changes.
- The game will still work in ten years, sitting on a hard drive.

That last point matters for the intended audience. A Sunday school teacher in a building with bad wifi is not going to wait for a model round-trip.

---

## 2. It is a *static site*, and that is the superpower

Because there is no backend in v1, the whole game compiles down to a folder of plain files — HTML, JavaScript, CSS, and the twenty images.

Next.js supports this directly:

```js
// next.config.js
module.exports = { output: 'export', images: { unoptimized: true } };
```

`npm run build` then produces an `out/` folder. That folder **is** the game.

Which means it can be hosted on:

| Where | Cost | Notes |
|---|---|---|
| **Vercel** | Free | Smoothest with Next.js. Recommended. |
| **Netlify** | Free | Equally fine. Drag the `out/` folder in, or connect the repo. |
| **Cloudflare Pages** | Free | Fastest global network. Also fine. |
| **GitHub Pages** | Free | Works. Slightly fiddlier with paths. |
| **Any cheap web host** | ~$3/mo | Upload `out/` via FTP like it's 2005. It works. |
| **A USB stick** | Free | Genuinely. Open `index.html`. Useful for a church with no internet. |

**You are not locked in to anyone.** If Vercel changes their pricing, you move the folder. This is deliberate — it's the opposite of the fragility that made the last attempt fall apart.

---

## 3. What you need, one time

| Thing | Why | Cost |
|---|---|---|
| **Node.js** (LTS version) | Runs the build tooling | Free |
| **Git** | Version control — the thing that stops it scattering | Free |
| **A GitHub account** | Where the code lives, permanently | Free |
| **A Vercel or Netlify account** | Hosting. Sign in with GitHub. | Free |
| **Claude Code** (this) | Writes the code | You have it |
| **An image generator** | The twenty illustrations | ~$10–30 total |
| **A domain name** | Later, once it works | ~$12–15/year |

**Total to a live, public, working game: about $15 for the first year**, plus image generation. That is the honest number.

---

## 4. The actual sequence

### Stage 1 — Build it locally (no internet needed after setup)

Create an empty folder. Open Claude Code in it. Hand over `SPEC.md` and build in the order given in §18 of the spec — **not as one giant prompt.** One step at a time, testing each:

1. Scaffold Next.js + TypeScript + Tailwind
2. `content/stories.ts` with all twenty entries, placeholder images
3. Pure logic + tests (`shuffle`, `swap`, `isSolved`, `correctCount`)
4. Scoring + tests
5. The grid, drag-and-swap, one hardcoded image
6. Timer + phase state machine
7. Full loop wired: intro → play → story card → results
8. Modes, local storage, polish

Run `npm run dev` and open `http://localhost:3000`. You are playing the real game on your own machine. No internet involved.

**After each working step: commit.**

```bash
git add -A
git commit -m "Working timer and phase transitions"
```

This is the single habit that prevents the "it worked for a while then everything scattered" outcome. Every commit is a save point you can return to.

### Stage 2 — Put it on GitHub

```bash
git init
git branch -M main
git remote add origin https://github.com/YOURNAME/bible-puzzle-quest.git
git push -u origin main
```

The repository is now the project. Not your laptop. Not a chat window. Not a Downloads folder. **If it isn't committed and pushed, it doesn't exist.**

### Stage 3 — Connect Vercel and get a test URL

On vercel.com: *Add New Project* → import the GitHub repo → Deploy. It detects Next.js automatically.

Two minutes later you have a live URL like `bible-puzzle-quest.vercel.app`. It is real, public, and shareable. Send it to your phone. Send it to a Sunday school teacher.

From now on, **every `git push` to `main` redeploys automatically.** You never upload anything by hand again.

### Stage 4 — Test it properly

This is the stage you were right to insist on. Four layers:

1. **Automated** — `npm test`. Twenty stories present, unique ids, images resolve, shuffle passes the 80% displacement rule over 1,000 seeds, scoring matches the formula.
2. **Your own devices** — your phone, a tablet, a laptop, portrait and landscape. Play all twenty rounds end to end without reloading. Watch for: stuck timer, dropped tile mid-drag, a round that won't register as solved.
3. **Real conditions** — throttle to Slow 3G in browser devtools. Test on a projector if the plan is classroom use. Test with wifi off after first load.
4. **Real children.** Non-negotiable. Four or five kids of different ages, and watch without helping. You will learn in twenty minutes that a timer is too short, a tile is too small, or that nobody noticed the Peek button. Then tune `modes.ts` — which is why all of that is configuration and not hardcoded.

Deploy preview branches for anything risky: push to a branch instead of `main` and Vercel gives you a separate URL to test before it touches the live site.

### Stage 5 — Buy the domain

Only now. Once it works and children have played it.

Buy from Namecheap, Cloudflare Registrar (cheapest, at cost), or Porkbun — roughly $12–15/year. Avoid buying the domain *through* the host; keeping the registrar separate means you can move hosts freely.

Then in Vercel: *Settings → Domains → Add*, and it tells you exactly which two DNS records to set at the registrar. Propagation takes anywhere from ten minutes to a few hours. HTTPS is issued automatically and free.

Some name ideas worth checking: `biblepuzzlequest.com`, `storyboardbible.com`, `twentywonders.com`, `puzzlethebible.com`.

---

## 5. What "version one, working properly" actually means

Concretely, the thing you should be able to hand to someone:

> A teacher opens a link on a classroom projector. No login, no install, no loading spinner. They tap **Play**, choose **Standard**. Round 1 of 20 appears — *Creation: light over the waters.* A scrambled 3×3 image, a 45-second ring draining. Children call out where pieces go, someone drags them. It snaps whole. The full painting appears with *Genesis 1:1–5* and two sentences, and the teacher taps pause to talk about it for a minute. Tap. Round 2. Twenty rounds later: a score, a rank, and twenty stories from Genesis to Jeremiah that the class just walked through in order. Twenty minutes, start to finish. It worked on the projector, it works on a phone, and it will work next Sunday when the wifi is down.

Everything else — multiplayer, room codes, live leaderboards, a New Testament pack — is Phase 2. It is specified in `SPEC.md` §14, and v1's seeded shuffle and pure logic are built specifically so Phase 2 is an addition rather than a rebuild.

---

## 6. The rules that stop it scattering this time

The last version worked and then dissolved. That is nearly always structure, not code. Five rules:

1. **The GitHub repo is the project.** Not a folder in Downloads. Not a chat. If it isn't pushed, it doesn't exist.
2. **Commit every time something works.** Small commits with plain messages. Save points.
3. **One branch deploys.** `main` → production, automatically. No manual uploads, ever.
4. **Assets live in the repo.** The twenty images are committed files. Not Google Drive, not a hotlink, not "on my other laptop."
5. **Content in one file.** `content/stories.ts`. If story text shows up inside a component, that's a bug. This is what lets you add a 21st story in five minutes a year from now.

Add a `README.md` at the root with three things: what the game is, how to run it locally, and the live URL. Future-you will need it.

---

## 7. Realistic timeline

| Stage | Effort |
|---|---|
| Scaffold + content file + pure logic and tests | Half a day |
| Puzzle grid, drag-and-swap working | Half a day |
| Timer, state machine, full loop end to end | One day |
| Modes, storage, results, story library | Half a day |
| The twenty images (generate, check, regenerate rejects) | One to two days — **the real bottleneck** |
| Accessibility and polish | Half a day |
| Deploy, test, tune | Half a day |

**Roughly a week of focused work**, and the images are the long pole, not the code. Start generating them early and in parallel with the build — the game runs fine on placeholders until they're ready.
