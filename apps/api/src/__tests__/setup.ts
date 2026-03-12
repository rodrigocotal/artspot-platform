import dotenv from 'dotenv';
import path from 'path';

// Load test env vars before any modules read process.env
dotenv.config({ path: path.join(__dirname, '../../.env.test') });
