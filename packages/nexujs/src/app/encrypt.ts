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

function encrypt(data: unknown) {
  const jsonString = JSON.stringify(data);
  const encrypted = secure().publicKey.encrypt(jsonString, "RSA-OAEP", {
    md: forge.md.sha256.create(),
  });
  return forge.util.encode64(encrypted);
}

function decrypt(encryptedData: string) {
  const encryptedBytes = forge.util.decode64(encryptedData);
  const decrypted = secure().privateKey.decrypt(encryptedBytes, "RSA-OAEP", {
    md: forge.md.sha256.create(),
  });
  return JSON.parse(decrypted);
}

export { encrypt, decrypt };
