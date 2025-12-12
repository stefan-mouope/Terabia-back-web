// backend/models/Message.js
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define(
    "Message",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      from_user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      to_user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      order_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    }
  );

  Message.associate = (models) => {
    Message.belongsTo(models.User, {
      as: "sender",
      foreignKey: "from_user_id",
    });

    Message.belongsTo(models.User, {
      as: "receiver",
      foreignKey: "to_user_id",
    });

    Message.belongsTo(models.Order, {
      foreignKey: "order_id",
    });
  };

  return Message;
};
