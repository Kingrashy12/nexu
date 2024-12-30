# **Turbo-Express CLI**

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [CLI Command](#cli-command)
  - [`init`](#init)
  - [`update-deps`](#update-deps)
- [License](#license)

The **Turbo-Express CLI** is a command-line tool designed to help you quickly scaffold new Turbo-Express projects, and manage dependencies for Turbo-Express-based applications.

---

## Features

- **Project Scaffolding**: Easily create a new Turbo-Express project with a single command.
- **Update Dependencies**: Keep your scaffolded projects up-to-date with the latest versions of all dependencies.
- **Fast Setup**: Quickly set up your project environment and get started with development.

---

## Installation

To use the **Turbo-Express CLI**, install it globally via npm:

```bash
npm install -g turbo-express-cli
```

Alternatively, you can use the CLI without installing it globally by running the `npx` command:

```bash
npx turbo-express-cli <command>
```

## CLI Command

### `init`

Scaffold a new Turbo-Express project.

```bash
npx turbo-express-cli init
```

### `update-deps`

Update all dependencies in your scaffolded Turbo-Express project to their latest versions.

```bash
npx turbo-express-cli update-deps
```

## License

**[MIT](./LICENSE)**
