import forge from "node-forge";
import { readConfig } from "../utils/config";

export const secure = () => {
  const Config = readConfig();
  const public_key = String(Config?.keys.public);
  const private_key = String(Config?.keys.private);

  if (!private_key || !public_key) {
    throw new Error("Keys are not set. Please set them using nexu.config");
  }

  const publicKey = forge.pki.publicKeyFromPem(public_key);
  const privateKey = forge.pki.privateKeyFromPem(private_key);

  return {
    publicKey,
    privateKey,
  };
};

/**
 * A Utility function used for encrypting small data using RSA-OAEP with a public key.
 * This function is suitable for encrypting small payloads like secrets, keys, or short messages.
 *
 * @param {unknown} data - The data to be encrypted. It will be serialized to JSON before encryption.
 * @returns {string} The Base64-encoded encrypted string.
 *
 * @throws {Error} Throws an error if the public key is not set or encryption fails.
 *
 * @example
 * const encrypted = encrypt({ message: "Hello, World!" });
 * console.log(encrypted); // Base64-encoded encrypted string
 */
function encrypt(data: unknown) {
  const jsonString = JSON.stringify(data);
  const encrypted = secure().publicKey.encrypt(jsonString, "RSA-OAEP", {
    md: forge.md.sha256.create(),
  });
  return forge.util.encode64(encrypted);
}

/**
 * Decrypts data encrypted using the `encrypt` function.
 * This function uses the private key to decrypt the Base64-encoded encrypted string.
 *
 * @param {string} encryptedData - The Base64-encoded encrypted string to decrypt.
 * @returns {unknown} The decrypted data, parsed back to its original form (e.g., an object or primitive value).
 *
 * @throws {Error} Throws an error if the private key is not set or decryption fails.
 *
 * @example
 * const decrypted = decrypt(encryptedString);
 * console.log(decrypted); // Original data (e.g., { message: "Hello, World!" })
 */
function decrypt(encryptedData: string) {
  const encryptedBytes = forge.util.decode64(encryptedData);
  const decrypted = secure().privateKey.decrypt(encryptedBytes, "RSA-OAEP", {
    md: forge.md.sha256.create(),
  });
  return JSON.parse(decrypted);
}

export { encrypt, decrypt };
