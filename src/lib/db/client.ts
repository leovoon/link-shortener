import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { connect } from '@planetscale/database';
import { DATABASE_URL } from '$env/static/private';
import * as schema from './schema';

const connection = connect({
	url: DATABASE_URL
});

console.log('Database connected');
export const db = drizzle(connection, { schema });
