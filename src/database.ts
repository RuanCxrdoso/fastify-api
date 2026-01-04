import 'dotenv/config'
import knex from 'knex'
import type { Knex } from 'knex'

export const knexConfig: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: process.env.DATABASE_URL,
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations/',
  },
}

export const db = knex(knexConfig)
