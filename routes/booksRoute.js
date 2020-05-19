import express from 'express';

import {
  addBook,
  getAllBooks,
  getBook, leaveBookByUser, reportBook,
  subscribeToBook,
  takeBookByUser,
  unsubscribeFromBook,
} from '../controllers/book';
import validateRequiredFields from '../middlewares/validators/validateRequiredFields';
import verifyUser from '../middlewares/verifyUser';

const router = express.Router();
const ADD_BOOK_FIELDS = ['isbn', 'name', 'authors', 'imageUrl', 'description', 'pagesCount', 'publishYear', 'providedBy', 'locationName'];

router.get('/books', getAllBooks);
router.get('/book/:id', getBook);
router.post('/book/add', validateRequiredFields(ADD_BOOK_FIELDS), verifyUser, addBook);

router.post('/book/:id/subscribe', verifyUser, subscribeToBook);
router.delete('/book/:id/unsubscribe', verifyUser, unsubscribeFromBook);

router.post('/book/:id/take', verifyUser, takeBookByUser);
router.post('/book/:id/leave', verifyUser, leaveBookByUser);

router.post('/book/:id/report', verifyUser, reportBook);

export default router;