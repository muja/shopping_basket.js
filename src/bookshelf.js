module.exports = (App) => {
  const path = require('path');
  const config = require(path.join(App.root, 'knexfile'));
  const knex = require('knex')(config[App.environment]);
  return require('bookshelf')(knex);
};
