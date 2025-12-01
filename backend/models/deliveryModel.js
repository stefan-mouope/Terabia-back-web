const { DataTypes } = require('sequelize');
const { DELIVERY_STATUS } = require('../constants/enums');

module.exports = (sequelize) => {
  const Delivery = sequelize.define('Delivery', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'orders',
        key: 'id',
      },
    },
    agency_id: {
      type: DataTypes.UUID,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM(Object.values(DELIVERY_STATUS)),
      defaultValue: DELIVERY_STATUS.AVAILABLE,
    },
    pickup_address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    pickup_coords: {
      type: DataTypes.JSONB,
    },
    delivery_address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    delivery_coords: {
      type: DataTypes.JSONB,
    },
    estimated_fee: {
      type: DataTypes.DECIMAL(10, 2),
    },
    actual_fee: {
      type: DataTypes.DECIMAL(10, 2),
    },
    accepted_at: {
      type: DataTypes.DATE,
    },
    picked_at: {
      type: DataTypes.DATE,
    },
    delivered_at: {
      type: DataTypes.DATE,
    },
    notes: {
      type: DataTypes.TEXT,
    },
  }, {
    tableName: 'deliveries',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false, // No updated_at in original schema
  });

  return Delivery;
};