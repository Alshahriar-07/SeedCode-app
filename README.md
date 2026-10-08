# 🌱 Seed Code Chat

> A clean, modern and responsive AI chat platform built with Vanilla JavaScript, designed to provide a smooth ChatGPT-style conversational experience with the Seed Code visual identity.

**Seed Code Chat** is a general-purpose AI assistant for everyday questions, coding, learning, writing, brainstorming and productivity.

It is designed to feel simple for normal users while still providing useful tools and model controls for developers and power users.

---

## ✨ Overview

Seed Code Chat combines a lightweight frontend with a server-side AI gateway to communicate with AI providers securely.

The application focuses on:

- ⚡ Fast AI responses
- 💬 Natural conversational experience
- 🧠 Multiple AI model support
- 🔐 Secure server-side API handling
- 👤 User authentication
- ☁️ Cloud-ready deployment
- 📱 Mobile + desktop responsive design
- 🎨 Premium Seed Code UI
- ✨ Smooth page and response animations
- 💾 Persistent conversation history
- ⚙️ Flexible model and generation settings

The goal is simple:

> **Make AI chat powerful without making the interface complicated.**

---

# 🚀 Features

## 💬 AI Chat

Seed Code Chat provides a modern conversational interface similar to popular AI assistants.

Supported functionality includes:

- New conversations
- Multiple messages per conversation
- Continuous conversations
- Streaming AI responses (partial output is preserved if a stream fails mid-answer)
- Markdown rendering
- Code block rendering
- Syntax highlighting
- Copy response
- Copy code
- **Run code** — every `python` / `html` code block gets a Run button next to Copy:
  Python runs in a sandboxed, resource-limited interpreter on the server;
  HTML/SVG opens in an isolated, sandboxed preview frame
- Regenerate response
- Automatic scrolling
- Message timestamps
- Model information
- Provider information
- Error handling

---

## 🤖 AI Model Selection

Users can select available AI models directly from the chat interface.

The model selector is designed around:

- Searchable/selectable model lists
- Provider grouping
- Free model support
- Model names
- Model identifiers
- Model descriptions where available
- Easy switching between models

The application should never unnecessarily change the model selected by the user.

If a selected model becomes unavailable, the application should report the problem clearly instead of silently changing the user's model.

---

# 🌐 AI Providers

Seed Code Chat is designed around a provider-based architecture.

Currently supported or planned providers may include:

- OpenRouter
- FreeModel.dev
- AeroLink
- Other compatible providers

Provider configuration should remain isolated from the main UI.

The frontend should not contain provider secrets.

---

# 🔑 OpenRouter API System

OpenRouter is used as one of the primary AI gateways.

The backend can support multiple OpenRouter API keys.

Example environment configuration:

```env
OPENROUTER_API_KEY_1=your_key_here
OPENROUTER_API_KEY_2=your_key_here
OPENROUTER_API_KEY_3=your_key_here
OPENROUTER_API_KEY_4=your_key_here
OPENROUTER_API_KEY_5=your_key_here
OPENROUTER_API_KEY_6=your_key_here
```
# 🔄 API Key Fallback
```bash
KEY 1
  ↓
success → return response

failure
  ↓
KEY 2
  ↓
success → return response

failure
  ↓
KEY 3
  ↓
success → return response

failure
  ↓
KEY 4
  ↓
success → return response

failure
  ↓
KEY 5
  ↓
success → return response

failure
  ↓
KEY 6
  ↓
success → return response

failure
  ↓
clean final error

---
```
# 🔐 Security
```bash
Browser
   │
   │ POST /api/chat
   ▼
Seed Code Backend
   │
   │ Server-side API key
   ▼
AI Provider
   │
   ▼
AI Response
   │
   ▼
Backend
   │
   ▼
Browser

---
```

---

# 📱 Android App (Capacitor)

The same web codebase ships as a native Android app via [Capacitor](https://capacitorjs.com).
Provider keys **never** ship inside the APK — the app uses the managed `seedcode`
provider, which routes through the production backend (`https://seedcode-chat.vercel.app/api/*`)
where the API keys live server-side.

## Requirements

| Tool        | Version        |
|-------------|----------------|
| Node.js     | 22+            |
| JDK         | 21             |
| Android SDK | Platform 36, Build Tools 36.0.0 |

Set these environment variables for every build:

```powershell
$env:JAVA_HOME  = "C:\Users\alsha\AppData\Local\Programs\jdk-21\jdk-21.0.12+8"
$env:ANDROID_HOME = "C:\Users\alsha\AppData\Local\Android\Sdk"
```

## Workflow

```bash
npm install                 # install Capacitor + tooling
npm run plugins             # bundle Capacitor plugins -> js/vendor/capacitor-plugins.js
npm run sync                # verify web -> build www/ -> cap sync android
```

- `npm run apk:debug` — build an unsigned debug APK (`android/app/build/outputs/apk/debug/`).
- `npm run apk:release` — build a signed release APK.
- `npx cap open android` — open in Android Studio.

## Release signing

Signing credentials are read from `android/keystore.properties` (gitignored):

```properties
storeFile=C\:\\Users\\alsha\\AppData\\Local\\SeedCodeChat\\keystore\\seedcode-release.jks
storePassword=…
keyAlias=seedcode
keyPassword=…
```

Create a new keystore with (do **not** commit it):

```bash
keytool -genkeypair -v -keystore seedcode-release.jks -alias seedcode \
  -keyalg RSA -keysize 4096 -validity 10000 \
  -dname "CN=Seed Code Chat, OU=Mobile, O=Seed Code, C=US"
```

**Keep the keystore and its passwords safe and backed up — losing them means you
cannot update a published app.**

## Version bump

Edit `android/app/build.gradle`:

```groovy
versionCode 2        // integer, must increase for every Play Store upload
versionName "2.0.0"  // human-readable (v2.0.0)
```

## Google Play (AAB)

For Play Store distribution, build an App Bundle:

```bash
cd android
.\gradlew.bat bundleRelease
# output: android/app/build/outputs/bundle/release/app-release.aab
```

## Icons & splash

All launcher icons, adaptive-icon foregrounds and splash screens are generated
from `assets/logo.png` (128×128, transparent corners, green `#2ECC71` center):

```powershell
powershell -ExecutionPolicy Bypass -File scripts\generate-android-icons.ps1
```

Replace the logo at `assets/logo.png` and re-run to regenerate every Android
asset. Brand colors live in `android/app/src/main/res/values/colors.xml` and
`capacitor.config.ts`.

## Production backend config

The app always talks to `https://seedcode-chat.vercel.app` (see `js/config.js`
→ `backend`). Point the `seedcode` provider at a different deployment by
updating `backend.apiBase` there, then rebuild + `cap sync`.
