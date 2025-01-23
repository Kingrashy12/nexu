import { NexuHandler } from "../types";

const watchResError: NexuHandler = (req, res, next) => {
  const errorCode = [
    400, 401, 402, 403, 404, 405, 406, 408, 500, 502, 503, 504,
  ];

  const originalStatus = res.status.bind(res);

  res.status = function (code: number) {
    if (errorCode.includes(code)) {
      res.setHeader("nexu-log", "error");
    }
    return originalStatus(code);
  };

  const originalEnd = res.end.bind(res);
  res.end = function (...args: any[]) {
    if (errorCode.includes(res.statusCode)) {
      res.setHeader("nexu-log", "error");
    }
    return originalEnd(...args);
  };

  next();
};

export default watchResError;
