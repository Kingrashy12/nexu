import { Config } from "../types";

const defineConfig = (config: Config) => {
  return config;
};

export default defineConfig;

// Custom CSP header configuration for helment
export const cspConfig = {
  directives: {
    defaultSrc: ["'self'"], // Default source for content
    scriptSrc: ["'self'", "'unsafe-inline'"], // Allow inline scripts and self
    styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles and self
    connectSrc: ["'self'"], // Restrict AJAX requests to the same origin
    fontSrc: ["'self'", "https://fonts.gstatic.com"], // Allow fonts from Google Fonts
    objectSrc: ["'none'"], // Disallow Flash, etc.
    childSrc: ["'none'"], // Disallow opening new frames
    formAction: ["'self'"], // Allow forms to be submitted only to the same origin
    frameAncestors: ["'none'"], // Disallow embedding the site in frames
    upgradeInsecureRequests: [], // Upgrade HTTP to HTTPS
  },
};
