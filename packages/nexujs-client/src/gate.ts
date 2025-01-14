import { AxiosResponse } from "axios";
import { decrypt, encrypt } from "./utils/encrypt";

// Function to decrypt the response
const decryptResponse = (encryptedData: string) => {
  const body = decrypt(encryptedData);
  return body;
};

export const encryptPayload = (data: unknown) => {
  const nexu = encrypt(data);
  return { nexu };
};

// Helper function to decrypt the response
const handleDecryptedResponse = <T = unknown>(response: AxiosResponse): T => {
  // Check if the response contains an encrypted payload
  if (response.data && response.data.nexu) {
    return decryptResponse(response.data.nexu);
  }

  // If no encryption, return the raw data
  return response.data;
};

export default handleDecryptedResponse;
