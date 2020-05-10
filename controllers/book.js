import { Book } from '../db';

export const getAllBooks = async (req, res) => {
  const books = await Book.findAll({
    include: ['owner', 'provider']
  });
  console.log(books);

  return res.send(books);
};