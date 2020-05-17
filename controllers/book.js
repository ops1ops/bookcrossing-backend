import { Book, Location, Author, Subscription, History, User } from '../db';
import mailer from '../mailer';

export const getAllBooks = async (req, res) => {
  const books = await Book.findAll({
    include: [
      { association: 'authors', attributes: ['id', 'name'], through: { attributes: [] } },
      { association: 'owner', attributes: ['id', 'login', 'email'] },
      { association: 'provider', attributes: ['id', 'login', 'email'] },
      { association: 'location', attributes: ['id', 'name', 'address'] },
    ]
  });
  console.log(books);

  return res.send(books);
};

export const addBook = async ({ body: { isbn, name, imageUrl, description, pagesCount, publishYear, providedBy, locationName, authors } }, res) => {
  try {
    const { id: locationId } = await Location.findOne({ where: { name: locationName } });

    if (!locationId) {
      return res.status(404).send({ reason: 'Location does not exist' });
    }

    const autorsArray = authors.split(', ').map((author) => ({ name: author }));
    const authorsIds = [];

    for (let i = 0; i < autorsArray.length; i++) {
      const author = autorsArray[i];
      const [{ id }] = await Author.findOrCreate({ where: { name: author.name } });

      authorsIds.push(id);
    }

    const book = await Book.create(
      { isbn, name, description, pagesCount, publishYear, locationId, providedBy, imageUrl },
    );

    await book.addAuthor(authorsIds);
    await History.create({ bookId: book.id, locationId });

    return res.send({ id: book.id });
  } catch (error) {
    console.log(error);

    return res.status(500).send({ reason: 'Something went wrong' });
  }
};

export const getBook = async ({ headers: { ['user-id']: userId } , params: { id } }, res) => {
  try {
    const book = await Book.findOne({
      where: { id },
      include: [
        { association: 'owner' },
        { association: 'authors', attributes: ['id', 'name'], through: { attributes: [] } },
        { association: 'location', attributes: ['id', 'address', 'name'] },
        { association: 'history' },
      ]
    });

    if (!book) {
      return res.status(404).send({ reason: 'Book was not found' });
    }

    if (userId && userId !== 'undefined') {
      const subscription = await Subscription.findOne({ where: { bookId: id, userId }});

      return res.send({ ...book.get(), subscribed: !!subscription });
    }

    return res.send(book);
  } catch (error) {
    console.log(error);

    return res.status(500).send({ reason: 'Something went wrong' })
  }
};

export const subscribeToBook = async ({ userId, params: { id } }, res) => {
  try {
    const [userItem, isCreated] = await Subscription.findOrCreate({
      where: { userId, bookId: id },
    });

    if (!isCreated) {
      return res.status(400).send({ reason: 'You already subscribed to book' });
    }

    res.send({ subscribed: !!userItem });
  } catch (error) {
    res.status(500).send({ reason: 'Something went wrong' });
  }
};

export const unsubscribeFromBook = async ({ userId, params: { id } }, res) => {
  try {
    const deletedRows = await Subscription.destroy({
      where: { userId, bookId: id },
      raw: true,
    });

    res.send({ subscribed: !deletedRows });
  } catch (error) {
    res.status(500).send({ reason: 'Something went wrong' });
  }
};

export const takeBookByUser = async ({ userId, params: { id } }, res) => {
  try {
    const update = await Book.update(
      { ownerId: userId, locationId: null },
      { where: { id } },
    );

    await History.create({ bookId: id, ownerId: userId, locationId: null });

    const subscriptions = await Subscription.findAll({ where: { bookId: id }});

    if (subscriptions) {
      subscriptions.forEach(async ({ userId }) => {
        const { email } = await User.findOne({ where: { id: userId }});

        mailer(email, id);
      })
    }

    res.send({ taken: !!update });
  } catch (error) {
    console.log(error);
    res.status(500).send({ reason: 'Something went wrong' });
  }
};

export const leaveBookByUser = async ({ body: { locationId }, params: { id } }, res) => {
  try {
    const update = await Book.update(
      { ownerId: null, locationId: locationId },
      { where: { id } },
    );

    await History.create({ bookId: id, locationId, ownerId: null });

    const subscriptions = await Subscription.findAll({ where: { bookId: id }});

    if (subscriptions) {
      subscriptions.forEach(async ({ userId }) => {
        const { email } = await User.findOne({ where: { id: userId }});

        mailer(email, id);
      })
    }

    res.send({ taken: !update });
  } catch (error) {
    res.status(500).send({ reason: 'Something went wrong' });
  }
};
