/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
export const isEmpty = (value: string | number | object): boolean => {
  if (value === null) {
    return true;
  } else if (typeof value !== 'number' && value === '') {
    return true;
  } else if (typeof value === 'undefined' || value === undefined) {
    return true;
  } else if (value !== null && typeof value === 'object' && !Object.keys(value).length) {
    return true;
  } else {
    return false;
  }
};

export const getPlaceHolders = (sql: string): string[] => {
  const regex = /\${(\w+)}/g;
  const placeholders = [];

  let match;
  while ((match = regex.exec(sql)) !== null) {
    placeholders.push(match[1]);
  }

  return placeholders;
};

export const replaceString = (sql: string, map: { [key: string]: string }): string => {
  const regex = /\${(\w+)}/g;

  return sql.replace(regex, (match, key) => map[key]);
};

export const hasSql = (value: string): boolean => {
  if (value === null || value === undefined) {
    return false;
  }

  // sql regex reference: http://www.symantec.com/connect/articles/detection-sql-injection-and-cross-site-scripting-attacks
  var sql_meta = new RegExp("(%27)|(')|(--)|(%23)|(#)", 'i');
  if (sql_meta.test(value)) {
    return true;
  }

  var sql_meta2 = new RegExp("((%3D)|(=))[^\n]*((%27)|(')|(--)|(%3B)|(;))", 'i');
  if (sql_meta2.test(value)) {
    return true;
  }

  var sql_typical = new RegExp("w*((%27)|('))((%6F)|o|(%4F))((%72)|r|(%52))", 'i');
  if (sql_typical.test(value)) {
    return true;
  }

  var sql_union = new RegExp("((%27)|('))union", 'i');
  if (sql_union.test(value)) {
    return true;
  }

  return false;
};
