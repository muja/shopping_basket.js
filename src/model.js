module.exports = (App) => {
  const bookshelf = require('./bookshelf')(App);

  const Basket = bookshelf.Model.extend({
    tableName: 'users',
    products: function() {
      return this.belongsToMany(Product, basket_products);
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
