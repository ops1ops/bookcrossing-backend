'use strict';
module.exports = (sequelize, DataTypes) => {
  const Author = sequelize.define('Author', {
    name: DataTypes.STRING
  }, {});
  Author.associate = function({ Book }) {
    Author.belongsToMany(Book, { through: 'BookAuthors', as: 'books' });
  };
  return Author;
};