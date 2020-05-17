'use strict';
module.exports = (sequelize, DataTypes) => {
  const History = sequelize.define('History', {
    bookId: DataTypes.INTEGER,
    locationId: DataTypes.INTEGER,
    ownerId: DataTypes.INTEGER
  }, {});
  History.associate = function({ Book }) {
    History.belongsTo(Book, { as: 'books', foreignKey: 'bookId', targetKey: 'id' })
  };
  return History;
};