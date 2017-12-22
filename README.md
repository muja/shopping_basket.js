# Shopping basket

[![Travis Build Status](https://travis-ci.org/muja/shopping_basket.js.svg?branch=master)](https://travis-ci.org/muja/shopping_basket.js)

A little shopping basket application.

This app uses bookshelf, knex and sqlite3 to persist data.

## Installation

To use this application, you need to have **ES2017** installed (node v8.9.0+)
as it makes heavy use of the `async`/`await` pattern.

Clone this repository:

    git clone git@github.com:muja/shopping_basket.js.git

Then, change into the directory and install all dependencies:

    cd shopping_basket.js
    npm install

Now, you can either run the testsuite:

    npm test

Or use the CLI which simply adds the items from the arguments to the basket and prints a receipt:

    ./basket <item>...

This will implicitly run the [migrations](./db/migrations) and
fill the [seeds](./db/seeds) from the [db directory](./db).

For more information on the initially seeded data,
see the [requirements](./doc/requirements.md) document!
