# **Nexu**

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [File-Based Routing](#file-based-routing)
  - [File structure](#file-structure)
- [Configuration](#configuration)
- [Related Packages](#related-packages)
- [License](#license)

**Nexu** is a lightweight and scalable backend library built on top of Express.js, featuring file-based routing, encrypted requests for seamless development of modern web applications.

---

## Features

- **File-Based Routing**: Automatically registers routes based on the file structure, allowing for better organization and scalability.
- **Request Encryption**: Automatically encrypts incoming requests and decrypts them seamlessly using a shared secret key.
- **Customizable Configuration**: Use `nexu.config.js` to define app configurations like port, CORS settings, and body parsers.
- **Simple to Use**: Easy setup and minimal configuration required to get started

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
