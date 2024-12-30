export const mainFile = `import cors from 'cors';
import bodyParser from 'body-parser';
import { turbo, app } from "turbo-express";

app.use(cors());
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
  }
}`;

export const tsconfigFile = `{
  "compilerOptions": {
    "module": "ESNext",
    "target": "ESNext",
    "moduleResolution": "node",
    "declaration": true,
    "declarationMap": true,
    "esModuleInterop": true,
    "strict": true,
    "noUnusedLocals": true,
    "noImplicitAny": true,
    "noUnusedParameters": true,
    "paths": {
      "@/*": ["./*"]
    }
 },
  "include": ["./**/*.ts"]
}`;

export const helloRoute = `// All routes should be structured as follows
import { appRouter } from "turbo-express";

const router = appRouter;

router.get("/", (req, res) => {
  res.send("Hi 👋, Welcome to the Turbo Express API.");
});

export default router;`;
