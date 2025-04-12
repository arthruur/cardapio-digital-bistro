/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pool } from 'pg';
import { NextApiRequest, NextApiResponse } from 'next';

const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL,
  ssl: true,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Configurar headers para SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const client = await pool.connect();
  await client.query('LISTEN order_changes');

  const handleNotification = (msg: any) => {
    res.write(`data: ${msg.payload}\n\n`);
  };

  client.on('notification', handleNotification);

  // Manter a conexão aberta
  req.on('close', () => {
    client.off('notification', handleNotification);
    client.release();
    res.end();
  });
}