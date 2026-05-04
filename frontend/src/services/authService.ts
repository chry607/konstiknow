/**
 * Authentication Service
 * 
 * This service handles all authentication-related operations.
 * 
 * BACKEND INTEGRATION NOTES:
 * ==========================
 * 
 * 1. GOOGLE OAUTH SETUP:
 *    - You'll need to configure Google OAuth in your Supabase dashboard
 *    - Go to: https://supabase.com/docs/guides/auth/social-login/auth-google
 *    - Get your Google OAuth credentials (Client ID & Secret)
 *    - Add them to Supabase Auth settings
 *    - Configure redirect URLs
 * 
 * 2. USER DATA STRUCTURE (JSON):
 *    When a user signs in, you'll receive:
 *    {
 *      "id": "uuid-string",
 *      "email": "user@example.com",
 *      "user_metadata": {
 *        "name": "User Name",
 *        "avatar_url": "https://...",
 *        "provider": "google" | "guest"
 *      },
 *      "created_at": "2024-01-01T00:00:00Z"
 *    }
 * 
 * 3. SESSION MANAGEMENT:
 *    After successful login, store the session:
 *    {
 *      "access_token": "eyJhbGc...",
 *      "refresh_token": "...",
 *      "expires_at": 1234567890,
 *      "user": { ... user data ... }
 *    }
 */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://konstiknow-backend.onrender.com';
const SESSION_TOKEN_KEY = 'session_token';
const GUEST_ID_KEY = 'guest_id';
const OAUTH_HASH_KEYS = ['access_token', 'refresh_token'];
const PKCE_VERIFIER_KEY = 'pkce_code_verifier';
const PKCE_STATE_KEY = 'pkce_state';

const requestJson = async <T>(
  path: string,
  options: RequestInit = {},
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
};

const base64UrlEncode = (input: ArrayBuffer) =>
  btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

const createRandomBytes = (length: number) => {
  const bytes = new Uint8Array(length);
  window.crypto.getRandomValues(bytes);
  return bytes;
};

const createPkcePair = async () => {
  const verifier = base64UrlEncode(createRandomBytes(32).buffer);
  const state = base64UrlEncode(createRandomBytes(16).buffer);
  const digest = await window.crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(verifier),
  );

  return {
    codeVerifier: verifier,
    codeChallenge: base64UrlEncode(digest),
    state,
  };
};

const applyOAuthTokensFromUrl = async () => {
  const searchParams = new URLSearchParams(window.location.search);
  const authError = searchParams.get('error');
  if (authError) {
    console.error(
      'OAuth callback error:',
      searchParams.get('error_description') || authError,
    );
    window.history.replaceState(
      {},
      document.title,
      window.location.pathname + window.location.hash,
    );
    return;
  }

  const code = searchParams.get('code');
  const state = searchParams.get('state');
  if (code) {
    const storedState = localStorage.getItem(PKCE_STATE_KEY);
    const codeVerifier = localStorage.getItem(PKCE_VERIFIER_KEY);

    if (!storedState || !codeVerifier || (state && state !== storedState)) {
      console.error('OAuth callback failed:', {
        hasStoredState: !!storedState,
        hasCodeVerifier: !!codeVerifier,
        stateMatch: state === storedState,
      });
      // Clear the invalid params from URL
      window.history.replaceState(
        {},
        document.title,
        window.location.pathname + window.location.hash,
      );
      throw new Error('OAuth validation failed. Please try logging in again.');
    }

    const tokenData = await requestJson<{
      success: boolean;
      access_token: string;
      refresh_token?: string;
    }>('/api/auth/exchange', {
      method: 'POST',
      body: JSON.stringify({
        code,
        code_verifier: codeVerifier,
      }),
    });

    if (tokenData.access_token) {
      localStorage.setItem(SESSION_TOKEN_KEY, tokenData.access_token);
    }
    if (tokenData.refresh_token) {
      localStorage.setItem('refresh_token', tokenData.refresh_token);
    }

    localStorage.removeItem(PKCE_STATE_KEY);
    localStorage.removeItem(PKCE_VERIFIER_KEY);

    window.history.replaceState(
      {},
      document.title,
      window.location.pathname + window.location.hash,
    );
  }

  if (!window.location.hash) return;

  const hashParams = new URLSearchParams(window.location.hash.slice(1));
  const accessToken = hashParams.get('access_token');
  const refreshToken = hashParams.get('refresh_token');

  if (accessToken) {
    localStorage.setItem(SESSION_TOKEN_KEY, accessToken);
  }
  if (refreshToken) {
    localStorage.setItem('refresh_token', refreshToken);
  }

  const hasOauthParams = OAUTH_HASH_KEYS.some((key) => hashParams.has(key));
  if (hasOauthParams) {
    window.history.replaceState(
      {},
      document.title,
      window.location.pathname + window.location.search,
    );
  }
};

export interface User {
  id: string;
  email?: string;
  name?: string;
  avatar_url?: string;
  is_guest: boolean;
}

