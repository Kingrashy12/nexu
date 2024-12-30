# **Nexu**

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [File-Based Routing](#file-based-routing)
  - [File structure](#file-structure)
- [Configuration](#configuration)
- [License](#license)

**Nexu** is a lightweight and scalable backend library built on top of Express.js, featuring file-based routing and addon support for seamless development of modern web applications.

---

## Features

- **File-Based Routing**: Automatically registers routes based on the file structure, allowing for better organization and scalability.
- **Simple to Use**: Easy setup and minimal configuration required to get started.
- **Full Express Support**: Built on top of Express, so you have access to the full power of Express.js for building web applications.

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

You can customize various aspects of **Nexu** to fit your needs. Here are a few key areas:

- **Addon support**: You can add custom routing paths through the `addon()` method.

Example:

```js
// server.js
import { app, nexu } from "nexujs";

nexu.addon("api");
```

This will modify the route paths to prefix them with `/api`, which will make this `localhost:5000/api/auth/login`

- **Changing Port**: To change the default port, add a `PORT` variable to your `.env` file.

Example `.env` file:

```bash
PORT=7000
```

## License

**[MIT](./LICENSE)**
