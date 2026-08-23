const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AVAILABILITY_VALUES = ['Available', 'Reserved', 'Sold', 'Made to Order'];

const Good = sequelize.define(
  'Good',
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
      allowNull: false,
    },
    availability: {
      type: DataTypes.ENUM(...AVAILABILITY_VALUES),
      allowNull: false,
      defaultValue: 'Available',
    },
    material: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    finish: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    dimensions: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    personalization: {
      type: DataTypes.STRING(255),
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
    tableName: 'goods',
  }
);

Good.AVAILABILITY_VALUES = AVAILABILITY_VALUES;

module.exports = Good;
