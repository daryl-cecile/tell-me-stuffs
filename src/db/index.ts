import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';

if (!process.env.DATABASE_URL) {
	throw new Error('DATABASE_URL is not defined');
}

const db = drizzle({
	connection: {
		connectionString: process.env.DATABASE_URL
	}
});

export default db;