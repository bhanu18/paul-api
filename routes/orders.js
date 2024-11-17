import express from 'express';
import { allOrder } from '../controller/OrdersController.js';

const router = express.Router();

router.get('/', allOrder);

export default router;