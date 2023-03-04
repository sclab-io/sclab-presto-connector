import { NextFunction, Request, Response } from 'express';
import { QueryItem, PrestoClient } from '../config/index';
import { logger } from '@/utils/logger';

class APIController {
  public queryItem?: QueryItem;
  public index = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let rows = [];
    PrestoClient.execute({
      query: this.queryItem.query,
      state: function (error, query_id, stats) {
        if (error) {
          logger.error(error);
          next(error);
          return;
        }
        logger.debug({ message: 'status changed', id: query_id, stats: stats });
      },
      columns: function (error, data) {
        if (error) {
          logger.error(error);
          next(error);
          return;
        }
        logger.debug(data);
      },
      data: function (error, data, columns, stats) {
        if (error) {
          logger.error(error);
          next(error);
          return;
        }
        logger.debug(data);
        for (let i = 0; i < data.length; i++) {
          const obj = {};
          for (let j = 0; j < columns.length; j++) {
            obj[columns[j].name] = data[i][j];
          }

          rows.push(obj);
        }
      },
      success: function (error, stats) {
        if (error) {
          logger.error(error);
          next(error);
          return;
        }
        logger.debug(stats);
        res.writeHead(200, {
          'Content-Type': 'application/json',
        });
        res.end(
          JSON.stringify({
            rows,
          }),
        );

        rows = null;
      },
      error: function (error) {
        logger.error(error);
        rows = null;
        next(error);
      },
    });
  };
}

export default APIController;
