import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import APIController from '@/controllers/api.controller';
import { QueryItem } from '@/config';

class APIRoute implements Routes {
  public path?: string;
  public router = Router();
  public apiController = new APIController();

  constructor(queryItem: QueryItem) {
    this.path = queryItem.endPoint;
    this.apiController.queryItem = queryItem;
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/', this.apiController.index);
  }
}

export default APIRoute;
