# **Nexu**

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
  - [Configuration API](#configuration-api)
  - [Helmet Configuration](#helmet-configuration)
  - [Rate Limiting Configuration](#rate-limiting-configuration)
- [Experimental Features](#experimental-features)
  - [File-Based Routing](#file-based-routing)
    - [File structure](#file-structure)
- [Middleware](#middleware)
  - [useMiddleware](#usemiddleware)
- [Security](#security)
  - [Key Regeneration](#key-regeneration)
- [Related Packages](#related-packages)
- [License](#license)

**Nexu** is a scalable backend library built on top of Express.js, featuring encrypted requests, rate-limiting functionality

---

## Features

- **File-Based Routing (Experimental)**: Automatically registers routes based on the file structure when enabled, allowing for better organization and scalability.
- **Request and Response Encryption**: Ensures secure communication by automatically encrypting incoming requests and server responses using a shared secret key.
- **Customizable Configuration**: Use `nexu.config.js` to define app configurations like port, CORS settings, body parsers, and security headers.
- **Middleware Support**: Easily register multiple middleware functions with the `nexu.useMiddleware` method.
- **Security Headers**: Automatically applies security headers (like CSP and XSS filters) using Helmet for enhanced protection.
- **Rate Limiting**: Configure rate-limiting to control the number of requests per IP in a given time window, preventing abuse.

---

## Getting Started

To create a new **Nexu** project, all you need to do is run:

```bash
npx nexujs-cli create
```

On initialization, you'll see the following prompts:

```bash
What is your project name?
│  nexu-app
Would you like to use Typescript?
│  ● Yes (Recommended)
│  ○ No
Which database would you like to use?
│  ● MongoDB
│  ○ PostgreSQL
│  ○ Others
```

After the prompts, `nexujs-cli` will create a new Nexu project and install the required dependencies.

## Configuration

The `nexu.config.js` file allows you to customize various aspects of your application, including port settings, middleware, body parsers, and security headers.

Example `nexu.config.js`:

```js
import { defineConfig } from "nexujs";

export default defineConfig({
  port: 8080,
  keys: {
    public: process.env.NEXU_PUBLIC_KEY,
    private: process.env.NEXU_PRIVATE_KEY,
  },
  corsConfig: {
    origin: "yourorigin.com",
  },
  parserConfig: {
    json: {
      limit: "50mb",
    },
    url: {
      limit: "50mb",
      extended: true,
    },
  },
});
```

- **Port Configuration**: Set the server's port directly in the `nexu.config.js` file using the port property.
- **CORS Configuration**: Define custom CORS settings using `corsConfig`.
- **Body Parser Configuration**: Adjust the parser settings like request body size limits with `parserConfig`.

**Encryption Details**

- **Request Encryption**: Incoming requests are encrypted using a shared secret key defined in the key configuration.
- **Response Encryption**: Outgoing server responses are also encrypted with the same shared key, ensuring end-to-end secure communication.

> Important: The same `NEXU_PUBLIC_KEY` and `NEXU_PRIVATE_KEY` used in your backend `.env` file must also be used in your client's side
> file to enable seamless encryption and decryption of requests and responses.

For information on setting up the client-side encryption key, refer to the [nexujs-client README](../nexujs-client/README.md#set-key).

### Configuration API

The **Configuration API** allows you to define key settings for your Nexu application. Each property in the configuration file serves a specific purpose and can be customized based on your requirements.

```ts
{
  port: number;
  keys: {
    public: string;
    private: string;
  };
  corsConfig?: CorsOptions;
  parserConfig?: {
    json?: OptionsJson;
    url?: OptionsUrlencoded;
  };
  helmetOptions?: HelmetOptions;
  experimental?: {
    fileBasedRouting?: boolean;
    httpsKeyPaths?: {
    key: string;
    cert: string;
    };
  };
  rateLimit?: Options;
};
```

### Helmet Configuration

Nexu uses Helmet to automatically apply security headers such as Content Security Policy (CSP) and XSS filters. You can customize the Helmet configuration in your `nexu.config.js` file.

Example `nexu.config.js` with Helmet configuration:

```js
import { defineConfig } from "nexujs";

export default defineConfig({
  helmetOptions: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"] /* Restrict all content to the same origin */,
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://trusted-cdn.com",
        ] /* Allow inline scripts and trusted external sources */,
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://trusted-cdn.com",
        ] /* Allow inline styles and trusted external stylesheets */,
        fontSrc: [
          "'self'",
          "https://fonts.gstatic.com",
        ] /* Allow self and Google Fonts */,
        imgSrc: [
          "'self'",
          "data:",
          "https://trusted-image-cdn.com",
        ] /* Allow images from trusted sources and data URIs */,
        connectSrc: [
          "'self'",
          "https://api.example.com",
        ] /* Allow connections to trusted APIs */,
        objectSrc: ["'none'"] /* Prevent loading of Flash or other plugins */,
        frameAncestors: [
          "'none'",
        ] /* Prevent the site from being embedded in a frame (clickjacking protection) */,
        formAction: [
          "'self'",
        ] /* Only allow form submissions to the same origin */,
        upgradeInsecureRequests:
          [] /* Automatically upgrade HTTP requests to HTTPS */,
      },
    },
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    xssFilter: true,
  },
});
```

- **Content Security Policy (CSP)**: Define your CSP settings to restrict the sources from which your app can load content (scripts, styles, etc.).
- **XSS Filter**: Protect your app from cross-site scripting attacks with the xssFilter option.
- **Cross-Origin Policies**: Set `crossOriginEmbedderPolicy` and `crossOriginOpenerPolicy` for additional security.

### Rate Limiting Configuration

Nexu uses `express-rate-limit` to add rate-limiting feature, you can now configure the number of requests allowed per time window. Add the following to your `nexu.config.js`:

**Default Config**

```js
  windowMs: 15 * 60 * 1000,
  limit: 20,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
```

- `windowMs`: Time window in milliseconds (e.g., 15 minutes).
- `limit`: Maximum number of requests allowed during the windowMs period.
- `message`: The message to display when the rate limit is exceeded.
- `standardHeaders`: Whether to include standard rate-limit headers in the response.
- `legacyHeaders`: Whether to include legacy rate-limit headers.

## Experimental Features

### File-Based Routing

**File-Based Routing** is now an experimental feature in Nexu. You can enable it by setting the `experimental.fileBasedRouting` option in your `nexu.config.js` file.

This feature automatically registers routes based on your file structure. To add a new route, simply create a JavaScript or TypeScript file inside the routes directory, and Nexu will automatically register it.

#### Enabling File-Based Routing

```js
import { defineConfig } from "nexujs";

export default defineConfig({
  experimental: {
    fileBasedRouting: true,
  },
});
```

For example:

- Create a file at `routes/auth.js`.
- Add your route handler in the file.

#### File structure

```js
import { nexuRouter } from "nexujs";
import { loginController } from "./controllers/auth.js";

const router = nexuRouter;

router.post("/login", loginController);

export default router;
```

When this feature is enabled, Nexu will automatically map this route to `localhost:5000/auth`.

## Middleware

### useMiddleware

The `useMiddleware` method allows you to apply multiple middleware functions to your application in a single call. It accepts an array of functions, ensuring that each function is a valid middleware before applying it.

#### Example:

```ts
import { app, nexu, NexuMiddleware } from "nexujs";

const loggingMiddleware: NexuMiddleware = (req, res, next) => {
  console.log(`Request made to: ${req.url}`);
  next();
};

const authMiddleware: NexuMiddleware = (req, res, next) => {
  if (req.headers["authorization"]) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
};

nexu.useMiddleware([loggingMiddleware, authMiddleware]);

app.get("/", (req, res) => {
  res.send("Hello, world!");
  console.log("Hello world");
});
```

## Security

### Key Regeneration

For enhanced security, **it is recommended to regenerate your RSA keys periodically**. Over time, the security of keys may degrade, and renewing them ensures your application's encryption remains robust and secure.

**How to regenerate your keys**: You can easily regenerate your keys using the `rekey` command. This will create new key pairs that should be used for encryption and decryption processes in your project.

To regenerate your keys, run the following command:

```bash
npx nexujs-cli rekey
```

This process will replace the existing keys with freshly generated ones. Make sure to update your environment variables or configuration files with the new keys.

## Related Packages

- **[nexujs-client](https://www.npmjs.com/package/nexujs-client)**: A complementary package for frontend applications. It automatically decrypts server responses and integrates seamlessly with Nexu Server

## License

**[MIT](./LICENSE)**
