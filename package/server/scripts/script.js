import { execSync } from "child_process";

// const start = () => {
//   try {
//     execSync("npm run start", { stdio: "inherit" });
//   } catch (error) {
//     console.error("Error executing command:", error.message);
//     process.exit(1);
//   }
// };

// const runDev = () => {
//   try {
//     execSync("npm run dev", { stdio: "inherit" });
//   } catch (error) {
//     console.error("Error executing command:", error.message);
//     process.exit(1);
//   }
// };

// const runDevTs = () => {
//   try {
//     execSync("npm run dev:ts", { stdio: "inherit" });
//   } catch (error) {
//     console.error("Error executing command:", error.message);
//     process.exit(1);
//   }
// };

const start = () => {
  try {
    // Directly execute the intended logic instead of calling "npm run start"
    execSync("nodemon dist/server.js", { stdio: "inherit" });
  } catch (error) {
    console.error("Error executing start command:", error.message);
    process.exit(1);
  }
};

const runDev = () => {
  try {
    execSync("nodemon server.js", { stdio: "inherit" });
  } catch (error) {
    console.error("Error executing dev command:", error.message);
    process.exit(1);
  }
};

const runDevTs = () => {
  try {
    execSync('concurrently "tsc --watch" "nodemon dist/server.js"', {
      stdio: "inherit",
    });
  } catch (error) {
    console.error("Error executing dev:ts command:", error.message);
    process.exit(1);
  }
};

export { runDev, runDevTs, start };
