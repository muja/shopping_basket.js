const {App, expect} = require('./test');

const {Product, Offer} = require(App.model)(App);

describe('Offer', function() {
  it('applies the reduction correctly', async function() {
    let p = await Product.forge({
      price: 100
    }).save();

    // arbitrary offer: buy 5, pay 1 ct
    let offer = Offer.forge({
      buy_amount: 5,
      pay: 1,
      product_id: p.id
    });

    expect(await offer.apply(1)).to.be(100);
    expect(await offer.apply(2)).to.be(200);
    expect(await offer.apply(3)).to.be(300);
    expect(await offer.apply(4)).to.be(400);
    expect(await offer.apply(5)).to.be(1);
    expect(await offer.apply(6)).to.be(101);
    expect(await offer.apply(7)).to.be(201);
  });
});
