import { NextFunction, Request, Response } from "express";

export type NexuRequest = Request;
export type NexuResponse = Response;
export type NexuNext = NextFunction;
export type Method = "get" | "post" | "put" | "delete" | "patch";
