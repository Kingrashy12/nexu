import nexuClient from "./plain";

export const {
  post: Post,
  patch: Patch,
  get: Get,
  put: Put,
  delete: Delete,
} = nexuClient;
export { default as createApiClient } from "./interceptor";
