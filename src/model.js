module.exports = (App) => {
  const bookshelf = require('./bookshelf')(App);

  const Basket = bookshelf.Model.extend({
    tableName: 'baskets',
    products: function() {
      return this.belongsToMany(Product, 'basket_products');
    },
    add: async function(...productNames) {
      let products = await Product.where('name', 'in', productNames).fetchAll();
      let grouped = products.groupBy('name');
      for ( e of productNames )
        await this.related('products').attach(grouped[e][0].id);
      return await this.refresh();
    }
  });

  const Product = bookshelf.Model.extend({
    tableName: 'products',
    offers: function() {
      return this.hasMany(Offer);
    },
    baskets: function() {
      return this.belongsToMany(Basket, 'basket_products');
    }
  });

  const Offer = bookshelf.Model.extend({
    tableName: 'offers',
    product: function() {
      return this.belongsTo(Product)
    }
  });

  return {
    Basket: Basket,
    Product: Product,
    Offer: Offer
  }
}
