const path = require('path');

let approot = path.dirname(__dirname);

const lodash = require('lodash')
const _ = require('aigle');
_.mixin(lodash);

const App = {
  root: approot,
  model: path.join(approot, "src/model"),
  environment: "test",
  _: _,
  lo: lodash
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
