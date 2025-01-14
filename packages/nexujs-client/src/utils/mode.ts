// @ts-nocheck
export const getMode = () => {
  // Check if we're in a Node.js environment
  const PROCESS = typeof process !== "undefined" && process.env;

  // Check if we're in a Vite environment
  const VITE = typeof import.meta !== "undefined" && import.meta.env;

  let mode = "";

  // In Node.js, check the NODE_ENV variable
  if (PROCESS && process.env.NODE_ENV) {
    mode = process.env.NODE_ENV;
  }

  // In Vite, check the mode from import.meta.env.MODE
  else if (VITE && import.meta.env.MODE) {
    mode = import.meta.env.MODE;
  }

  return mode;
};
