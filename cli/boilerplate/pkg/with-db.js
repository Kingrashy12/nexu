export const getPkgWithDB = (appName) => {
  const mongoMain = `{
  "name": "${appName}",
  "version": "1.0.0",
  "description": "This project was bootstrapped with NexuJs-CLI.",
  "main": "server.js",
  "type": "module",
  "private": "true",
  "scripts": {
    "start": "nexujs start",
    "dev": "nexujs dev",
    "update": "nexujs-cli update-deps"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "mongoose": "^8.8.1",
    "nexujs": "^0.1.1"
  },
  "devDependencies": {
    "nodemon": "^3.1.9"
  }
}`;

  const mongoTs = `{
  "name": "${appName}",
  "version": "1.0.0",
  "description": "This project was bootstrapped with NexuJs-CLI.",
  "main": "server.ts",
  "private": "true",
  "scripts": {
    "build": "tsc",
    "start": "nexujs start:ts",
    "dev": "nexujs dev:ts",
    "serve": "tsc && node dist/server.js",
    "update": "nexujs-cli update-deps"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "mongoose": "^8.8.1",
    "nexujs": "^0.1.1"
  },
  "devDependencies": {
    "ts-node": "^10.9.2",
    "tsc-watch": "^6.2.1",
    "typescript": "^5.4.5",
    "@types/cors": "^2.8.17",
    "@types/node": "^22.10.7",
    "@types/express": "^4.17.21"
    }
  }`;

  // Postgres
  const pgMain = `{
  "name": "${appName}",
  "version": "1.0.0",
  "description": "This project was bootstrapped with NexuJs-CLI.",
  "main": "server.js",
  "type": "module",
  "private": "true",
  "scripts": {
    "start": "nexujs start",
    "dev": "nexujs dev",
    "update": "nexujs-cli update-deps"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "nexujs": "^0.1.1",
    "pg": "^8.13.1"
  },
  "devDependencies": {
    "nodemon": "^3.1.9"
  }
}`;

  const pgTs = `{
  "name": "${appName}",
  "version": "1.0.0",
  "description": "This project was bootstrapped with NexuJs-CLI.",
  "main": "server.ts",
  "private": "true",
  "scripts": {
    "build": "tsc",
    "start": "nexujs start:ts",
    "dev": "nexujs dev:ts",
    "serve": "tsc && node dist/server.js",
    "update": "nexujs-cli update-deps"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "nexujs": "^0.1.1",
    "pg": "^8.13.1"
  },
    "devDependencies": {
    "ts-node": "^10.9.2",
    "tsc-watch": "^6.2.1",
    "typescript": "^5.4.5",
    "@types/cors": "^2.8.17",
    "@types/node": "^22.10.7",
    "@types/express": "^4.17.21",
    "@types/pg":"^8.11.10"
  }
}`;

  return { mongoMain, mongoTs, pgMain, pgTs };
};
