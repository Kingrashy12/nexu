import NodeRSA from "node-rsa";
import { parentPort } from "worker_threads";

parentPort.on("message", (bits) => {
  try {
    const key = new NodeRSA({ b: Number(bits) });
    const publicKey = key.exportKey("public");
    const privateKey = key.exportKey("private");

    parentPort.postMessage({ publicKey, privateKey });
  } catch (error) {
    parentPort.postMessage({ error: error.message });
  }
});
