import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  withCredentials: true, // still send/receive cookies where the browser allows it
  headers: { 'Content-Type': 'application/json' },
});

// ── In-memory access token ──────────────────────────────────────────────
// Cookies alone aren't reliable here: accessToken/refreshToken are set
// sameSite:'none' (required for the frontend/backend being on different
// domains), which browsers treat as third-party cookies. A real user's
// Chrome profile usually has enough accumulated trust to still accept
// them, but a fresh/disposable browser profile (automated testing tools,
// incognito-like contexts, strict privacy settings) blocks them outright —
// login succeeds and writes to the DB, but the cookie never sticks, so the
// very next authenticated request 401s and the user gets bounced back to
// the login screen a couple seconds later.
//
// Every login/register/refresh response already returns the accessToken
// in the JSON body, so we keep it in memory here and attach it as a
// Bearer header on every request. That works regardless of cookie policy.
// It's intentionally NOT in localStorage (avoids persisting a bearer
// token somewhere readable by any injected script) — it just needs to
// survive for the lifetime of this tab/session, which module-scoped state
// does.
let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token || null;
};

export const clearAccessToken = () => {
  accessToken = null;
};

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => refreshSubscribers.push(cb);
const onRefreshed = () => {
  refreshSubscribers.forEach((cb) => cb());
  refreshSubscribers = [];
};

// On any 401, silently hit /auth/refresh once, then retry the original
// request. If the refresh itself fails, the session is truly over.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthRoute =
      originalRequest?.url?.includes('/auth/login') ||
      originalRequest?.url?.includes('/auth/register') ||
      originalRequest?.url?.includes('/auth/refresh');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const { data } = await api.post('/auth/refresh');
          // Refresh also returns a fresh accessToken in the body — keep the
          // in-memory copy current so subsequent requests use it too, not
          // just whatever the (possibly-blocked) cookie holds.
          setAccessToken(data?.data?.accessToken);
          isRefreshing = false;
          onRefreshed();
        } catch (refreshError) {
          isRefreshing = false;
          refreshSubscribers = [];
          clearAccessToken();
          window.dispatchEvent(new CustomEvent('civicpulse:session-expired'));
          return Promise.reject(refreshError);
        }
      }

      return new Promise((resolve, reject) => {
        subscribeTokenRefresh(() => {
          api(originalRequest).then(resolve).catch(reject);
        });
      });
    }

    return Promise.reject(error);
  }
);

export default api;