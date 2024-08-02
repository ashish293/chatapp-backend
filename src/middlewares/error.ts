import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
  statusCode?: number;
}

const errorMiddleware = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  res.status(err.statusCode).json({
    success: false,
    message: err.message
  });
};

export default errorMiddleware;

type TryCatchType = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => (req: Request, res: Response, next: NextFunction) => Promise<any>;

const TryCatch: TryCatchType = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next)
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export { errorMiddleware, TryCatch };