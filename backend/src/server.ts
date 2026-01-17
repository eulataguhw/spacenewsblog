import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

import articleRoutes from './routes/articleRoutes';

app.use(cors());
app.use(express.json());

app.use('/api/articles', articleRoutes);

app.get('/', (req, res) => {
  res.send('SpaceBlog Backend API');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
