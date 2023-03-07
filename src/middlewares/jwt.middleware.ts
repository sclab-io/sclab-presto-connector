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
  if (req.headers && req.headers.authorization) {
    let key: string = req.headers.authorization;
    if (key.startsWith('JWT ')) {
      key = key.replace('JWT ', '');
    }
    jwt.verify(key, pubKey, function (err, decode: any) {
      if (err || decode.id !== SECRET_KEY) {
        res.status(400);
        res.end({
          message: 'The JWT token value is malformed. Please check the JWT token value and verify the key in the log.',
        });
      } else {
        next();
      }
    });
  } else {
    res.status(401);
    res.end('authorization header is empty');
  }
};
