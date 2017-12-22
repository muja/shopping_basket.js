module.exports = (App) => {
  const {Basket} = require(App.model)(App);

  return {
    launch: async (name, argv) => {
      if ( argv.length === 0 ) {
        console.log(`Usage: ${name} <item>...`);
        process.exit(1);
      }
      const knex = require('./bookshelf')(App).knex;
      await knex.migrate.latest();
      await knex.seed.run();
      basket = await Basket.forge({}).save();
      try {
        await basket.add(...argv);
        console.log(await basket.receipt());
      } catch (e) {
        console.log(String(e));
        process.exit(1);
      }
    }
  }
}
