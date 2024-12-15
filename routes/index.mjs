import path from 'path';
import express from 'express';
import { fetchAllUsers, fetchAllInterests, fetchAllUserInterest, fetchAllMatches } from '../database/postgres/api-postgres.mjs';
import { fetchChats, createChat, fetchNotifications,fetchMessages } from '../database/mongo/api-mongo.mjs'; 

const router = express.Router();

// Serve static files from the "public" folder (or your assets folder)
router.use(express.static(path.join(path.resolve(), 'views'))); // Adjust 'public' to your static assets folder

// Serve the index.html as the root
router.get('/', (req, res) => {
  console.log('Hello');
  res.sendFile(path.resolve('views/index.html')); // Serve from the public folder
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Postgres Routes  ///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// API route for fetching all users
router.use('/users', async (req,res) => {
  const data = await fetchAllUsers();
  res.json(data);
});

// API route for fetching all interests
router.use('/interests', async (req,res) => {
  const data = await fetchAllInterests();
  res.json(data);
});

// API route for fetching all user-interests
router.use('/userinterest', async (req,res) => {
  const data = await fetchAllUserInterest();
  res.json(data);
});

// API route for fetching all matches
router.use('/matches', async (req,res) => {
  const data = await fetchAllMatches();
  res.json(data);
});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Mongo Routes  //////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// API route for fetching all logging
router.use('/chats', async (req,res) => {
  const data = await fetchChats();
  res.json(data);
});

// API route for fetching all logging
router.use('/new-chat', async (req,res) => {
  const data = await createChat();
  res.json(data);
});

// API route for fetching all logging
router.use('/notifications', async (req,res) => {
  const data = await fetchNotifications();
  res.json(data);
});

// API route for fetching all logging
router.use('/messages', async (req,res) => {
  const data = await fetchMessages();
  res.json(data);
});

export default router;
