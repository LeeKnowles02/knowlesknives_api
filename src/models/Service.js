const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ENQUIRY_TYPE_VALUES = [
  'Custom Knife',
  'Knife Making Course',
  'Engraving',
  'Repairs / Sharpening',
  'General',
  'Other',
];

const Service = sequelize.define(
  'Service',
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
    slug: {
      type: DataTypes.STRING(220),
      allowNull: false,
      unique: true,
    },
    shortDescription: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    enquiryType: {
      type: DataTypes.ENUM(...ENQUIRY_TYPE_VALUES),
      allowNull: false,
      defaultValue: 'General',
    },
    imageUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    featured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: 'services',
  }
);

Service.ENQUIRY_TYPE_VALUES = ENQUIRY_TYPE_VALUES;

module.exports = Service;
