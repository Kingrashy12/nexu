import forge from "node-forge";
import { readConfig } from "../utils/config";
import { EncryptedData } from "../types";

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

function generateAESKey() {
  return forge.random.getBytesSync(32); // Generates a 256-bit AES key
}

function encrypt(data: unknown) {
  try {
    if (!data) {
      throw new Error("Input data is undefined or null.");
    }

    const jsonString = JSON.stringify(data).trim();

    // Generate a random AES key
    const aesKey = generateAESKey();

    // Encrypt the data using AES
    const cipher = forge.cipher.createCipher("AES-GCM", aesKey);
    const iv = forge.random.getBytesSync(12); // 12-byte IV
    cipher.start({ iv });
    cipher.update(forge.util.createBuffer(jsonString));
    const finished = cipher.finish();

    if (!finished) {
      throw new Error("AES encryption failed.");
    }

    const encryptedData = {
      aesKey: secure().publicKey.encrypt(aesKey, "RSA-OAEP", {
        md: forge.md.sha256.create(),
      }),
      cipherText: forge.util.encode64(cipher.output.getBytes()),
      iv: forge.util.encode64(iv),
      tag: forge.util.encode64(cipher.mode.tag.getBytes()),
    };

    return encryptedData;
  } catch (error) {
    console.error("[Encrypt] Error:", (error as any).message);
    throw error;
  }
}

function decrypt(encryptedData: EncryptedData) {
  // Decrypt AES key using the RSA private key
  const aesKey = secure().privateKey.decrypt(encryptedData.aesKey, "RSA-OAEP", {
    md: forge.md.sha256.create(),
  });

  // Decrypt the data using AES
  const decipher = forge.cipher.createDecipher("AES-GCM", aesKey);
  decipher.start({
    iv: forge.util.decode64(encryptedData.iv),
    tag: forge.util.decode64(encryptedData.tag),
  });
  decipher.update(
    forge.util.createBuffer(forge.util.decode64(encryptedData.cipherText))
  );
  const success = decipher.finish();

  if (!success) {
    throw new Error("Decryption failed");
  }

  return JSON.parse(decipher.output.toString());
}

export { encrypt, decrypt };
