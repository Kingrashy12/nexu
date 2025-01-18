import { AxiosResponse } from "axios";
import { decrypt, encrypt } from "./utils/encrypt";
import { EncryptedData, Keys } from "./types";

// Function to decrypt the response
const decryptResponse = (encryptedData: EncryptedData, key: Keys) => {
  const body = decrypt(encryptedData, key);
  return body;
};

export const encryptPayload = (data: unknown, key: Keys) => {
  const nexu = encrypt(data, key);
  return { nexu };
};

// Helper function to decrypt the response
const handleDecryptedResponse = <T = unknown>(
  response: AxiosResponse,
  key: Keys
): T => {
  // Check if the response contains an encrypted payload
  if (response.data && response.data.nexu) {
    return decryptResponse(response.data.nexu, key);
  }

  // If no encryption, return the raw data
  return response.data;
};

export default handleDecryptedResponse;
