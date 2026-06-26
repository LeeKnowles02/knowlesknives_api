const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const KnifeImage = sequelize.define(
  'KnifeImage',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    knifeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    altText: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: 'knife_images',
  }
);

module.exports = KnifeImage;
