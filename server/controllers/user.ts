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

export type User = {
  id: number;
  createdAt: Date;
  email: string;
  password: string | null;
  name: string | null;
  status: string;
  lastVisit: Date;
};

type BatchPayload = {
  count: number;
};

export const getUsers = (_req: Request, res: Response, next: NextFunction) => {
  prisma.user
    .findMany()
    .then((users: Array<User>) => res.send({ users }))
    .catch(next);
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const userData = req.body.data;
  console.log(userData);
  bcryptjs.hash(userData.password, 10).then((hash) => {
    userData.password = hash;
    prisma.user
      .create({
        data: userData,
      })
      .then((user: User) => {
        const token = jwt.sign({ id: user.id }, process.env.JWT_KEY || '');
        res
          .cookie('jwt', token, {
            maxAge: 3600000,
            httpOnly: true,
          })
          .send({
            user: user,
          });
        console.log(res.cookie);
      })
      .catch((err: Error) => {
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
  const { ids, status } = req.body.data;
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
    .then((data: BatchPayload) => {
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
  console.log(req.body);
  const { ids } = req.body;
  prisma.user
    .deleteMany({
      where: {
        id: { in: ids },
      },
    })
    .then((data: BatchPayload) => {
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
  const { email, password } = req.body.data;

  prisma.user
    .findUnique({
      where: {
        email: email,
      },
    })
    .then((user: User | null) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Wrong email or password'));
      } else {
        if (user.password)
          return {
            matched: bcryptjs.compare(password, user.password),
            user: user,
          };
      }
    })
    .then((data: { matched: Promise<boolean>; user: User } | undefined) => {
      if (data) {
        const { matched, user } = data;
        if (!matched) {
          throw new UnauthorizedError('Wrong email or password');
        }
        if (user.status === 'blocked') {
          throw new ForbiddenError('User is blocked');
        }
        return user.id;
      }
    })
    .then((id: number | undefined) => {
      prisma.user
        .update({
          where: {
            id: id,
          },
          data: {
            lastVisit: new Date(Date.now()),
          },
        })
        .then((user: User) => {
          const token = jwt.sign({ id: id }, process.env.JWT_KEY || '');
          res
            .cookie('jwt', token, {
              maxAge: 3600000,
              httpOnly: true,
            })
            .send({
              user: user,
            });
        });
    })
    .catch((err: Error) => {
      next(err);
    });
};
