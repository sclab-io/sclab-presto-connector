import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { QueryItem } from '@/config';
import MybatisController from '@/controllers/mybatis.controller';

class MybatisRoute implements Routes {
  public path?: string;
  public router = Router();
  public apiController = new MybatisController();

  constructor(queryItem: QueryItem) {
    this.path = queryItem.endPoint;
    this.apiController.queryItem = queryItem;
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/', this.apiController.index);
  }
}

export default MybatisRoute;