/**
 * Sign in with Google
 * 
 * BACKEND FLOW:
 * 1. User clicks "Continue with Google"
 * 2. Redirected to Google OAuth page
 * 3. User authorizes the app
 * 4. Google redirects back with auth code
 * 5. Supabase exchanges code for access token
 * 6. User session is created
 * 
 * API ENDPOINT (if custom backend):
 * POST /api/auth/google
 * Response: {
 *   "success": true,
 *   "user": { ...user data... },
 *   "session": { ...session data... }
 * }
 */
export async function signInWithGoogle() {
  try {
    const pkce = await createPkcePair();
    localStorage.setItem(PKCE_VERIFIER_KEY, pkce.codeVerifier);
    localStorage.setItem(PKCE_STATE_KEY, pkce.state);

    const data = await requestJson<{
      success: boolean;
      auth_url: string;
    }>('/api/auth/google', {
      method: 'POST',
      body: JSON.stringify({
        redirect_to: window.location.origin,
        state: pkce.state,
        code_challenge: pkce.codeChallenge,
      }),
    });

    if (data.auth_url) {
      window.location.assign(data.auth_url);
    }

    return { success: true };
  } catch (error) {
    console.error('Google sign-in error:', error);
    return { success: false, error };
  }
}

/**
 * Sign in with Email (Magic Link)
 */
export async function signInWithEmail(email: string) {
  try {
    const pkce = await createPkcePair();
    localStorage.setItem(PKCE_VERIFIER_KEY, pkce.codeVerifier);
    localStorage.setItem(PKCE_STATE_KEY, pkce.state);

    await requestJson<{ success: boolean }>('/api/auth/email', {
      method: 'POST',
      body: JSON.stringify({
        email,
        redirect_to: window.location.origin,
        state: pkce.state,
        code_challenge: pkce.codeChallenge,
      }),
    });

    return { success: true };
  } catch (error) {
    console.error('Email sign-in error:', error);
    return { success: false, error };
  }
}

/**
 * Continue as Guest
 * 
 * BACKEND FLOW:
 * 1. Generate anonymous session
 * 2. Create temporary user ID (stored in localStorage)
 * 3. Progress is saved locally or linked to this temp ID
 * 
 * API ENDPOINT (if custom backend):
 * POST /api/auth/guest
 * Request: {}
 * Response: {
 *   "success": true,
 *   "guest_id": "guest_uuid",
 *   "session_token": "temp_token"
 * }
 * 
 * NOTE: Guest data can be migrated to a real account later
 */
export async function continueAsGuest(): Promise<User> {
  const data = await requestJson<{
    success: boolean;
    guest_id: string;
    session_token: string;
  }>('/api/auth/guest', {
    method: 'POST',
  });

  if (data.session_token) {
    localStorage.setItem(SESSION_TOKEN_KEY, data.session_token);
  }
  localStorage.setItem(GUEST_ID_KEY, data.guest_id);

  return {
    id: data.guest_id,
    name: 'Guest User',
    is_guest: true,
  };
}

/**
 * Get current session
 * 
 * BACKEND FLOW:
 * Check if user has an active session
 * 
 * API ENDPOINT (if custom backend):
 * GET /api/auth/session
 * Headers: { "Authorization": "Bearer {access_token}" }
 * Response: {
 *   "authenticated": true,
 *   "user": { ...user data... }
 * }
 */
export async function getCurrentSession() {
  try {
    try {
      await applyOAuthTokensFromUrl();
    } catch (oauthError) {
      console.error('OAuth callback processing failed:', oauthError);
      // Clear any partial OAuth state
      localStorage.removeItem(PKCE_STATE_KEY);
      localStorage.removeItem(PKCE_VERIFIER_KEY);
      // Don't throw - allow checking for existing sessions
    }

    const token = localStorage.getItem(SESSION_TOKEN_KEY);
    if (token) {
      const session = await requestJson<{
        authenticated: boolean;
        user: User | null;
      }>('/api/auth/session', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (session.authenticated && session.user) {
        return { success: true, user: session.user };
      }
    }

    const guestId = localStorage.getItem(GUEST_ID_KEY);
    if (guestId) {
      return {
        success: true,
        user: {
          id: guestId,
          name: 'Guest User',
          is_guest: true,
        },
      };
    }

    return { success: false };
  } catch (error) {
    console.error('Session check error:', error);
    return { success: false, error };
  }
}

/**
 * Sign out
 * 
 * BACKEND FLOW:
 * 1. Invalidate session token
 * 2. Clear local storage
 * 3. Redirect to login page
 * 
 * API ENDPOINT (if custom backend):
 * POST /api/auth/logout
 * Headers: { "Authorization": "Bearer {access_token}" }
 * Response: { "success": true }
 */
export async function signOut() {
  try {
    const token = localStorage.getItem(SESSION_TOKEN_KEY);
    if (token) {
      await requestJson('/api/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    localStorage.removeItem(GUEST_ID_KEY);
    localStorage.removeItem(SESSION_TOKEN_KEY);

    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    return { success: false, error };
  }
}
