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
