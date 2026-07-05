# GAG2 Shop

## Run locally

```bash
npm start
```

Then open:

```text
http://127.0.0.1:8080/
```

## GitHub Pages note

GitHub Pages can host the static frontend files, but it cannot run `server.js`.
Orders, admin login records, price saving, Google verification, and chat API need a Node host such as Render, Railway, Replit, a VPS, or another service that can run `npm start`.

## Google login

To enable Google login, add your OAuth Web Client ID in `config.js`:

```js
window.GAG2_CONFIG = {
  googleClientId: "YOUR_GOOGLE_CLIENT_ID"
};
```

## Admin password

Admin password is currently set in `server.js` and `script.js`:

```text
dunks-gag2
```
