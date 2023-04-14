import { getPlaceHolders, replaceString } from '../utils/util';

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
});
