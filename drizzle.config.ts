import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config();

if (!process.env.DATABASE_URL) {
	throw new Error('DATABASE_URL environment variable is required.');
}

export default {
	schema: './src/lib/db/schema.ts',
	out: 'drizzle',
	driver: 'mysql2',
	dbCredentials: {
		uri: process.env.DATABASE_URL
	}
} satisfies Config;
