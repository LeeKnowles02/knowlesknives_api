const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CATEGORY_VALUES = ['Knives', 'Workshop', 'Engraving', 'Courses', 'Details', 'Other'];

const GalleryItem = sequelize.define(
  'GalleryItem',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'Other',
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: 'gallery_items',
  },
);

GalleryItem.CATEGORY_VALUES = CATEGORY_VALUES;

module.exports = GalleryItem;
