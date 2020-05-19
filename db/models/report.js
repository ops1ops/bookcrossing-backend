'use strict';
module.exports = (sequelize, DataTypes) => {
  const Report = sequelize.define('Report', {
    bookId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    description: DataTypes.STRING
  }, {});
  Report.associate = function({ Book }) {
  };
  return Report;
};