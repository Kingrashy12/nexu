import forge from "node-forge";
import { Keys } from "../types";

export const secure = (private_key: string, public_key: string) => {
  const publicKey = forge.pki.publicKeyFromPem(public_key);
  const privateKey = forge.pki.privateKeyFromPem(private_key);

  return {
    publicKey,
    privateKey,
  };
};

function encrypt(data: unknown, key: Keys) {
  try {
    const jsonString = JSON.stringify(data);
    const encrypted = secure(key.private_key, key.public_key).publicKey.encrypt(
      jsonString,
      "RSA-OAEP",
      {
        md: forge.md.sha256.create(),
      }
    );
    return forge.util.encode64(encrypted);
  } catch (error) {
    throw new Error("Encryption failed: Check your keys or data.");
  }
}

function decrypt(encryptedData: string, key: Keys) {
  try {
    const encryptedBytes = forge.util.decode64(encryptedData);
    const decrypted = secure(
      key.private_key,
      key.public_key
    ).privateKey.decrypt(encryptedBytes, "RSA-OAEP", {
      md: forge.md.sha256.create(),
    });
    return JSON.parse(decrypted);
  } catch (error) {
    throw new Error("Decryption failed: Invalid data or key mismatch.");
  }
}

export { encrypt, decrypt };
