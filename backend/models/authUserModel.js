const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AuthUser = sequelize.define('AuthUser', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    encrypted_password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    tableName: 'auth_users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    schema: 'auth',
  });

  return AuthUser;
};
