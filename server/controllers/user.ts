import { PrismaClient } from '@prisma/client';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime';
import { NextFunction, Request, Response } from 'express';
import BadRequestError from '../utils/errors/BadRequestError';
import DocumentNotFoundError from '../utils/errors/DocumentNotFoundError';

const prisma = new PrismaClient();

export const getUsers = (_req: Request, res: Response, next: NextFunction) => {
  prisma.user
    .findMany()
    .then((users) => res.send({ data: users }))
    .catch(next);
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const userData = req.body;
  prisma.user
    .create({
      data: userData,
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (
        err instanceof PrismaClientValidationError ||
        err instanceof PrismaClientKnownRequestError
      ) {
        next(
          new BadRequestError('Given data for new user creation is incorrect')
        );
        return;
      }
      next(err);
    });
};

export const updateUsersStatus = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { ids, status } = req.body;
  if (ids === undefined || status === undefined) {
    throw new BadRequestError('Given data for user status update is incorrect');
  }
  prisma.user
    .updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        status: status,
      },
    })
    .then((data) => {
      if (data.count !== 0) {
        res.send('updated');
      } else {
        throw new DocumentNotFoundError(
          'User/s with current _id/s is/are not found'
        );
      }
    })
    .catch(next);
};

export const deleteUsers = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { ids } = req.body;
  prisma.user
    .deleteMany({
      where: {
        id: { in: ids },
      },
    })
    .then((data) => {
      if (data.count !== 0) {
        res.send('updated');
      } else {
        throw new DocumentNotFoundError(
          'User/s with current _id/s is/are not found'
        );
      }
    })
    .catch(next);
};
