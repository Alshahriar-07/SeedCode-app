# Release — Seed Code Chat v2.0.0

Release date: 2026-10
Branch: `main` · Tag: `v2.0.0` · versionCode incremented in `android/app/build.gradle`

## What's in this release

Highlights (full details in `CHANGELOG.md`):

- **Run button** on `python` and `html` code blocks (sandboxed Python
  executor endpoint + HTML preview frame).
- **Voice mode**, **web retrieval**, **image generation** and the
  **live model discovery cache** from the v2 feature work.
- Single header **model picker**, refreshed **history menus** and pages.
- Stream-failure **partial-answer preservation** and clearer provider errors.

## Pre-release checks (all verified green)

| Check | Command | Status |
|---|---|---|
| JS syntax (all files) | `node --check` across `js/`, `api/` | ✅ |
| Web integrity | `npm run verify` | ✅ 22 pages, 698 refs, 31 js files |
| Python runner e2e | local POST `/api/run-python` | ✅ stdout/stderr/exit code, 10 s kill works |
| Run-button gating | python/html show Run; js/css do not | ✅ |

## Build the release artifacts

Environment for every command (Windows):

```powershell
$env:JAVA_HOME    = "C:\Users\alsha\AppData\Local\Programs\jdk-21\jdk-21.0.12+8"
$env:ANDROID_HOME = "C:\Users\alsha\AppData\Local\Android\Sdk"
```

```bash
npm run sync        # verify -> build www/ -> bundle keys -> cap sync android
npm run apk:release # signed release APK
cd android && cmd //c gradlew.bat bundleRelease   # AAB for Play Store
```

Outputs:

- APK: `android/app/build/outputs/apk/release/app-release.apk`
- AAB: `android/app/build/outputs/bundle/release/app-release.aab`

Copy release artifacts to the release folder with the
project's lowercase naming convention:

```bash
mkdir -p release/v2.0.0
cp android/app/build/outputs/apk/release/app-release.apk \
   release/v2.0.0/seed-code-chat-v2.0.0-release-signed.apk
cp android/app/build/outputs/bundle/release/app-release.aab \
   release/v2.0.0/seed-code-chat-v2.0.0-release.aab
```

The release folder ships together with `README.md`, `CHANGELOG.md` and this
`RELEASE.md` so the GitHub release page can be assembled from it directly.

## Deploy the web app (production)

The production site `https://seedcode-chat.vercel.app` currently serves a
stale v1 frontend **and** has no OpenRouter keys configured, which breaks
chat and models. To fix:

1. Set the six env vars in the Vercel project (Production environment):
   `OPENROUTER_API_KEY_1` … `OPENROUTER_API_KEY_6` (values from the local
   `.env`, never committed).
2. Redeploy `main` so the v2 frontend + new endpoints
   (`/api/web`, `/api/image`, `/api/run-python`) go live:
   `npx vercel --prod` after `npx vercel link`, or push a deploy from the
   Vercel dashboard.
3. Post-deploy smoke checks:
   - `curl https://seedcode-chat.vercel.app/api/models` → JSON model list (not 503)
   - `js/voice.js`, `js/web-retrieval.js`, `js/image-generation.js`,
     `js/code-runner.js` → HTTP 200
   - POST `/api/chat` with a short message → streamed answer

## Known limitations at ship time

- Python execution is unavailable on Vercel's Node runtime; the button
  reports this honestly until the endpoint runs on a host with Python
  (set `SEED_PYTHON_PATH`). HTML preview works everywhere.
- The production outage persists until the Vercel env vars are set and the
  project is redeployed — this is an account-authenticated step, not a code
  change.
