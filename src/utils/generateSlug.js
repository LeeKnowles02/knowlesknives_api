const { Op } = require('sequelize');

const generateBaseSlug = (text) => {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const generateUniqueSlug = async (text, Model, excludeId = null) => {
  const baseSlug = generateBaseSlug(text) || 'item';
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const where = { slug };
    if (excludeId) {
      where.id = { [Op.ne]: excludeId };
    }

    const existing = await Model.findOne({ where });
    if (!existing) {
      return slug;
    }

    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }
};

module.exports = { generateBaseSlug, generateUniqueSlug };
