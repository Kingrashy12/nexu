// import { NexuHandler } from "../types";

// const watchResError: NexuHandler = (req, res, next) => {
//   // List of error codes to monitor
//   const errorCode = [
//     "400",
//     "401",
//     "402",
//     "403",
//     "404",
//     "405",
//     "406",
//     "408",
//     "500",
//     "502",
//     "503",
//     "504",
//   ];

//   // Store the original `status` method
//   const originalStatus = res.status.bind(res);

//   // Override the `status` method
//   res.status = function (code: number) {
//     if (errorCode.includes(String(code))) {
//       res.setHeader("nexu-error-log", "clean");
//     }

//     // Call the original `status` method for chaining
//     return originalStatus(code);
//   };

//   // Call the next middleware in the chain
//   next();
// };

// export default watchResError;

import { NexuHandler } from "../types";

const watchResError: NexuHandler = (req, res, next) => {
  const errorCode = [
    "400",
    "401",
    "402",
    "403",
    "404",
    "405",
    "406",
    "408",
    "500",
    "502",
    "503",
    "504",
  ];

  // Store the original status method
  const originalStatus = res.status.bind(res);

  // Override the status method
  res.status = function (code: number) {
    if (errorCode.includes(String(code))) {
      res.setHeader("nexu-log", "error");
    }
    return originalStatus(code);
  };

  next();
};

export default watchResError;
