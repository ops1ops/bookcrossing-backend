'use strict';
module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    isbn: DataTypes.INTEGER,
    ownerId: DataTypes.INTEGER,
    locationId: DataTypes.INTEGER,
    providedBy: DataTypes.INTEGER,
    name: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    description: DataTypes.STRING,
    pagesCount: DataTypes.INTEGER,
    publishYear: DataTypes.INTEGER,
  }, {});
  Book.associate = function({ User, Location, Author, Genre, History }) {
    Book.belongsTo(User, { as: 'owner', foreignKey: 'ownerId', targetKey: 'id' });
    Book.belongsTo(User, { as: 'provider', foreignKey: 'providedBy', targetKey: 'id' });
    Book.belongsTo(Location, { as: 'location', foreignKey: 'locationId', targetKey: 'id' });

    Book.belongsToMany(Author, { through: 'BookAuthors', as: 'authors' });
    Book.belongsToMany(User, { through: 'Subscriptions', as: 'subscribedUsers' });

    Book.hasMany(History, { as: 'history', foreignKey: 'bookId' });
  };
  return Book;
};