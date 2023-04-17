import { getPlaceHolders, hasSql, replaceString } from '../utils/util';
import APIController from '../controllers/api.controller';
import { QueryType } from '../config';
import request from 'supertest';
import App from '../app';
import IndexRoute from '../routes/index.route';

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
    const mappingQuery = controller.mappingRequestData(controller.queryItem.query, { field: '*', table: 'member', name: "';drop table member;--" });
    expect(mappingQuery).toEqual("select * from member where name='';drop table member;--'");
    expect(hasSql(mappingQuery)).toEqual(true);
  });
});
