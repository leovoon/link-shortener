import { neon } from '@neondatabase/serverless';
import { DATABASE_URL } from '$env/static/private';
import { drizzle } from 'drizzle-orm/neon-http';

const sql = neon(DATABASE_URL);

export const db = drizzle(sql);
console.log('DB initialized!')
