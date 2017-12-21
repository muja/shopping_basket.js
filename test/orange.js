const {App, expect} = require('./test');

const {Product} = require(App.model)(App);

describe('Orange', function() {
  beforeEach(async function() {
    this.orange = await Product.where('name', 'Orange').fetch();
  });

  it('exists', function() {
    expect(this.orange).to.be.a(Product);
  });

  it('costs 30', function() {
    expect(this.orange.attributes.price).to.be(30);
  });
});
