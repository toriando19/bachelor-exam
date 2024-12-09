import express from 'express';
import { fetchAllUsers } from '../database/postgres/api-postgres.mjs';
import path from 'path';

const router = express.Router();

// Serve the index.html as the root
router.get('/', (req, res) => {
    res.sendFile(path.resolve('./public/index.html'));
});

router.use('/users', fetchAllUsers)


export default router;
