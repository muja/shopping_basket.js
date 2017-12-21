const {App, expect} = require('./test');

const {Basket, Product} = require(App.model)(App);

describe('Basket', function() {
  beforeEach(async function() {
    this.basket = await Basket.forge().save();
  });

  it('exists', function() {
    expect(this.basket).to.be.a(Basket);
  });

  it('can contain multiple items', async function() {
    await this.basket.add('Banana', 'Apple', 'Orange', 'Papaya');
    expect(this.basket.related('products')).to.have.length(4);
  });

  it('can contain an item multiple times', async function() {
    await this.basket.add('Banana', 'Banana', 'Banana');
    expect(this.basket.related('products')).to.have.length(3);
  });
});
