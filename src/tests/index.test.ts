import { getPlaceHolders, hasSql, replaceString } from '../utils/util';
import APIController from '../controllers/api.controller';
import { QueryType, SQL_INJECTION } from '../config';
import request from 'supertest';
import App from '../app';
import IndexRoute from '../routes/index.route';
import { assert } from 'console';

describe('설정과 파라미터를 통해 sql을 만들어주는 기능 테스트', () => {
  test('getPlaceHolders', () => {
    const sql = "select ${field} from ${table} where name='${name}'";
    const map = {
      field: '*',
      table: 'member',
      name: '홍길동',
    };

    const placeHolders = getPlaceHolders(sql);
    expect(placeHolders).toEqual(['field', 'table', 'name']);
  });

  test('replaceString', () => {
    const sql = "select ${field} from ${table} where name='${name}'";
    const map = {
      field: '*',
      table: 'member',
      name: '홍길동',
    };

    const newSQL = replaceString(sql, map);
    expect(newSQL).toEqual("select * from member where name='홍길동'");
  });

  test('APIController.mappingRequestData', () => {
    const sql = "select ${field} from ${table} where name='${name}'";
    const controller = new APIController();
    controller.queryItem = { type: QueryType.API, query: sql };
    const mappingQuery = controller.mappingRequestData(controller.queryItem.query, { field: '*', table: 'member', name: 'Hannah' });
    expect(mappingQuery).toEqual("select * from member where name='Hannah'");
  });

  test('sql injection', () => {
    const sql = "select ${field} from ${table} where name='${name}'";
    const controller = new APIController();
    controller.queryItem = { type: QueryType.API, query: sql };
    expect(() => {
      return controller.mappingRequestData(controller.queryItem!.query, { field: '*', table: 'member', name: "';drop table member;--" }, true);
    }).toThrow(Error);

    expect(
      controller.mappingRequestData(controller.queryItem!.query, { field: '*', table: 'member', name: "';drop table member;--" }, false),
    ).toEqual("select * from member where name='';drop table member;--'");
  });

  test('sql injection 2', () => {
    const sql = "select * from a where b =1 and date_parse(c, '%Y-%m-%d %H:%i:%S.%f') > date_add('hour', -72, now())";
    const controller = new APIController();
    controller.queryItem = { type: QueryType.API, query: sql };
    const mappingQuery = controller.mappingRequestData(controller.queryItem.query, {}, true);
    expect(mappingQuery).toEqual("select * from a where b =1 and date_parse(c, '%Y-%m-%d %H:%i:%S.%f') > date_add('hour', -72, now())");
  });
});
