'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    login: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {});

  User.associate = function({ Book, History, Report, Location }) {
    User.hasMany(Book, { as: 'ownedBooks', foreignKey: 'ownerId' });
    User.hasMany(Book, { as: 'providedBooks', foreignKey: 'providedBy' });
    User.hasMany(History, { as: 'history', foreignKey: 'ownerId' });
    User.hasMany(Location, { as: 'locations', foreignKey: 'addedBy' });

    User.belongsToMany(Book, { through: 'Subscriptions', as: 'subscribedBooks' });
    User.belongsToMany(Book, { as: 'reportedBooks', through: { model: Report, as: 'report' } });
  };

  return User;
};