import dotenv from "dotenv";

export const getKey = (): string => {
  const PROCESS = typeof process !== "undefined" && process.env;
  let public_key = "";
  let private_key = "";

  // Check for `import.meta.env` (used in Vite)
  if (typeof import.meta !== "undefined") {
    // @ts-ignore
    const vite_public = import.meta.env.VITE_NEXU_PUBLIC_KEY;
    // @ts-ignore
    const vite_private = import.meta.env.VITE_NEXU_PRIVATE_KEY;

    if (vite_public && vite_private) {
      public_key = vite_public;
      private_key = vite_private;
      return `${public_key}:${private_key}`;
    }
  }

  // Check for `process.env` (used in Node.js)
  if (PROCESS) {
    dotenv.config();
    const react_public = process.env.NEXU_PUBLIC_KEY;
    const react_private = process.env.NEXU_PRIVATE_KEY;

    const next_public = process.env.NEXT_PUBLIC_NEXU_PUBLIC_KEY;
    const next_private = process.env.NEXT_PUBLIC_NEXU_PRIVATE_KEY;

    // React keys
    if (react_public && react_private) {
      public_key = react_public;
      private_key = react_private;
      return `${public_key}:${private_key}`;
    }

    // Next.js keys
    if (next_public && next_private) {
      public_key = next_public;
      private_key = next_private;
      return `${public_key}:${private_key}`;
    }
  }

  // Throw an error if the keys are not found
  throw new Error(
    "Environment keys not found: Ensure that one of the following is defined:\n" +
      "- For React: NEXU_PUBLIC_KEY and NEXU_PRIVATE_KEY\n" +
      "- For Vite: VITE_NEXU_PUBLIC_KEY and VITE_NEXU_PRIVATE_KEY\n" +
      "- For Next.js: NEXT_PUBLIC_NEXU_PUBLIC_KEY and NEXT_PUBLIC_NEXU_PRIVATE_KEY"
  );
};
