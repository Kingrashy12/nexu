export const mainFile = `import bodyParser from 'body-parser';
import { app } from "nexujs";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
    "module": "ESNext",
    "target": "ESNext",
    "moduleResolution": "node",
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
  res.send("Hi 👋, Welcome to the Nexu Express API.");
});

export default router;`;
