// /lib/db.ts
import { PrismaClient } from '@prisma/client';

// Exportando o cliente Prisma como 'db' para manter compatibilidade com seu código
export const db = new PrismaClient()

// Cliente PG para notificações em tempo real
export async function createNotificationClient() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? true : false
  });
  
  const client = await pool.connect();
  return client;
}
