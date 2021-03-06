import { Book, Location, Author, Subscription, History, User, Report } from '../db';
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

  return res.send(books);
};

export const addBook = async ({ userId, body: { isbn, name, imageUrl, description, pagesCount, publishYear, providedBy, locationName, authors } }, res) => {
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
        { association: 'owner', attributes: ['id', 'login'] },
        { association: 'authors', attributes: ['id', 'name'], through: { attributes: [] } },
        { association: 'location', attributes: ['id', 'address', 'name'] },
        { association: 'history', include: [{ association: 'location', attributes: ['id', 'name', 'address'] }, { association: 'owner', attributes: ['id', 'login'] }]},
      ],
      order: [[{ model: History, as: 'history' }, 'createdAt', 'ASC']]
    });

    if (!book) {
      return res.status(404).send({ reason: 'Book was not found' });
    }

    const bookData = await book.get();

    const newHistory = bookData.history.reduce((acc, { location, owner, createdAt }, index) => {
      if (owner) {
        return [
          ...acc,
          {
            owner,
            startTime: createdAt,
            endTime: bookData.history[index + 1] ? bookData.history[index + 1].createdAt : null,
            prevLocation: bookData.history[index - 1] ? bookData.history[index - 1].location : null,
          }
        ]
      }

      return acc;
    }, []);

    const bookDataReturned = { ...bookData, history: newHistory };

    if (userId && userId !== 'undefined') {
      const subscription = await Subscription.findOne({ where: { bookId: id, userId }});
      const report = await Report.findOne({ where: { bookId: id, userId }});

      return res.send({ ...bookDataReturned, subscribed: !!subscription, reported: !!report });
    }

    return res.send(bookDataReturned);
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

export const reportBook = async ({ userId, body: { description }, params: { id } }, res) => {
  try {
    const report = await Report.create({ BookId: id, UserId: userId, description });

    if (!report) {
      return res.status(400).send({ reason: 'Could not report' });
    }

    res.send({ reported: !!report });
  } catch (error) {
    console.log(error);
    res.status(500).send({ reason: 'Something went wrong' });
  }
};
