# **NexuJs CLI**

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [CLI Command](#cli-command)
  - [init](#init)
  - [update-deps](#update-deps)
  <!-- - [rekey](#rekey) -->
- [License](#license)

The **NexuJs CLI** is a command-line tool designed to help you quickly scaffold new NexuJs projects, and manage dependencies for NexuJs-based applications.

---

## Features

- **Project Scaffolding**: Easily create a new NexuJs project with a single command.
- **Update Dependencies**: Keep your scaffolded projects up-to-date with the latest versions of all dependencies.
- **Fast Setup**: Quickly set up your project environment and get started with development.

---

## Installation

To use the **NexuJs CLI**, install it globally via npm:

```bash
npm install -g nexujs-cli
```

Alternatively, you can use the CLI without installing it globally by running the `npx` command:

```bash
npx nexujs-cli <command>
```

## CLI Command

### `init`

Scaffold a new NexuJs project.

```bash
npx nexujs-cli init
```

### `update-deps`

Update all dependencies in your scaffolded NexuJs project to their latest versions.

```bash
npx nexujs-cli update-deps
```

<!-- ### `rekey`

Generate a new RSA keys with length options

**Warning**: Before regenerating a new key, **make sure to decrypt your old data** using the old key. Failure to do so may result in losing access to your encrypted data.

```bash
npx nexujs-cli rekey
``` -->

## License

**[MIT](./LICENSE)**
