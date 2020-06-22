import { Request, Response, NextFunction } from 'express';

import { isUuid } from 'uuidv4';

import AppError from '../errors/AppError';

export default function ValidateTransactionId(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const { id } = request.params;

  if (!isUuid(id)) throw new AppError('ID is not valid.');

  return next();
}
