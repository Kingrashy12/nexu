# NexuJS-Client

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Getting Started](#getting-started)
  - [Setup Client](#setup-client)
  - [Set Key](#set-key)
  - [Example Usage](#example-usage)
- [Methods](#methods)
  - [Post](#posturl-data-config)
  - [Get](#geturl-config)
  - [Put](#puturl-data-config)
  - [Patch](#patchurl-data-config)
  - [Delete](#deleteurl-config)
  - [createApiClient](#createapiclient)
- [License](#license)

---

## Introduction

**NexuJS-Client** is a lightweight and secure HTTP client library designed to work seamlessly with the Nexu backend library. It handles encrypted communication between the frontend and backend, ensuring your data remains secure.

---

## Features

- **Built-in Encryption/Decryption**: Automatically encrypts requests and decrypts responses to ensure secure communication.
- **Extended Axios Methods**: Provides `get`, `post`, `put`, `delete`, and `patch` methods, extended with built-in encryption.
- **Lightweight and Easy to Use**: A simple API to integrate secure communication in your frontend applications.
- **Customizable Axios Interceptors**: Supports configuring request and response interceptors using `createApiClient`.

---

## Installation

Install NexuJS-Client using npm:

```bash
npm install nexujs-client
```

## Getting Started

To get started, ensure you have set up the `nexu.client` configuration in your project.

### Setup Client

Run the following command to generate a basic `nexu.client` configuration file:

```bash
npx md-config
```

This will create a `constants/nexu.client.js` file in your project directory.

### Example `nexu.client.js`

```js
import { NexuClient } from "nexujs-client";

const publicKey = String("your_publicKey");
const privateKey = String("your_privateKey");

const client = new NexuClient({
  privateKey,
  publicKey,
});

export default client;
```

### Set Key

To ensure secure communication, use the same encryption keys that were set during the NexuJS server setup. These keys should be stored in environment variables (`.env`) for security.

```env
PUBLIC_KEY=your_public_key
PRIVATE_KEY=your_private_key
```

### Example Usage:

Here’s an example of using the Post method for making a login request:

```js
import client from "../constants/nexu.client";

const login = async () => {
  try {
    const response = await client.Post({
      url: "http://localhost:8000/auth/login",
      data: {
        email: "user@example.com",
        password: "password123",
      },
    });

    console.log(response);
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

### createApiClient

The `createApiClient` function is a utility for setting up Axios interceptors. It allows you to add custom request and response interceptors to handle encryption and decryption automatically.

#### Example

```js
import { NexuClient } from "nexujs-client";

const publicKey = String("your_publicKey");
const privateKey = String("your_privateKey");

const client = new NexuClient({
  privateKey,
  publicKey,
});

const apiClient = client.createApiClient({
  baseURL: "http://localhost:8000",
  onRequest: (config) => {
    console.log("Request Interceptor:", config);
    return config;
  },
  onResponse: (response) => {
    console.log("Response Interceptor:", response);
    return response;
  },
  onResponseError(error) {
    console.log("Something went wrong", error.message);
  },
});

export default apiClient;

const fetchUsers = async () => {
  const users = await apiClient.Get({ url: "/users" });
  console.log(users);
};
```

## License

**[MIT](./LICENSE)**
