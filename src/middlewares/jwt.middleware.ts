import { JWT_PUBLIC_KEY_PATH, SECRET_KEY } from '@/config';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import { logger } from '@/utils/logger';

let pubKey: Buffer;
try {
  pubKey = fs.readFileSync(JWT_PUBLIC_KEY_PATH);
} catch (e) {
  logger.error(e);
}

export const jwtMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
    jwt.verify(req.headers.authorization.split(' ')[1], pubKey, function (err, decode: any) {
      if (err || decode.id !== SECRET_KEY) {
        res.status(500).send({
          message: err,
        });
      } else {
        next();
      }
    });
  } else {
    res.status(200);
    res.end('authorization header is empty');
  }
};
