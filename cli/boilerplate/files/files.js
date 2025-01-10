export const mainFile = `import { app } from "nexujs";

app.get('/', (req, res) => {
  res.send('Hello, world!');
});`;

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

export const nodemonFile = `{
  "execMap": {
    "ts": "ts-node"
  },
  "watch": ["./**/*.ts"],
  "ext": "ts"
}`;

export const tsconfigFile = `{
  "compilerOptions": {
    "target": "ESNext",
    "module": "CommonJS",
    "moduleResolution": "node",
    "lib": ["ESNext", "ES6"],
    "esModuleInterop": true,
    "strict": true,
    "noUnusedLocals": true,
    "noImplicitAny": true,
    "outDir": "./dist",
    "paths": {
      "@/*": ["./*"]
    }
  },
    "include": ["./**/*.ts"],
  "exclude": ["node_modules"]
}`;

export const helloRoute = `// All routes should be structured as follows
import { nexuRouter } from "nexujs";

const router = nexuRouter;

router.get("/", (req, res) => {
  // Try Changing this to \`res.json\`
  res.send("Hi 👋, Welcome to the Nexu API.");
});

export default router;`;

export const nexuConfig = `import { defineConfig } from "nexujs";

export default defineConfig({
  port: 5000,
  key: process.env.NEXU_KEY,
});
`;
