'use strict';
module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define('Location', {
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    description: DataTypes.STRING,
    lat: DataTypes.DOUBLE,
    lon: DataTypes.DOUBLE,
    addedBy: DataTypes.INTEGER
  }, {});
  Location.associate = function({ Book, History }) {
    Location.hasMany(Book, { as: 'books', foreignKey: 'locationId' });
    Location.hasMany(History, { as: 'history', foreignKey: 'locationId' });
  };
  return Location;
};