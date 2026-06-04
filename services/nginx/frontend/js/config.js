// Backend URL — set to your VPS URL when deploying frontend on Cloudflare Pages.
// Leave empty to use relative URLs (same-origin, e.g. local dev or all-on-VPS).
// Example: "https://api.mysite.com"
const _raw = window.__BACKEND_URL__ || "";
export const API_BASE = _raw.replace(/\/$/, "");
export const WS_BASE  = API_BASE
  ? API_BASE.replace(/^https/, "wss").replace(/^http/, "ws")
  : "wss://" + window.location.host;
