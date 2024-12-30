import fs from "fs";
import { logger } from "../logger.js";

export const folders = ["controller", "routes", "middleware", "model"];

export const createPath = async (folderName) => {
  try {
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName);
      //   logger.info(`- Folder created: ${folderName}`);
    }
  } catch (err) {
    logger.error(err);
  }
};

export const createFile = async (name, content) => {
  try {
    if (!fs.existsSync(name)) {
      fs.writeFileSync(name, content);
    }
  } catch (err) {
    logger.warning(err);
  }
};

// const createDir = (path) => {
//   const dir = path.join(path);

//   for (let i = 0; i < fileDir.length; i++) {}
// };
