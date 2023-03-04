import { Router } from 'express';
import { QueryItem } from '../config/index';

export interface Routes {
  path?: string;
  router: Router;
}
