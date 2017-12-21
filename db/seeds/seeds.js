exports.seed = async function(knex, Promise) {
  await knex('products').del();
  await knex('products').insert([
    {id: 1, name: 'Apple',  price: 25},
    {id: 2, name: 'Orange', price: 30},
    {id: 3, name: 'Banana', price: 15},
    {id: 4, name: 'Papaya', price: 50}
  ]);

  await knex('baskets').del();

  await knex('offers').del();
  await knex('offers').insert([
    {
      id: 1,
      buy_amount: 3,
      pay: 100,
      description: "3 papayas for the price of 2!",
      product_id: 4
    }
  ]);
};
