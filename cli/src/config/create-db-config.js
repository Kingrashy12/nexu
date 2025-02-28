import { createFile } from "./file.js";
import { selected } from "./select.js";

export const createDBConfig = async (
  isTs,
  db,
  appName,
  public_key,
  private_key
) => {
  const isMongo = db === selected.db[1];
  const isPostgres = db === selected.db[0];
  const isNeon = db === selected.db[2];

  const path = `${appName}/config`;
  const envPath = `${appName}/.env`;

  let envContent = `NEXU_PUBLIC_KEY="${public_key}"
NEXU_PRIVATE_KEY="${private_key}"`;

  if (isPostgres) {
    switch (isTs) {
      case "yes":
        await createFile(
          `${path}/postgres-client.ts`,
          globalThis.boilerplates.typescripts.config["pg-config"]
        );
        break;
      case "no":
        await createFile(
          `${path}/postgres-client.js`,
          globalThis.boilerplates.javascripts.config["pg-config"]
        );
        break;
    }
    envContent += `

PG_USER=your_userName
PG_DB=your_database
PG_PASS=your_password
PG_HOST=localhost`;
    await createFile(envPath, envContent);
  } else if (isMongo) {
    switch (isTs) {
      case "yes":
        await createFile(
          `${path}/mongo-client.ts`,
          globalThis.boilerplates.typescripts.config["mongo-client"]
        );
        break;
      case "no":
        await createFile(
          `${path}/mongo-client.js`,
          globalThis.boilerplates.javascripts.config["mongo-client"]
        );
        break;
    }
    envContent += `

MONGO_URI=your_connection_string`;
    await createFile(envPath, envContent);
  } else if (isNeon) {
    switch (isTs) {
      case "yes":
        await createFile(
          `${path}/neon-client.ts`,
          globalThis.boilerplates.typescripts.config["neon-config"]
        );
        break;
      case "no":
        await createFile(
          `${path}/neon-client.js`,
          globalThis.boilerplates.javascripts.config["neon-config"]
        );

        break;
    }

    envContent += `
      
DATABASE_URL="your_database_url"`;

    await createFile(envPath, envContent);
  } else {
    await createFile(envPath, envContent);
  }
};
