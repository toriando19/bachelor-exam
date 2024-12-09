import express from 'express';
import { fetchAllUsers } from '../database/postgres/api-postgres.mjs';

const router = express.Router();

router.use('/users', fetchAllUsers)


export default router;
