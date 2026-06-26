const sequelize = require('../config/database');
const User = require('./User');
const Knife = require('./Knife');
const KnifeImage = require('./KnifeImage');
const Service = require('./Service');
const Enquiry = require('./Enquiry');

Knife.hasMany(KnifeImage, { foreignKey: 'knifeId', as: 'images', onDelete: 'CASCADE' });
KnifeImage.belongsTo(Knife, { foreignKey: 'knifeId', as: 'knife' });

Enquiry.belongsTo(Knife, { foreignKey: 'selectedKnifeId', as: 'selectedKnife' });
Enquiry.belongsTo(Service, { foreignKey: 'selectedServiceId', as: 'selectedService' });

module.exports = {
  sequelize,
  User,
  Knife,
  KnifeImage,
  Service,
  Enquiry,
};
