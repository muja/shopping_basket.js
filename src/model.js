module.exports = (App) => {
  const bookshelf = require('./bookshelf')(App);

  // _ = asynchronous lodash
  // lo = synchronous lodash
  const {_, lo} = App;

  const Basket = bookshelf.Model.extend({
    tableName: 'baskets',
    products: function() {
      return this.belongsToMany(Product, 'basket_products');
    },

    /**
     * Add the given products to this basket.
     *
     * The items must **all** be of the same type, they can either be of type String,
     * which denotes their names, or of type Number denoting their ids, or directly of type Product.
     * In particular, this assertion should never fail:
     * `assert(_.every(productRefs, p => p.constructor === product.constructor))`
     *
     * @param  {[type]}    product     the first product
     * @param  {...[type]} productRefs the
     * @return {[type]}                [description]
     */
    add: async function(product, ...productRefs) {
      let all = Object.values(arguments);

      let products;
      if ( product.constructor === String ) {
         products = await Product.where('name', 'in', all).fetchAll();
      } else if ( product.constructor === Number ) {
         products = await Product.where('id', 'in', all).fetchAll();
      } else if ( product.constructor === Product ) {
        products = all;
      }

      let grouped = products.groupBy('name');
      for ( let e of all )
        await this.related('products').attach(grouped[e][0].id);
      return await this.refresh();
    },

    /**
     * Groups items in this basket by count and returns a list
     *
     * @return {Array<[Integer, Product]>} Returns an array containing a 2-element array,
     * containing the amount in the first and the Product in the second element.
     */
    list: async function(fetchOptions) {
      let products = await this.related('products').fetch(fetchOptions);
      let grouped = products.groupBy('id');
      return Object.keys(grouped).map(id => {
        return [grouped[id].length, grouped[id][0]]
      })
    },

    /**
     * Calculates the price of one position and returns it with the used offer.
     *
     * @param  {Integer} quantity                Quantity of the item in this position
     * @param  {Product} product                 the product that this position refers to
     * @return {{offer: Offer, price: Integer}}  the used offer and the lowest price
     */
    positionTotal: async function(quantity, product) {
      let offers = await product.related('offers').fetch();
      let priceWithoutOffer = quantity * product.attributes.price
      if ( offers.length > 0 ) {
        let grouped = await _.map(offers.models, async offer => ({
          offer: offer,
          price: await offer.apply(quantity)
        }));
        let offer = lo.minBy(grouped, e => e.price);
        if ( offer.price < priceWithoutOffer )
          return offer;
      }
      return {
        offer: null,
        price: priceWithoutOffer
      };
    },

    /**
     * Calculates the total price of this basket.
     *
     * @return {Integer} the total price of this basket in cents.
     */
    total: async function() {
      let list = await this.list();
      return _.reduce(list, async (sum, e) => sum + (await this.positionTotal(...e)).price, 0);
    },

    receiptTable: async function() {
      let list = await this.list();
      let items = await _.map(list, async e => {
        let qty = e[0];
        let attrs = e[1].attributes;
        let pos = await this.positionTotal(qty, e[1]);
        return [qty, attrs.name, pos.price, pos.offer ? pos.offer.attributes.description : null];
      });
      return items;
    },

    receipt: async function() {
      let table = await this.receiptTable();

      // we want column to pad to the right, except for the last one.
      let pad = [lo.padStart, lo.padStart, lo.padStart, lo.padEnd]
      table.unshift(["QTY", "ITEM", "TOTAL", "NOTE"]);

      // get max width for each column first
      let columns = lo.zip(...table);
      let widths = lo.map(columns,
        rows => lo.max(lo.map(rows, row => String(row).length))
      );

      // then pad every column according to max width
      let positions = lo.map(table, cols =>
        lo.map(lo.zip(cols, widths), (col, i) =>
          pad[i](col[0] === null ? '' : String(col[0]), col[1])
        ).join(" | ")
      );

      // add a final line below the table that lists the total price
      let width = positions[0].length;
      let totalString = "TOTAL: ";
      let total = lo.padStart(String(await this.total()), width - totalString.length);
      positions.push(""); // empty line
      positions.push(totalString + total);
      return positions.join("\n");
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
      return this.belongsTo(Product);
    },

    /**
     * Applies this offer's reduction rate to the quantity.
     *
     * @param  {Integer} count quantity of items (in a position)
     * @return {Integer} total price of the position using this offer
     */
    apply: async function(count) {
      let reduced = Math.floor(count / this.attributes.buy_amount);
      let normal = count % this.attributes.buy_amount;

      let total_price = reduced * this.attributes.pay;
      if ( normal != 0 ) {
        product = await this.related('product').fetch();
        total_price += normal * product.attributes.price;
      }
      return total_price;
    }
  });

  return {
    Basket: Basket,
    Product: Product,
    Offer: Offer
  };
}
