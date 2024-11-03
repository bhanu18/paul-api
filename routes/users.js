import express from 'express';
import { findUser, createUser, getUser, logUserOut, role, addrole } from '../controller/users.js';

const router = express.Router();

router.post('/login', findUser);

router.post('/register', createUser);

router.get('/get', getUser);

router.get('/logout', logUserOut);

router.get('/role', role);

router.post('/role/add', addrole);

export default router;