const {App, expect} = require('./test');

const {Basket, Product} = require(App.model)(App);

async function addAllToBasket(basket, times = 1) {
  let {models} = await Product.fetchAll();
  for ( e of models )
    await basket.related('products').attach(Array(times).fill({product_id: e}));
  return models.length * times;
}

describe('Basket', function() {
  beforeEach(function() {
    this.basket = Basket.forge();
  });

  it('exists', function() {
    expect(this.basket).to.be.a(Basket);
  });

  it('can contain multiple items', async function() {
    let length = await addAllToBasket(this.basket);
    await this.basket.refresh();
    expect(this.basket.related('products')).to.have.length(length);
  });

  it('can contain an item multiple times', async function() {
    let length = await addAllToBasket(this.basket, 2);
    await this.basket.refresh();
    expect(this.basket.related('products')).to.have.length(length);
  });
});
