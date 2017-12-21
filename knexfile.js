module.exports = {
  development: {
    useNullAsDefault: true,
    migrations: {
      directory: './db/migrations',
      tableName: 'knex_migrations'
    },
    seeds: { directory: './db/seeds' },
    client: 'sqlite3',
    connection: {
      filename: './db/development.sqlite3',
      charset: 'utf8'
    }
  }
};
