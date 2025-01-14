import { getKey } from "./key";
import forge from "node-forge";

export const secure = () => {
  const [public_key, private_key] = getKey().split(":");

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
