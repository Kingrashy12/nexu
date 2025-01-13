import NodeRSA from "node-rsa";
import { readConfig } from "../utils/config";

export const secure = () => {
  const Config = readConfig();
  const public_key = String(Config?.keys.public);
  const private_key = String(Config?.keys.private);

  if (!private_key || !public_key) {
    throw new Error("Keys are not set. Please set them using nexu.config");
  }

  const private_ = new NodeRSA(private_key);
  const public_ = new NodeRSA(public_key);

  return {
    private_,
    public_,
  };
};

const encrypt = (data: any) => {
  return secure().public_.encrypt(data, "base64");
};

const decrypt = (data: string) => {
  return secure().private_.decrypt(data, "utf8");
};

export { encrypt, decrypt };
