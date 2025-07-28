import express from 'express';
import donorRoutes from './routes/donorRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import cors from 'cors';
// import other routes as needed

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/donors', donorRoutes);
app.use('/api/inventory', inventoryRoutes);
// app.use(...) for other routes

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
