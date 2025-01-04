import path from 'path';
import express from 'express';
import { loginUser, fetchAllUsers, fetchAllInterests, fetchAllUserInterest, fetchMatchingUserInterest, fetchAllMatches, addUserInterest, removeUserInterest } from '../database/postgres/api-postgres.mjs';
import { fetchChats, createChat, fetchNotifications, fetchMessages, createMessage } from '../database/mongo/api-mongo.mjs';

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

router.post('/login', async (req, res) => {
  const { email, password } = req.body; // Extract email and password from the request body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' }); // Return error if missing data
  }

  try {
    const data = await loginUser(email, password); // Pass the email and password to the loginUser function
    res.status(200).json(data); // Respond with the user data if login is successful
  } catch (error) {
    res.status(401).json({ error: error.message }); // Handle authentication errors
  }
});



router.get('/users', async (req, res) => {
  const data = await fetchAllUsers();
  res.json(data);
});

router.get('/interests', async (req, res) => {
  const data = await fetchAllInterests();
  res.json(data);
});

router.get('/userinterest', async (req, res) => {
  const data = await fetchAllUserInterest();
  res.json(data);
});

router.get('/matchinginterests', async (req, res) => {
  const data = await fetchMatchingUserInterest();
  res.json(data);
});

router.get('/add-userinterest', async (req, res) => {
  try {
    const {user_interest_user, user_interest_interest} = req.query;
    if (!user_interest_user || !user_interest_interest) {
      return res.status(400).json({ error: 'Missing required parameters: user_interest_user or user_interest_interest' });
    }

    const result = await addUserInterest(user_interest_user, user_interest_interest);
    res.json({ success: true, result });
  } catch (error) {
    console.error('Error adding interest:', error);
    res.status(500).json({ error: 'Failed to add user interest' });
  }
});

router.get('/remove-userinterest', async (req, res) => {
  try {
    const { user_interest_user, user_interest_interest } = req.query;
    if (!user_interest_user || !user_interest_interest) {
      return res.status(400).json({ error: 'Missing required parameters: user_interest_user or user_interest_interest' });
    }

    const result = await removeUserInterest(user_interest_user, user_interest_interest);
    res.json({ success: true, result });
  } catch (error) {
    console.error('Error removing interest:', error);
    res.status(500).json({ error: 'Failed to remove user interest' });
  }
});

// API route for fetching all matches
router.get('/matches', async (req, res) => {
  const data = await fetchAllMatches();
  res.json(data);
});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Mongo Routes  //////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


router.get('/chats', async (req, res) => {
  const data = await fetchChats();
  res.json(data);
});


// MongoDB Route to handle creating a new chat
router.get('/new-chat', async (req, res) => {
  // Log the query parameters to ensure we're receiving them
  console.log('Received request to create a new chat:', req.query);

  const { chat_user_1, chat_user_2 } = req.query;

  // Validate the query parameters
  if (!chat_user_1 || !chat_user_2) {
    return res.status(400).json({ error: 'Both chat_user_1 and chat_user_2 are required' });
  }

  try {
    // Call the createChat function and pass the user IDs
    const data = await createChat(chat_user_1, chat_user_2);
    
    // Return the result as a JSON response
    res.json(data);
  } catch (error) {
    // console.error('Error in creating new chat:', error);
    // res.status(500).json({ error: 'Internal server error' });
  }
});



router.get('/notifications', async (req, res) => {
  const data = await fetchNotifications();
  res.json(data);
});

router.get('/messages', async (req, res) => {
  const data = await fetchMessages();
  res.json(data);
});

router.post('/create-message', async (req, res) => {
  const data = await createMessage();
  res.json(data);
});

export default router;
