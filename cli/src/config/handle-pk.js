import { createPkgFile } from "./file-create.js";
import { changeAppName } from "./replace.js";
import { selected } from "./select.js";
import "../lib/global.js";

export const handlePackage = async (db, isTs, appName) => {
  const isPostgres = db === selected.db[0];
  const isMongo = db === selected.db[1];
  const isNeon = db === selected.db[2];

  if (isMongo) {
    switch (isTs) {
      case "yes":
        await createPkgFile(
          appName,
          changeAppName(
            appName,
            globalThis.boilerplates.typescripts["package-mongo"]
          )
        );
      case "no":
        await createPkgFile(
          appName,
          changeAppName(
            appName,
            globalThis.boilerplates.javascripts["package-mongo"]
          )
        );
    }
  } else if (isPostgres) {
    switch (isTs) {
      case "yes":
        await createPkgFile(
          appName,
          changeAppName(
            appName,
            globalThis.boilerplates.typescripts["package-pg"]
          )
        );
      case "no":
        await createPkgFile(
          appName,
          changeAppName(
            appName,
            globalThis.boilerplates.javascripts["package-pg"]
          )
        );
    }
  } else if (isNeon) {
    switch (isTs) {
      case "yes":
        await createPkgFile(
          appName,
          changeAppName(
            appName,
            globalThis.boilerplates.typescripts["package-neon"]
          )
        );
      case "no":
        await createPkgFile(
          appName,
          changeAppName(
            appName,
            globalThis.boilerplates.javascripts["package-neon"]
          )
        );
    }
  } else {
    switch (isTs) {
      case "yes":
        await createPkgFile(
          appName,
          changeAppName(appName, globalThis.boilerplates.typescripts.package)
        );
      case "no":
        await createPkgFile(
          appName,
          changeAppName(appName, globalThis.boilerplates.javascripts.package)
        );
    }
  }
};
