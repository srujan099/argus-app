/**
 * OAUTH CONFIG
 * -------------------------------------------------------------------
 * Fill these in with your own app credentials to make the "Connect"
 * buttons for Meta and Google actually open real login screens.
 *
 * You cannot put a CLIENT SECRET in this file (or anywhere in client-side
 * code) — secrets must live on a server. This file only holds the public
 * CLIENT ID / APP ID values, which are safe to expose in the browser.
 * See README.md for the full step-by-step on registering these apps and
 * where the secret eventually needs to live.
 * -------------------------------------------------------------------
 */

const ARGUS_OAUTH_CONFIG = {
  meta: {
    appId: "YOUR_META_APP_ID",           // from developers.facebook.com
    redirectUri: window.location.origin + "/oauth-callback.html",
    scope: "ads_management,ads_read",
    authUrl: "https://www.facebook.com/v19.0/dialog/oauth"
  },
  google: {
    clientId: "YOUR_GOOGLE_OAUTH_CLIENT_ID.apps.googleusercontent.com", // from console.cloud.google.com
    redirectUri: window.location.origin + "/oauth-callback.html",
    scope: "https://www.googleapis.com/auth/adwords",
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth"
  }
};

function isPlaceholder(value) {
  return !value || value.startsWith("YOUR_");
}

function buildMetaAuthUrl() {
  const c = ARGUS_OAUTH_CONFIG.meta;
  const params = new URLSearchParams({
    client_id: c.appId,
    redirect_uri: c.redirectUri,
    scope: c.scope,
    response_type: "code"
  });
  return `${c.authUrl}?${params.toString()}`;
}

function buildGoogleAuthUrl() {
  const c = ARGUS_OAUTH_CONFIG.google;
  const params = new URLSearchParams({
    client_id: c.clientId,
    redirect_uri: c.redirectUri,
    scope: c.scope,
    response_type: "code",
    access_type: "offline",
    prompt: "consent"
  });
  return `${c.authUrl}?${params.toString()}`;
}
