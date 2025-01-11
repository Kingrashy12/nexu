import { Router } from "express";
import { NexuHandler } from "../types";
import { nexuRouter } from "../app/app";

/**
 * Defines a route middleware for the Nexu application.
 *
 * @param {string} path - The base path for the route (e.g., "/api").
 * @param {Router} file - The Nexu Router instance containing the route definitions.
 * @returns {NexuHandler} - A middleware function that integrates the given router under the specified path.
 *
 * @example
 * import { nexuRouter, nexu } from "nexujs";
 * const apiRouter = nexuRouter;
 * apiRouter.get("/hello", (req, res) => res.send("Hello, World!"));
 *
 * const apiRoute = defineRoute("/api", apiRouter);
 * nexu.useMiddleware([apiRoute]);
 */
const defineRoute = (path: string, file: Router): NexuHandler => {
  return (req, res, next) => {
    const router = nexuRouter;
    router.use(path, file);
    router(req, res, next);
  };
};

export { defineRoute };
