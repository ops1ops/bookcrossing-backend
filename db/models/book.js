'use strict';
module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    ownerId: DataTypes.INTEGER,
    locationId: DataTypes.INTEGER,
    providedBy: DataTypes.INTEGER,
    name: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    description: DataTypes.STRING,
    pageCount: DataTypes.INTEGER,
    publishYear: DataTypes.INTEGER,
  }, {});
  Book.associate = function({ User, Location }) {
    Book.belongsTo(User, { as: 'owner', foreignKey: 'ownerId', targetKey: 'id' });
    Book.belongsTo(User, { as: 'provider', foreignKey: 'providedBy', targetKey: 'id' });
    Book.belongsTo(Location, { as: 'location', foreignKey: 'locationId', targetKey: 'id' });
  };
  return Book;
};