export const mainFile = `import { app, sendContent, ErrorLogger } from "nexujs";

app.get('/', (req, res) => {
   res.send(sendContent); 
});

app.use(ErrorLogger);`;

export const gitignore = `# Node.js dependencies
/node_modules/
  
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
  
# Environment files
.env
  
# Build outputs
/dist/
/build/
/coverage/`;

export const tsconfigFile = `{
  "compilerOptions": {
    "target": "ESNext",
    "module": "CommonJS",
    "moduleResolution": "node",
    "lib": ["ESNext", "ES6"],
    "esModuleInterop": true,
    "strict": true,
    "noUnusedLocals": true,
    "outDir": "./dist",
  },
    "include": ["./**/*.ts"],
  "exclude": ["node_modules"]
}`;

export const helloRoute = `// All routes should be structured as follows
import { nexuRouter, sendMsg } from "nexujs";

const router = nexuRouter;

router.get("/", (req, res) => {
  // Try Changing this to \`res.json\`
  res.send("Hi 👋, Welcome to the Nexu.");
  console.log(sendMsg().log);
});

export default router;`;

export const nexuConfig = `import { defineConfig } from "nexujs";

export default defineConfig({
  port: 5000,
  keys: {
   public: String(process.env.NEXU_PUBLIC_KEY),
   private: String(process.env.NEXU_PRIVATE_KEY),
  },
});
`;

export const readmeFile = `# NexuJS Project

This is a **Nexu** project bootstrapped with [nexujs-cli]().

## Getting Started

First, run the development server:

\`\`\`bash
npm run dev
\`\`\`

The server will run on [http://localhost:5000](http://localhost:5000) by default.

You can modify the routes and API endpoints in the routes directory. The server will auto-reload when changes are made.

## Updating Dependencies

To keep your project up to date with the latest versions of its dependencies, run the following command:

\`\`\`bash
npm run update
\`\`\`

This will automatically update all dependencies to their latest versions.

## Changing Default Configuration

If you need to change the default configuration for your NexuJS project, you can do so by modifying the \`nexu.config\` file. This file allows you to customize various aspects of the project, such as port settings, middleware, routes, and more.

For more information on configuration options, refer to the [NexuJS Documentation](https://github.com/Kingrashy12/nexu/blob/main/packages/nexujs/README.md#configuration).

## Learn More

To learn more about Nexu and backend development, take a look at the following resources:

- [Nexu Documentation](https://github.com/Kingrashy12/nexu#readme) - Learn about Nexu features and API.`;
