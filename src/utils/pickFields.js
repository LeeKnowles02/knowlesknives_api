const pickFields = (obj, keys) => {
  return keys.reduce((result, key) => {
    if (obj[key] !== undefined) {
      result[key] = obj[key];
    }
    return result;
  }, {});
};

module.exports = pickFields;
