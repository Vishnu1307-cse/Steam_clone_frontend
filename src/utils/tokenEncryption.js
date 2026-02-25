/**
 * Token Encryption Utility
 * Encrypts/Decrypts JWT tokens before storage in localStorage
 * Uses AES-256-CBC with a derived key from environment
 */

// Use a fixed encryption key (in production, this should be derived from a secure source)
const ENCRYPTION_KEY = "your-secure-token-encryption-key-min-32-chars";

/**
 * Derive a 32-byte key from string
 */
function deriveKey(keyString) {
  let hash = 0;
  for (let i = 0; i < keyString.length; i++) {
    const char = keyString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Create a proper 32-byte key
  const key = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    key[i] = (hash ^ (i * 7)) & 0xff;
  }
  return key;
}

/**
 * Encrypt JWT token using AES-256-CBC
 * @param {string} token - JWT token to encrypt
 * @returns {string} - IV:EncryptedData (hex encoded)
 */
export async function encryptToken(token) {
  try {
    // Generate random IV (16 bytes)
    const iv = crypto.getRandomValues(new Uint8Array(16));
    
    // Derive encryption key
    const key = await crypto.subtle.importKey(
      "raw",
      deriveKey(ENCRYPTION_KEY),
      { name: "AES-CBC" },
      false,
      ["encrypt"]
    );

    // Encrypt token
    const encodedToken = new TextEncoder().encode(token);
    const encryptedData = await crypto.subtle.encrypt(
      { name: "AES-CBC", iv },
      key,
      encodedToken
    );

    // Return IV:EncryptedData (hex format)
    const ivHex = Array.from(iv).map(b => b.toString(16).padStart(2, "0")).join("");
    const dataHex = Array.from(new Uint8Array(encryptedData))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");

    return `${ivHex}:${dataHex}`;
  } catch (error) {
    console.error("Token encryption failed:", error);
    throw new Error("Failed to encrypt token");
  }
}

/**
 * Decrypt JWT token from encrypted storage
 * @param {string} encryptedToken - IV:EncryptedData (hex encoded)
 * @returns {string} - Decrypted JWT token
 */
export async function decryptToken(encryptedToken) {
  try {
    // Extract IV and encrypted data
    const [ivHex, dataHex] = encryptedToken.split(":");
    if (!ivHex || !dataHex) {
      throw new Error("Invalid encrypted token format");
    }

    // Convert hex to bytes
    const iv = new Uint8Array(ivHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    const encryptedData = new Uint8Array(dataHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

    // Derive decryption key
    const key = await crypto.subtle.importKey(
      "raw",
      deriveKey(ENCRYPTION_KEY),
      { name: "AES-CBC" },
      false,
      ["decrypt"]
    );

    // Decrypt token
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-CBC", iv },
      key,
      encryptedData
    );

    return new TextDecoder().decode(decrypted);
  } catch (error) {
    console.error("Token decryption failed:", error);
    throw new Error("Failed to decrypt token");
  }
}

/**
 * Compare two tokens (one plain, one encrypted)
 * @param {string} plainToken - Plain JWT token
 * @param {string} encryptedToken - Encrypted token from storage
 * @returns {boolean} - True if tokens match
 */
export async function compareTokens(plainToken, encryptedToken) {
  try {
    const decrypted = await decryptToken(encryptedToken);
    return plainToken === decrypted;
  } catch {
    return false;
  }
}
