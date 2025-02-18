import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config.js';
import rootRouter from './routes/rootRouter.js'

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

//All v1 versioned routes are handled by central rootRouter.
app.use("/api", rootRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});