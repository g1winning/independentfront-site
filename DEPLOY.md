# Publishing the Independent Front to GitHub Pages

This is a step-by-step guide. It assumes you have not used GitHub before. If you've done some of these steps already, skip ahead.

---

## What you're going to end up with

- A GitHub account (free)
- A repository named `independentfront-site` (or whatever you prefer) containing all the files in `site/`
- GitHub Pages enabled on that repo, serving the site at `https://YOUR-USERNAME.github.io/independentfront-site/`
- (Optional, recommended) Your custom domain `independentfront.com` pointed at GitHub Pages, so the site is served at `https://www.independentfront.com/` instead

Total time: 30–45 minutes the first time.

---

## Approach A — Web UI only, no terminal (easiest)

Use this approach if you've never run a command in a terminal and would rather not start now.

### A1 — Create the GitHub account

1. Go to https://github.com/signup
2. Sign up with your email. Pick a username. Verify your email.

### A2 — Create the repository

1. Click the `+` icon top-right → **New repository**
2. Repository name: `independentfront-site`
3. Set it to **Public** (GitHub Pages on a free account requires Public)
4. Tick **Add a README file**
5. Click **Create repository**

### A3 — Upload the site files

1. On the new repo page, click **Add file → Upload files**
2. Drag the entire contents of the `site/` folder (every `.html`, `style.css`, `app.js`, plus any images you've generated) into the upload area
3. **DO NOT upload `IMAGE-PROMPTS.md` or `DEPLOY.md`** — those are for you, not the public site
4. At the bottom, type a commit message like `Initial site upload`
5. Click **Commit changes**

### A4 — Turn on GitHub Pages

1. Click **Settings** (top of repo page) → **Pages** (left sidebar)
2. Under **Source**, select **Deploy from a branch**
3. Branch dropdown: select **main**, folder: **/ (root)**, click **Save**
4. Wait 30–60 seconds. Refresh the page. You will see a green panel saying:
   > Your site is live at https://YOUR-USERNAME.github.io/independentfront-site/

### A5 — Test it

Open that URL in a browser. You should see the FIX EVERYTHING gate. Click the button. You should see the hub with five cards.

If something's broken: take a screenshot, paste the URL, and bring it back into a Cowork session — fixes are quick.

### A6 — Point independentfront.com at GitHub Pages (optional, recommended)

If you want your existing domain to serve the new site:

1. Settings → Pages → **Custom domain** field → type `www.independentfront.com` → click **Save**
2. GitHub will create a file called `CNAME` in your repo. Leave it alone.
3. Log in to wherever your domain DNS is managed (the registrar where you bought independentfront.com — Namecheap, GoDaddy, Crazy Domains, etc.)
4. Find the DNS settings for `independentfront.com` and add these records:

```
Type   Name        Value
CNAME  www         YOUR-USERNAME.github.io
A      @           185.199.108.153
A      @           185.199.109.153
A      @           185.199.110.153
A      @           185.199.111.153
```

Replace `YOUR-USERNAME` with your actual GitHub username (lowercase).

5. Save the DNS changes. Wait 10 minutes to 24 hours for DNS to propagate (usually under an hour).
6. Back in GitHub Settings → Pages, tick **Enforce HTTPS** once it's available (the option appears once GitHub has verified your domain).

You're done. `https://www.independentfront.com/` now serves your new site.

---

## Approach B — Using the terminal (recommended once you're publishing more often)

Use this approach if you'll be making frequent updates. The first-time setup is 10 minutes; after that, publishing an update is a single command.

### B1 — Install git (one-off)

On macOS, open Terminal and run:

```bash
xcode-select --install
```

Click Install on the popup. Wait until it finishes.

Verify:

```bash
git --version
```

If a version number prints, you're good.

### B2 — Tell git who you are (one-off)

Replace with your name and email:

```bash
git config --global user.name "Your Name"
git config --global user.email "luca@ideasunion.com"
```

### B3 — Create the GitHub repo

Same as A1 + A2 above. Tick **Add a README file**.

### B4 — Clone the empty repo to your machine

In Terminal, navigate to where you want the project folder to live. For example, your Desktop:

```bash
cd ~/Desktop
```

Then clone (replace YOUR-USERNAME):

```bash
git clone https://github.com/YOUR-USERNAME/independentfront-site.git
```

A folder called `independentfront-site` will appear on your Desktop.

### B5 — Copy the site files into the repo folder

Replace `~/Desktop/independent\ front/independent\ front/site` with the actual path to your `site/` folder if different.

```bash
cp -R ~/Desktop/independent\ front/independent\ front/site/*.html ~/Desktop/independentfront-site/
cp ~/Desktop/independent\ front/independent\ front/site/style.css ~/Desktop/independentfront-site/
cp ~/Desktop/independent\ front/independent\ front/site/app.js ~/Desktop/independentfront-site/
```

If you have an `images/` folder:

```bash
cp -R ~/Desktop/independent\ front/independent\ front/site/images ~/Desktop/independentfront-site/
```

### B6 — Push to GitHub

```bash
cd ~/Desktop/independentfront-site
git add .
git commit -m "Initial site upload"
git push
```

The first time you push, GitHub will ask you to authenticate. Follow the on-screen instructions; the recommended flow is to use a personal access token.

### B7 — Turn on Pages

Same as A4 above.

### B8 — Updating the site later

Once the repo is set up, future updates are this fast:

```bash
cd ~/Desktop/independentfront-site
# (edit files)
git add .
git commit -m "Updated tax page figures"
git push
```

The live site auto-rebuilds within 60 seconds.

---

## Setting up the FormSubmit form (one-off, important)

The `talk-to-us.html` form sends submissions to `outreach@independentfront.com` via FormSubmit.co. To activate it:

1. After deploying the site, open `https://www.independentfront.com/talk-to-us.html`
2. Fill in the form with test data (use your own real name and email)
3. Click **Submit enquiry**
4. FormSubmit will redirect to a confirmation page and immediately send a verification email to `outreach@independentfront.com`
5. Open that inbox and click the verification link — this is a one-time step that confirms FormSubmit is allowed to send to that address
6. From then on, every submission lands directly in `outreach@independentfront.com`

Keep an eye on FormSubmit's spam-detection — if a legitimate submission ever fails to arrive, check your spam folder and FormSubmit's delivery dashboard at https://formsubmit.co.

---

## Common things that go wrong

**Issue: the site shows a 404 on every link except the homepage.**
Cause: GitHub Pages is serving from the wrong branch or folder. Settings → Pages → confirm "main" / "/ (root)" is selected.

**Issue: the FIX EVERYTHING button does nothing on the live site.**
Cause: `app.js` didn't upload, or it's in a subfolder. The HTML expects `app.js` in the same folder as `index.html`. Check the repo file list.

**Issue: charts don't render.**
Cause: Chart.js loads from a CDN over HTTPS. If you opened the site via `file://` (double-clicked the local HTML file), browser security will block CDN scripts. Always test the live URL, or run a local server.

**Issue: the form submits but nothing arrives.**
Cause: You haven't completed FormSubmit's first-time verification step. See above.

**Issue: I changed something but the live site still shows the old version.**
Cause: Your browser is caching. Hard-refresh: **Cmd-Shift-R** on Mac. If still not updated, GitHub Pages may take up to a minute to rebuild — wait, then refresh.

---

## What to do after publishing

1. Test every link in the masthead and footer.
2. Open the FIX EVERYTHING gate and click through.
3. Visit the four most figure-heavy pages — Tax, SWF, Budget, Healthcoverall — and confirm the charts render.
4. Submit a test enquiry through the contact form.
5. Share the URL with three people you trust for sanity-check feedback before announcing it.
6. Then do not announce it publicly without one final review pass.
