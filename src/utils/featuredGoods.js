const { Op } = require('sequelize');
const { Good } = require('../models');
const AppError = require('./AppError');

const MAX_FEATURED = 5;

const getFeaturedCount = async (excludeGoodId = null, transaction = null) => {
  const where = { featured: true, active: true };
  if (excludeGoodId) {
    where.id = { [Op.ne]: excludeGoodId };
  }
  return Good.count({ where, transaction });
};

const getUsedFeaturedOrders = async (excludeGoodId = null, transaction = null) => {
  const where = { featured: true, active: true, featuredOrder: { [Op.ne]: null } };
  if (excludeGoodId) {
    where.id = { [Op.ne]: excludeGoodId };
  }
  const goods = await Good.findAll({
    where,
    attributes: ['featuredOrder'],
    transaction,
  });
  return goods.map((g) => g.featuredOrder);
};

const nextFeaturedOrder = async (excludeGoodId = null, transaction = null) => {
  const used = await getUsedFeaturedOrders(excludeGoodId, transaction);
  for (let i = 1; i <= MAX_FEATURED; i += 1) {
    if (!used.includes(i)) return i;
  }
  return null;
};

const applyFeaturedFields = async (goodData, goodId = null, transaction = null) => {
  if (goodData.featured !== true) {
    if (goodData.featured === false) {
      goodData.featuredOrder = null;
    }
    return goodData;
  }

  const count = await getFeaturedCount(goodId, transaction);
  if (count >= MAX_FEATURED) {
    throw new AppError(`Maximum of ${MAX_FEATURED} featured goods allowed. Unfeature another item first.`, 400);
  }

  if (goodData.featuredOrder == null) {
    const order = await nextFeaturedOrder(goodId, transaction);
    if (!order) {
      throw new AppError(`Maximum of ${MAX_FEATURED} featured goods allowed. Unfeature another item first.`, 400);
    }
    goodData.featuredOrder = order;
  }

  return goodData;
};

module.exports = {
  MAX_FEATURED,
  getFeaturedCount,
  applyFeaturedFields,
};
