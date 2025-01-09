# **Nexu**

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [File-Based Routing](#file-based-routing)
  - [File structure](#file-structure)
- [Configuration](#configuration)
  - [Helmet Configuration](#helmet-configuration)
- [Related Packages](#related-packages)
- [License](#license)

**Nexu** is a lightweight and scalable backend library built on top of Express.js, featuring file-based routing, encrypted requests for seamless development of modern web applications.

---

## Features

- **File-Based Routing**: Automatically registers routes based on the file structure, allowing for better organization and scalability.
- **Request Encryption**: Automatically encrypts incoming requests and decrypts them seamlessly using a shared secret key.
- **Customizable Configuration**: Use `nexu.config.js` to define app configurations like port, CORS settings, and body parsers.
- **Simple to Use**: Easy setup and minimal configuration required to get started
- **Security Headers**: Automatically applies security headers (like CSP and XSS filters) using Helmet for enhanced protection.

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

## File-Based Routing

**Nexu** automatically registers routes based on your file structure. To add a new route, simply create a JavaScript or TypeScript file inside the routes directory, and Nexu will automatically register it.

For example:

- Create a file at `routes/auth.js`.
- Add your route handler in the file.

### File structure

```js
import { nexuRouter } from "nexujs";
import { loginController } from "./controllers/auth.js";

const router = nexuRouter;

router.post("/login", loginController);

export default router;
```

Nexu will automatically map this to `localhost:5000/auth`

## Configuration

You can customize various aspects of **Nexu** to fit your needs using the `nexu.config.js` file. This configuration file provides more flexibility and centralization for app-specific settings.

Example `nexu.config.js`:

```js
import { defineConfig } from "nexujs";

export default defineConfig({
  port: 8080,
  key: process.env.NEXU_KEY,
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

> **Note**: When adding comments inside the `nexu.config.js` file, always use block comments (`/* */`) instead of line comments (`//`). This is crucial because using line comments (`//`) in some configurations can cause file truncation or parsing issues, where parts of the file may be ignored or cut off entirely.

## Related Packages

- **[nexujs-client](https://www.npmjs.com/package/nexujs-client)**: A complementary package for frontend applications. It automatically decrypts server responses and integrates seamlessly with Nexu

Example Usage:

```js
import { Post } from "nexujs-client";

Post("/auth/login", { email: "john@gmail.com", password: "securepassword" })
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.error(error);
  });
```

## License

**[MIT](./LICENSE)**
