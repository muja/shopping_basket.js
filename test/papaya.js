const {App, expect} = require('./test')

const Product = require('../src/model')(App).Product;

function any(coll, f) {
  return coll.reduce((any, e) => any || f(e), false);
}

describe('Papaya', function() {
  beforeEach(async function() {
    this.papaya = await Product.where('name', 'Papaya').fetch({withRelated: ['offers']});
  });

  it('exists', function() {
    expect(this.papaya).to.be.a(Product);
  });

  it('costs 50', function() {
    expect(this.papaya.attributes.price).to.be(50);
  });

  it('offers 3 for the price of 2', function() {
    let offers = this.papaya.related('offers');
    let anyMatchingOffer = any(offers.models,
      e => e.attributes.buy_amount == 3 && e.attributes.pay == this.papaya.attributes.price * 2
    );
    expect(anyMatchingOffer).to.be(true);
  });
})
