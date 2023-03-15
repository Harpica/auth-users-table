import prisma from '../bd/prisma';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime';
import { NextFunction, Request, Response } from 'express';
import BadRequestError from '../utils/errors/BadRequestError';
import DocumentNotFoundError from '../utils/errors/DocumentNotFoundError';
import UnauthorizedError from '../utils/errors/UnautorizedError';
import ForbiddenError from '../utils/errors/ForbiddenError';

export const getUsers = (_req: Request, res: Response, next: NextFunction) => {
  prisma.user
    .findMany()
    .then((users) => res.send({ data: users }))
    .catch(next);
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const userData = req.body;
  bcryptjs.hash(userData.password, 10).then((hash) => {
    userData.password = hash;
    prisma.user
      .create({
        data: userData,
      })
      .then((user) => {
        const token = jwt.sign({ id: user.id }, process.env.JWT_KEY || '');
        res.cookie('jwt', token, {
          maxAge: 3600000,
          httpOnly: true,
        });
        res.send({
          data: {
            user: user,
          },
        });
      })
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

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  prisma.user
    .findUnique({
      where: {
        email: email,
      },
    })
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Wrong email or password'));
      } else {
        if (user.password)
          return {
            matched: bcryptjs.compare(password, user.password),
            user: user,
          };
      }
    })
    .then((data) => {
      if (data) {
        const { matched, user } = data;
        if (!matched) {
          return Promise.reject(new Error('Wrong email or password'));
        }
        if (user.status === 'blocked') {
          next(new ForbiddenError('User is blocked'));
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_KEY || '');
        res
          .cookie('jwt', token, {
            maxAge: 3600000,
            httpOnly: true,
          })
          .end();
      }
    })
    .catch((_err) => {
      next(new UnauthorizedError());
    });
};
