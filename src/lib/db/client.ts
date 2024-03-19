import { neon } from '@neondatabase/serverless';
import { DATABASE_URL } from '$env/static/private';
import { drizzle } from 'drizzle-orm/neon-http';
import { shortlink } from './schema';
const sql = neon(DATABASE_URL);

export const db = drizzle(sql, { schema: { shortlink } });
console.log('DB initialized!')
