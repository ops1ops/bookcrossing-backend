import express from 'express';

import booksRoute from './routes/booksRoute';
import usersRoute from './routes/usersRoute';
import cors from './middlewares/cors';

const PORT = process.env.PORT || 8000;
const app = express();

app.use(express.json());
app.set('json spaces', 4);
app.use(cors);

app.use('/api/v1', booksRoute, usersRoute);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));