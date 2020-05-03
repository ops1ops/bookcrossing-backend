'use strict';
module.exports = (sequelize, DataTypes) => {
  const History = sequelize.define('History', {
    bookId: DataTypes.INTEGER,
    locationId: DataTypes.INTEGER,
    ownerId: DataTypes.INTEGER
  }, {});
  History.associate = function(models) {

  };
  return History;
};