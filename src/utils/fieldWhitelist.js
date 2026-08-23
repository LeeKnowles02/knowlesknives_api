const KNIFE_FIELDS = [
  'name',
  'category',
  'shortDescription',
  'description',
  'price',
  'availability',
  'steelType',
  'handleMaterial',
  'bladeLength',
  'overallLength',
  'notes',
  'featured',
  'featuredOrder',
  'active',
];

const GOOD_FIELDS = [
  'name',
  'category',
  'shortDescription',
  'description',
  'price',
  'availability',
  'material',
  'finish',
  'dimensions',
  'personalization',
  'notes',
  'featured',
  'featuredOrder',
  'active',
];

const SERVICE_FIELDS = [
  'title',
  'shortDescription',
  'description',
  'enquiryType',
  'imageUrl',
  'active',
  'featured',
];

const GALLERY_FIELDS = ['title', 'imageUrl', 'category', 'sortOrder', 'active'];

module.exports = { KNIFE_FIELDS, GOOD_FIELDS, SERVICE_FIELDS, GALLERY_FIELDS };
