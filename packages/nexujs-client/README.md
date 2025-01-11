# NexuJS-Client

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Getting Started](#getting-started)
  - [Example Configuration](#example-configuration-nexujsconfigjs)
  - [Set Key](#set-key)
  - [Example Usage](#example-usage)
- [Methods](#methods)
- [License](#license)

**NexuJS-Client** is a lightweight and secure HTTP client library designed to work seamlessly with the Nexu backend library. It handles encrypted communication between the frontend and backend, ensuring your data remains secure.

## Features

- **Built-in Encryption/Decryption**: Automatically encrypts requests and decrypts responses to ensure secure communication.
- **Extended Axios Methods**: Provides `get`, `post`, `put`, `delete`, and `patch` methods, extended with built-in encryption.
- **Lightweight and Easy to Use**: A simple API to integrate secure communication in your frontend applications.

## Installation

To install NexuJS-Client, use the following command:

```bash
npm install nexujs-client
```

## Getting Started

First, ensure you have set up the `nexujs` backend library and a shared secret key in `nexujs.config.js`.

### Example Configuration (`nexujs.config.js`):

```js
export default defineConfig({
  key: process.env.NEXU_KEY,
});
```

### Set Key

To ensure secure communication between your frontend and backend, you must use the same key defined during your NexuJS server setup. This key should be stored in the `.env` file of your project based on the framework you are using.

Add the following key to your `.env` file:

- **For Vite**: `VITE_NEXU_KEY`

- **For React**: `NEXU_KEY`

- **For Next.js**: `NEXT_PUBLIC_NEXU_KEY`

This ensures that both the client and server share the same encryption key for secure communication.

### Example Usage:

```js
import { Post } from "nexujs-client";

const login = async () => {
  try {
    const response = await Post("http://localhost:8000/auth/login", {
      email: "user@example.com",
      password: "password123",
    });

    console.log("Decrypted Response:", response);
  } catch (error) {
    console.error("Error:", error);
  }
};
```

## Methods

### Post(url, data, config)

- **url**: The endpoint to which the request will be sent.
- **data**: The request body (object).
- **config**: Optional Axios configuration object.

### Get(url, config)

- **url**: The endpoint to which the request will be sent.
- **data**: The request body (object).

### Put(url, data, config)

- **url**: The endpoint to which the request will be sent.
- **data**: The request body (object).
- **config**: Optional Axios configuration object.

### Patch(url, data, config)

- **url**: The endpoint to which the request will be sent.
- **data**: The request body (object).
- **config**: Optional Axios configuration object.

## License

**[MIT](./LICENSE)**
