const App = {
  root: __dirname,
  environment: process.env.NODE_ENV || "development"
};

const Model = require('./src/model')(App);

Model.Product.forge().fetchAll({withRelated: ['offers']}).then(result => {
  result.models.forEach((e) => { console.log(e.related('offers').length) });
});
