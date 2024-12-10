import path from 'path';
import express from 'express';
import { fetchAllUsers, fetchAllInterests, fetchAllUserInterest } from '../database/postgres/api-postgres.mjs';
import { fetchDocuments } from '../database/mongo/api-mongo.mjs'; 

const router = express.Router();

// Serve static files from the "public" folder (or your assets folder)
router.use(express.static(path.join(path.resolve(), 'views'))); // Adjust 'public' to your static assets folder

// Serve the index.html as the root
router.get('/', (req, res) => {
  console.log('Hello');
  res.sendFile(path.resolve('views/index.html')); // Serve from the public folder
});

// API route for fetching all users
router.use('/users', async (req,res) => {
  const data = await fetchAllUsers();
  res.json(data);
});

// API route for fetching all users
router.use('/interests', async (req,res) => {
  const data = await fetchAllInterests();
  res.json(data);
});

// API route for fetching all users
router.use('/userinterest', async (req,res) => {
  const data = await fetchAllUserInterest();
  res.json(data);
});

// API route for fetching all logging
router.use('/logs', async (req,res) => {
  const data = await fetchDocuments();
  res.json(data);
});

export default router;
