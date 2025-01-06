export const getPkg = (appName) => {
  const js = `{
 "name": "${appName}",
 "version": "1.0.0",
 "description": "This project was bootstrapped with NexuJs-CLI.",
 "main": "server.js",
 "type": "module",
 "private": "true",
 "scripts": {
  "start": "nexujs start",
  "dev": "nexujs dev"
 },
 "keywords": [],
 "author": "", 
 "license": "ISC",
 "dependencies": {
  "body-parser": "^1.20.2",
  "express": "^4.21.1",
  "nexujs": "^0.1.1"
 },
 "devDependencies": {
  "nodemon": "^3.1.9"
 }
}`;

  const ts = `{
  "name": "${appName}",
  "version": "1.0.0",
  "description": "This project was bootstrapped with NexuJs-CLI.",
  "main": "server.ts",
  "type": "module",
  "private": "true",
  "scripts": {
  "build": "tsc",
  "start": "nexujs start",
  "dev": "nexujs dev:ts",
  "serve": "tsc && node dist/server.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "body-parser": "^1.20.2",
    "express": "^4.21.1",
    "nexujs": "^0.1.1"
  },
  "devDependencies": {
    "nodemon": "^3.1.9",
    "ts-node": "^10.9.2",
    "typescript": "^5.4.5",
    "@types/express": "^4.17.21"
  }
}`;

  return { js, ts };
};
