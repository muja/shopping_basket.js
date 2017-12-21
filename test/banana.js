const {App, expect} = require('./test');

const {Product} = require(App.model)(App);

describe('Banana', function() {
  beforeEach(async function() {
    this.banana = await Product.where('name', 'Banana').fetch();
  });

  it('exists', function() {
    expect(this.banana).to.be.a(Product);
  });

  it('costs 15', function() {
    expect(this.banana.attributes.price).to.be(15);
  });
});
