'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {});
  User.associate = function({ Book }) {
    User.hasMany(Book, { as: 'books' });
  };
  return User;
};