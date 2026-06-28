import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema.ts'
import { env, isProd } from '../../env.ts'
import { remember } from '@epic-web/remember'

// Create a new database connection pool
const createPool = () => {
  return new Pool({
    connectionString: env.DATABASE_URL,
  })
}

let client

// Create a new database connection pool if in production, otherwise reuse the existing pool
if (isProd()) {
  client = createPool()
} else {
  // Use the remember function to cache the database connection pool in development
  // dbPool is a unique key used to store the pool in memory
  client = remember('dbPool', () => createPool())
}

export const db = drizzle({ client, schema })
export default db
