const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AVAILABILITY_VALUES = ['Available', 'Reserved', 'Sold', 'Made to Order'];

const Knife = sequelize.define(
  'Knife',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(220),
      allowNull: false,
      unique: true,
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    shortDescription: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    availability: {
      type: DataTypes.ENUM(...AVAILABILITY_VALUES),
      allowNull: false,
      defaultValue: 'Available',
    },
    steelType: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    handleMaterial: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    bladeLength: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    overallLength: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    featured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    featuredOrder: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: 'knives',
  }
);

Knife.AVAILABILITY_VALUES = AVAILABILITY_VALUES;

module.exports = Knife;
