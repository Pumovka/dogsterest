import express from 'express';
import cors from 'cors';
import dogsRouter from './routes/dogs_routes';

const PORT = 3005;

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use('/api/dogs', dogsRouter);

app.listen(3005, () => console.log(`Server is running on http://localhost:${PORT}`));
