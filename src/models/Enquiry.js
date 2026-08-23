const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ENQUIRY_TYPE_VALUES = [
  'General',
  'Knife Enquiry',
  'Goods Enquiry',
  'Custom Knife',
  'Knife Making Course',
  'Engraving',
  'Repairs / Sharpening',
  'Other',
];

const STATUS_VALUES = ['New', 'Contacted', 'Closed'];

const Enquiry = sequelize.define(
  'Enquiry',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: { isEmail: true },
    },
    phone: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    enquiryType: {
      type: DataTypes.ENUM(...ENQUIRY_TYPE_VALUES),
      allowNull: false,
    },
    selectedKnifeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    selectedKnifeName: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    selectedGoodId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    selectedGoodName: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    selectedServiceId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    selectedServiceName: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...STATUS_VALUES),
      allowNull: false,
      defaultValue: 'New',
    },
  },
  {
    tableName: 'enquiries',
  }
);

Enquiry.ENQUIRY_TYPE_VALUES = ENQUIRY_TYPE_VALUES;
Enquiry.STATUS_VALUES = STATUS_VALUES;

module.exports = Enquiry;
