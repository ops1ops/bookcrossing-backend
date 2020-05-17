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
  Location.associate = function({ Book }) {
    Location.hasMany(Book, { as: 'books', foreignKey: 'locationId' });
  };
  return Location;
};