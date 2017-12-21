const commons = {
  useNullAsDefault: true,
  migrations: {
    directory: './db/migrations',
    tableName: 'knex_migrations'
  },
  seeds: { directory: './db/seeds' },
  client: 'sqlite3'
};

module.exports = {
  development: {
    ...commons,
    connection: {
      filename: './db/development.sqlite3',
      charset: 'utf8'
    }
  },
  test: {
    ...commons,
    connection: {
      filename: './db/test.sqlite3',
      charset: 'utf8'
    }
  }
};
