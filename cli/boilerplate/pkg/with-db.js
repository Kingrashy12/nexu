export const getPkgWithDB = (appName) => {
  // TODO: Add turbo-express
  const mongoMain = `{
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
      "mongoose": "^8.8.1"
    },
    "devDependencies": {
      "nodemon": "^3.1.9"
    }
  }`;

  const mongoTs = `{
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
      "mongoose": "^8.8.1"
    },
    "devDependencies": {
      "nodemon": "^3.1.9",
      "ts-node": "^10.9.2",
      "typescript": "^5.4.5",
      "@types/cors": "^2.8.17",
      "@types/express": "^4.17.21"
    }
  }`;

  // Postgres
  const pgMain = `{
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
      "pg": "^8.13.1"
    },
    "devDependencies": {
      "nodemon": "^3.1.9"
    }
  }`;

  const pgTs = `{
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
      "mongoose": "^8.8.1",
      "pg": "^8.13.1"
    },
    "devDependencies": {
      "nodemon": "^3.1.9",
      "ts-node": "^10.9.2",
      "typescript": "^5.4.5",
      "@types/cors": "^2.8.17",
      "@types/express": "^4.17.21",
      "@types/pg":"^8.11.10"
    }
  }`;

  return { mongoMain, mongoTs, pgMain, pgTs };
};
