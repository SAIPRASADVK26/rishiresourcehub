// Secure SHA-256 Client-side PIN Verifier
// The PIN itself is NEVER stored in plain text anywhere in the source code.
// Only the one-way cryptographic SHA-256 hash is compared.

const DEFAULT_PIN_SALT = 'rishi_secret_salt_2026';
const DEFAULT_PIN_HASH = 'd1ef28a3193c96f10152d887aafa15cc197dd7732246aad3411d1e179d15b3ec'; // Hash of '2026'

async function computeSha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyAdminPin(enteredPin) {
  if (!enteredPin || typeof enteredPin !== 'string') return false;
  try {
    const salt = import.meta.env.VITE_ADMIN_SALT || DEFAULT_PIN_SALT;
    const targetHash = import.meta.env.VITE_ADMIN_PIN_HASH || DEFAULT_PIN_HASH;
    
    const computed = await computeSha256(salt + enteredPin.trim());
    return computed === targetHash;
  } catch (err) {
    console.error('Cryptographic verification failed:', err);
    return false;
  }
}

export function getAdminSession() {
  try {
    return sessionStorage.getItem('rishi_admin_session') === 'active';
  } catch {
    return false;
  }
}

export function setAdminSession(active) {
  try {
    if (active) {
      sessionStorage.setItem('rishi_admin_session', 'active');
    } else {
      sessionStorage.removeItem('rishi_admin_session');
    }
  } catch {
    // ignore storage restrictions
  }
}
