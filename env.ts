// custom-env loads .env.{stage} files (e.g. .env.dev, .env.test)
// production env vars must be injected by the host/CI — no file is loaded there
import { env as loadEnv } from 'custom-env'
import { z } from 'zod'

// default to 'dev' so local runs work without setting APP_STAGE manually
process.env.APP_STAGE = process.env.APP_STAGE || 'dev'

const isProduction = process.env.APP_STAGE === 'production'
const isDevelopment = process.env.APP_STAGE === 'dev'
const isTesting = process.env.APP_STAGE === 'test'

// only load .env files in non-production environments
if (isDevelopment) {
  loadEnv()          // reads .env.dev
} else if (isTesting) {
  loadEnv('test')    // reads .env.test
}

// z.coerce.number() is needed because all process.env values are strings;
// coerce handles the string-to-number conversion before validation
const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),

  APP_STAGE: z.enum(['dev', 'test', 'production']).default('dev'),

  PORT: z.coerce.number().positive().default(3000),
  DATABASE_URL: z.string().startsWith('postgresql://'),
  JWT_SECRET: z.string().min(32, 'Must be 32 chars long'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  // bcrypt cost factor — higher = slower hash but more secure; 10–20 is the safe range
  BCRYPT_ROUNDS: z.coerce.number().min(10).max(20).default(12),
})

// Env type is derived directly from the schema so it stays in sync automatically
export type Env = z.infer<typeof envSchema>
let env: Env

try {
  env = envSchema.parse(process.env)
} catch (e) {
  if (e instanceof z.ZodError) {
    console.log('Invalid env var')
    console.error(JSON.stringify(e.flatten().fieldErrors, null, 2))

    e.issues.forEach((err) => {
      const path = err.path.join('.')
      console.log(`${path}: ${err.message}`)
    })
    // stop the server from starting if env vars are invalid
    process.exit(1)
  }

  // re-throw unexpected errors (non-Zod) so they aren't silently swallowed
  throw e
}

// helper functions so call sites don't need to import the env object directly
export const isProd = () => env.APP_STAGE === 'production'
export const isDev = () => env.APP_STAGE === 'dev'
export const isTest = () => env.APP_STAGE === 'test'

export { env }
export default env
