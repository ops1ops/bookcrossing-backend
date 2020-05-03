'use strict';
module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define('Location', {
    name: DataTypes.STRING,
    lat: DataTypes.DOUBLE,
    lon: DataTypes.DOUBLE,
    addedBy: DataTypes.INTEGER
  }, {});
  Location.associate = function(models) {
    // associations can be defined here
  };
  return Location;
};