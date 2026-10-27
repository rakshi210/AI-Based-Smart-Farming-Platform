import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.status(200).json({
    status: 'ok',
    service: 'AI-Based Smart Farming Platform REST API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: {
      status: isConnected ? 'connected' : 'disconnected',
      host: mongoose.connection.host || null,
      name: mongoose.connection.name || null,
    },
  });
});

export default router;

