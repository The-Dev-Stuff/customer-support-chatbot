import express from 'express';
import customerSupportRoutes from '../agents/customer-support-agent/routes.js';

const router = express.Router();

router.use('/customer-support', customerSupportRoutes);

export default router;
