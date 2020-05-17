'use strict';
module.exports = (sequelize, DataTypes) => {
  const History = sequelize.define('History', {
    bookId: DataTypes.INTEGER,
    locationId: DataTypes.INTEGER,
    ownerId: DataTypes.INTEGER
  }, {});
  History.associate = function({ Book, User, Location }) {
    History.belongsTo(Book, { as: 'books', foreignKey: 'bookId', targetKey: 'id' });
    History.belongsTo(User, { as: 'owner', foreignKey: 'ownerId', targetKey: 'id' });
    History.belongsTo(Location, { as: 'location', foreignKey: 'locationId', targetKey: 'id' });
  };
  return History;
};