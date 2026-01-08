import 'dotenv/config'
import knex from 'knex'
import type { Knex } from 'knex'
import { env } from './env.js'

export const knexConfig: Knex.Config = {
  client: env.DATABASE_CLIENT,
  connection: env.DATABASE_CLIENT === 'sqlite3' 
    ? {
      filename: env.DATABASE_URL,
    } 
    : env.DATABASE_URL,
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations/',
  },
}

export const db = knex(knexConfig)
