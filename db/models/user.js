'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    login: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {});

  User.associate = function({ Book }) {
    User.hasMany(Book, { as: 'ownedBooks', foreignKey: 'ownerId' });
    User.hasMany(Book, { as: 'providedBooks', foreignKey: 'providedBy' });
  };

  return User;
};