
exports.up = (knex, Promise) => {
  return knex.schema.createTable('baskets', basket => {

      basket.increments();

      basket.timestamps();

    }).createTable('products', product => {

      product.increments();
      product.string('name', 64).unique();
      product.integer('price').notNullable(); // in cts

      product.timestamps();

    }).createTable('offers', offer => {

      offer.increments();
      // amount: whole number
      offer.integer('buy_amount').notNullable();
      // price: ct
      offer.integer('pay').notNullable();
      offer.string('description', 256);
      offer.integer('product_id').references('id').inTable('products');

      offer.timestamps();

    }).createTable('basket_products', bp => {

      bp.increments();
      bp.integer('basket_id').references('id').inTable('baskets');
      bp.integer('product_id').references('id').inTable('products');

      bp.timestamps();

    });
};

exports.down = (knex, Promise) => {
  return knex.schema
    .dropTableIfExists( 'basket_products' )
    .dropTableIfExists( 'baskets' )
    .dropTableIfExists( 'products' )
    .dropTableIfExists( 'offers' );
};
