import express from 'express';

import { getAllBooks } from '../controllers/book';

const router = express.Router();

router.get('/books', getAllBooks);

export default router;