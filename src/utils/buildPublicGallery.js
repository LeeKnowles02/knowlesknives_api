const { Op } = require('sequelize');
const { GalleryItem, Knife, KnifeImage, Service } = require('../models');

const SERVICE_CATEGORY_MAP = {
  'Custom Knife': 'Knives',
  'Knife Making Course': 'Courses',
  Engraving: 'Engraving',
  'Repairs / Sharpening': 'Workshop',
  General: 'Other',
  Other: 'Other',
};

const getKnifePrimaryImageUrl = (images) => {
  if (!images || images.length === 0) {
    return null;
  }

  const sorted = [...images].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  return sorted[0]?.imageUrl ?? null;
};

const addIfUnique = (entries, seenUrls, entry) => {
  const url = entry.imageUrl?.trim();
  if (!url || seenUrls.has(url)) {
    return;
  }

  seenUrls.add(url);
  entries.push(entry);
};

const buildPublicGallery = async () => {
  const [manualItems, knives, services] = await Promise.all([
    GalleryItem.findAll({
      where: { active: true },
      order: [
        ['sortOrder', 'ASC'],
        ['createdAt', 'DESC'],
      ],
    }),
    Knife.findAll({
      where: { active: true },
      include: [
        {
          model: KnifeImage,
          as: 'images',
          separate: true,
          order: [['sortOrder', 'ASC']],
        },
      ],
      order: [['createdAt', 'DESC']],
    }),
    Service.findAll({
      where: {
        active: true,
        imageUrl: {
          [Op.and]: [{ [Op.ne]: null }, { [Op.ne]: '' }],
        },
      },
      order: [['createdAt', 'DESC']],
    }),
  ]);

  const seenUrls = new Set();
  const manualEntries = [];
  const autoEntries = [];

  for (const item of manualItems) {
    addIfUnique(manualEntries, seenUrls, {
      id: `manual-${item.id}`,
      title: item.title,
      imageUrl: item.imageUrl,
      category: item.category,
      active: true,
      sortOrder: item.sortOrder,
      sourceType: 'manual',
      createdAt: item.createdAt,
    });
  }

  for (const knife of knives) {
    const imageUrl = getKnifePrimaryImageUrl(knife.images);
    if (!imageUrl) {
      continue;
    }

    addIfUnique(autoEntries, seenUrls, {
      id: `knife-${knife.id}`,
      title: knife.name,
      imageUrl,
      category: 'Knives',
      active: true,
      sourceType: 'knife',
      linkUrl: `/knives/${knife.slug}`,
      createdAt: knife.createdAt,
    });
  }

  for (const service of services) {
    addIfUnique(autoEntries, seenUrls, {
      id: `service-${service.id}`,
      title: service.title,
      imageUrl: service.imageUrl,
      category: SERVICE_CATEGORY_MAP[service.enquiryType] || 'Other',
      active: true,
      sourceType: 'service',
      linkUrl: '/services',
      createdAt: service.createdAt,
    });
  }

  autoEntries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return [...manualEntries, ...autoEntries].map(({ createdAt, ...entry }) => entry);
};

module.exports = buildPublicGallery;
