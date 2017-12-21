const {App, expect} = require('./test')

const Product = require('../src/model')(App).Product;

describe('Apple', function() {
  beforeEach(async function() {
    this.apple = await Product.where('name', 'Apple').fetch();
  });

  it('exists', function() {
    expect(this.apple).to.be.a(Product);
  });

  it('costs 25', function() {
    expect(this.apple.attributes.price).to.be(25);
  });
})
