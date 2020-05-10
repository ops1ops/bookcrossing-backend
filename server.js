import express from 'express';

import booksRoute from './routes/booksRoute';
import cors from './middlewares/cors';

const PORT = process.env.PORT || 8080;
const app = express();

app.use(express.json());
app.set('json spaces', 4);
app.use(cors);

app.use('/api/v1', booksRoute);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));