const { Op } = require('sequelize');
const { Knife } = require('../models');
const AppError = require('./AppError');

const MAX_FEATURED = 8;

const getFeaturedCount = async (excludeKnifeId = null, transaction = null) => {
  const where = { featured: true, active: true };
  if (excludeKnifeId) {
    where.id = { [Op.ne]: excludeKnifeId };
  }
  return Knife.count({ where, transaction });
};

const getUsedFeaturedOrders = async (excludeKnifeId = null, transaction = null) => {
  const where = { featured: true, active: true, featuredOrder: { [Op.ne]: null } };
  if (excludeKnifeId) {
    where.id = { [Op.ne]: excludeKnifeId };
  }
  const knives = await Knife.findAll({
    where,
    attributes: ['featuredOrder'],
    transaction,
  });
  return knives.map((k) => k.featuredOrder);
};

const nextFeaturedOrder = async (excludeKnifeId = null, transaction = null) => {
  const used = await getUsedFeaturedOrders(excludeKnifeId, transaction);
  for (let i = 1; i <= MAX_FEATURED; i += 1) {
    if (!used.includes(i)) return i;
  }
  return null;
};

const applyFeaturedFields = async (knifeData, knifeId = null, transaction = null) => {
  if (knifeData.featured !== true) {
    if (knifeData.featured === false) {
      knifeData.featuredOrder = null;
    }
    return knifeData;
  }

  const count = await getFeaturedCount(knifeId, transaction);
  if (count >= MAX_FEATURED) {
    throw new AppError(`Maximum of ${MAX_FEATURED} featured knives allowed. Unfeature another knife first.`, 400);
  }

  if (knifeData.featuredOrder == null) {
    const order = await nextFeaturedOrder(knifeId, transaction);
    if (!order) {
      throw new AppError(`Maximum of ${MAX_FEATURED} featured knives allowed. Unfeature another knife first.`, 400);
    }
    knifeData.featuredOrder = order;
  }

  return knifeData;
};

module.exports = {
  MAX_FEATURED,
  getFeaturedCount,
  applyFeaturedFields,
};
