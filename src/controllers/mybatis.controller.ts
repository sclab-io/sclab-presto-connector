import { NextFunction, Request, Response } from 'express';
import { QueryItem, PrestoClient, SQL_INJECTION } from '../config/index';
import { logger } from '@/utils/logger';
import { hasSql } from '@/utils/util';
import MybatisMapper from 'mybatis-mapper';

class APIController {
  public options: any = { language: 'sql', indent: '  ' };
  public queryItem?: QueryItem;

  mappingRequestData(queryData: any, isCheckInjection = false): string {
    // data mapping
    const valueObj = {};
    const paramKeys = Object.keys(queryData);
    if (paramKeys.length > 0) {
      let paramKey: string, reqData: any;
      for (let i = 0; i < paramKeys.length; i++) {
        paramKey = paramKeys[i];
        reqData = queryData[paramKey];

        if (reqData !== undefined && reqData !== null) {
          // check sql injection
          if (isCheckInjection) {
            if (hasSql(reqData)) {
              throw new Error(`SQL inject detect with final query data, ${paramKey}, ${reqData}, ${this.queryItem.endPoint}`);
            }
          }
        }
        if (reqData) {
          try {
            valueObj[paramKey] = JSON.parse(reqData);
          } catch (e) {
            valueObj[paramKey] = reqData;
          }
        }
      }

      logger.info(`${this.queryItem.namespace}, ${this.queryItem.queryId}, ${JSON.stringify(valueObj)}`);
    }

    return MybatisMapper.getStatement(this.queryItem.namespace, this.queryItem.queryId, valueObj, this.options);
  }

  public index = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let rows = [];
    if (!this.queryItem.namespace || !this.queryItem.queryId) {
      res.writeHead(500, {
        'Content-Type': 'application/json',
      });
      res.end(
        JSON.stringify({
          message: 'Namespace or Query ID is empty',
        }),
      );
      return;
    }

    let sql = this.queryItem.query;

    try {
      sql = this.mappingRequestData(req.query, !!SQL_INJECTION);
    } catch (e) {
      console.error(e);
      res.writeHead(400, {
        'Content-Type': 'application/json',
      });
      res.end(
        JSON.stringify({
          message: e.toString(),
        }),
      );
      return;
    }

    logger.debug(`RUN SQL : ${sql}`);
    PrestoClient.execute({
      query: sql,
      state: function (error, query_id, stats) {
        if (error) {
          console.error(error);
          next(error);
          return;
        }
        logger.debug({ message: 'status changed', id: query_id, stats: stats });
      },
      columns: function (error, data) {
        if (error) {
          console.error(error);
          next(error);
          return;
        }
        logger.debug(data);
      },
      data: function (error, data, columns) {
        if (error) {
          console.error(error);
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
          console.error(error);
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
        console.error(error);
        rows = null;
        next(error);
      },
    });
  };
}

export default APIController;
