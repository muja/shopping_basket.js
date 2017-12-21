const App = {
  root: require('path').dirname(__dirname),
  environment: "test"
}

const expect = require('expect.js');

before(async function() {
  const knex = require('../src/bookshelf')(App).knex;
  await knex.migrate.latest();
  await knex.seed.run();
});

module.exports = {
  App: App,
  expect: expect
}
