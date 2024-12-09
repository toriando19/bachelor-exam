import path from 'path';
import express from 'express';
import { fetchAllUsers } from '../database/postgres/api-postgres.mjs';

const router = express.Router();

// Serve static files from the "public" folder (or your assets folder)
router.use(express.static(path.join(path.resolve(), 'views'))); // Adjust 'public' to your static assets folder

// Serve the index.html as the root
router.get('/', (req, res) => {
  res.sendFile(path.resolve('views/index.html')); // Serve from the public folder
});

// API route for fetching all users
router.use('/users', fetchAllUsers);

export default router;
