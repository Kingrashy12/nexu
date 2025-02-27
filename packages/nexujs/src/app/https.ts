import https from "https";
import http from "http";
import { Application } from "express";
import { logger } from "./logger";
import { existsSync, readFileSync } from "fs";
import { join } from "path";

const fetchKeyPath = (key: string, cert: string) => {
  const keyPath = join(process.cwd(), key);
  const certPath = join(process.cwd(), cert);

  if (existsSync(keyPath) && existsSync(certPath)) {
    const httpsOptions = {
      key: readFileSync(keyPath),
      cert: readFileSync(certPath),
    };

    return httpsOptions;
  } else {
    logger.error(`SSL/TLS key or certificate file missing. 
    Key: ${keyPath} 
    Cert: ${certPath}`);
    return undefined;
  }
};

export const StartHttps = (
  app: Application,
  key: string,
  cert: string,
  port: number
) => {
  const httpServer = http.createServer((req, res) => {
    app(req, res);
  });

  // A middleware to redirect HTTP to HTTPS before passing to Express
  httpServer.on("request", (req, res) => {
    if (req.headers["x-forwarded-proto"] !== "https") {
      res.writeHead(301, {
        Location: `https://${req.headers.host}${req.url}`,
      });
      res.end();
    } else {
      app(req, res);
    }
  });

  httpServer.listen(80, () => {
    if (!serverLog?.hasStartServer) {
      console.log("HTTP server running on http://localhost:80");
    }
  });

  // Start HTTPS server with SSL/TLS
  const httpsOptions = fetchKeyPath(key, cert);

  if (httpsOptions) {
    const httpsServer = https.createServer(httpsOptions, app);
    const serverPort = port;
    httpsServer.listen(serverPort, () => {
      logger.success(`HTTPS server running on https://localhost:${serverPort}`);
    });
  } else {
    logger.error(
      "Failed to start HTTPS server due to missing key/certificate."
    );
  }
};
