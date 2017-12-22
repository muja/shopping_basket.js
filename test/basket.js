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

  it('calculates its total price', async function() {
    await this.basket.add('Banana', 'Banana', 'Banana', 'Apple', 'Apple');
    expect(await this.basket.total()).to.be(95);
  });

  it('calculates its total price, taking into account offers', async function() {
    await this.basket.add('Papaya', 'Papaya', 'Papaya', 'Apple', 'Apple');
    expect(await this.basket.total()).to.be(150);
  });

  it('calculates its total price, taking into account offers pt. 2', async function() {
    await this.basket.add(
      'Papaya',
      'Papaya',
      'Papaya',
      'Papaya',
      'Papaya',
      'Papaya',
      'Papaya',
      'Papaya',
      'Papaya', // 11 papayas: 2 full price, 9 reduced to price of 6
      'Papaya', // => 2*50 + 6*50
      'Papaya', // = 400
      'Apple',
      'Apple',
      'Apple',
      'Apple', // 4 apples: 4*25 = 100
      'Banana',
      'Banana',
      'Banana',
      'Banana',
      'Banana', // 5 bananas: 5 * 15 = 75
      'Orange', // 1 orange: 30
    );
    expect(await this.basket.total()).to.be(400 + 100 + 75 + 30);
  });
});
