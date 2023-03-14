import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../bd/prisma';
import ForbiddenError from '../utils/errors/ForbiddenError';
import UnauthorizedError from '../utils/errors/UnautorizedError';

interface JwtPayload {
  id: string;
}

export const auth = (req: Request, _res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError());
  } else {
    const token = authorization.replace('Bearer ', '');
    let payload: string | jwt.JwtPayload;
    try {
      payload = jwt.verify(token, process.env.JWT_KEY || '') as JwtPayload;
      console.log(payload);
      prisma.user
        .findUnique({
          where: {
            id: payload.id,
          },
        })
        .then((user) => {
          if (user?.status === 'blocked') {
            next(new ForbiddenError('User is blocked'));
          }
        });
    } catch (err) {
      next(new UnauthorizedError());
    }
    next();
  }
};
