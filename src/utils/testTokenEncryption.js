/**
 * Test: Token Encryption Verification
 * This demonstrates the token encryption workflow
 */

import { encryptToken, decryptToken, compareTokens } from "../utils/tokenEncryption.js";

// Simulated JWT token (similar structure to real JWT)
const mockJWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YzQyMzQ1YjUwZWY4OTAxMjM0NTY3OCIsInJvbGUiOiJ1c2VyIn0.mock_signature_here";

/**
 * Test token encryption and decryption
 */
export async function testTokenEncryption() {
  console.log("🔐 Testing Token Encryption...\n");
  
  try {
    // Step 1: Encrypt token
    console.log("Step 1: Encrypting JWT token...");
    const encryptedToken = await encryptToken(mockJWT);
    console.log("✅ Token encrypted successfully");
    console.log(`   Encrypted format: IV:EncryptedData`);
    console.log(`   Encrypted token (first 50 chars): ${encryptedToken.substring(0, 50)}...\n`);

    // Step 2: Store in localStorage (simulated)
    console.log("Step 2: Storing encrypted token in localStorage...");
    localStorage.setItem("token", encryptedToken);
    console.log("✅ Encrypted token stored\n");

    // Step 3: Retrieve and decrypt
    console.log("Step 3: Retrieving and decrypting token...");
    const storedEncryptedToken = localStorage.getItem("token");
    const decryptedToken = await decryptToken(storedEncryptedToken);
    console.log("✅ Token decrypted successfully\n");

    // Step 4: Verify token matches
    console.log("Step 4: Verifying token integrity...");
    if (decryptedToken === mockJWT) {
      console.log("✅ Token matches! Encryption/Decryption successful\n");
    } else {
      console.log("❌ Token mismatch! Encryption/Decryption failed\n");
    }

    // Step 5: Compare tokens
    console.log("Step 5: Comparing plain token with encrypted stored token...");
    const tokensMatch = await compareTokens(mockJWT, encryptedToken);
    if (tokensMatch) {
      console.log("✅ Tokens match! Comparison successful\n");
    } else {
      console.log("❌ Tokens don't match!\n");
    }

    // Step 6: Show encryption flow diagram
    console.log("📊 Token Encryption Flow:");
    console.log("   Plain JWT → [AES-256-CBC Encrypt] → Encrypted (IV:Data) → localStorage");
    console.log("   localStorage → [Extract IV] → [AES-256-CBC Decrypt] → Plain JWT → API Request\n");

    console.log("🎉 Token Encryption Test Complete!");
    
    // Cleanup
    localStorage.removeItem("token");

    return {
      success: true,
      originalToken: mockJWT,
      encryptedToken: encryptedToken,
      decryptedToken: decryptedToken,
      verified: decryptedToken === mockJWT
    };

  } catch (error) {
    console.error("❌ Token encryption test failed:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Export for use in components
export default testTokenEncryption;
