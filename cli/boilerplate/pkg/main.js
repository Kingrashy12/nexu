export const getPkg = (appName) => {
  const js = `{
 "name": "${appName}",
 "version": "1.0.0",
 "main": "server.js",
 "type": "module",
 "private": "true",
 "scripts": {
 "start": "npx nodemon server.js"
 },
 "keywords": [],
 "author": "",
 "license": "ISC",
 "dependencies": {
  "body-parser": "^1.20.2",
  "cors": "^2.8.5",
  "dotenv": "^16.4.5",
  "express": "^4.21.1",
  "nexujs: "^0.1.1",
 },
 "devDependencies": {
  "nodemon": "^3.1.9"
 }
}`;

  const ts = `{
  "name": "${appName}",
  "version": "1.0.0",
  "main": "server.ts",
  "type": "module",
  "private": "true",
  "scripts": {
    "build": "tsc",
    "start": "npx nodemon server.ts",
    "serve": "tsc && node dist/server.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "body-parser": "^1.20.2",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.21.1",
    "nexujs: "^0.1.1",
  },
  "devDependencies": {
    "nodemon": "^3.1.9",
    "ts-node": "^10.9.2",
    "typescript": "^5.4.5",
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21"
  }
}`;

  return { js, ts };
};
