const sequelize = require('../config/database');
const User = require('./User');
const Knife = require('./Knife');
const KnifeImage = require('./KnifeImage');
const Good = require('./Good');
const GoodImage = require('./GoodImage');
const Service = require('./Service');
const Enquiry = require('./Enquiry');
const GalleryItem = require('./GalleryItem');

Knife.hasMany(KnifeImage, { foreignKey: 'knifeId', as: 'images', onDelete: 'CASCADE' });
KnifeImage.belongsTo(Knife, { foreignKey: 'knifeId', as: 'knife' });

Good.hasMany(GoodImage, { foreignKey: 'goodId', as: 'images', onDelete: 'CASCADE' });
GoodImage.belongsTo(Good, { foreignKey: 'goodId', as: 'good' });

Enquiry.belongsTo(Knife, { foreignKey: 'selectedKnifeId', as: 'selectedKnife' });
Enquiry.belongsTo(Good, { foreignKey: 'selectedGoodId', as: 'selectedGood' });
Enquiry.belongsTo(Service, { foreignKey: 'selectedServiceId', as: 'selectedService' });

module.exports = {
  sequelize,
  User,
  Knife,
  KnifeImage,
  Good,
  GoodImage,
  Service,
  Enquiry,
  GalleryItem,
};
