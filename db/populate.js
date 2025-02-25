const pool = require("./pool");
const items = require("./items");
const categories = require("./categories");
const { defaultCategories, defaultItems } = require("../utils/constants");
const { PG_CONNECTION_STRING, ENV } = require("../utils/config");

const SQL = `
  CREATE TABLE IF NOT EXISTS categories (
    id                     INTEGER           PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name                   VARCHAR(255)      UNIQUE NOT NULL,
    background_colour      VARCHAR(8)        NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS items (
    id            INTEGER           PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name          VARCHAR(255)      UNIQUE NOT NULL,
    price         VARCHAR(16)       NOT NULL,
    quantity      INTEGER           NOT NULL CHECK(quantity >= 0),
    type          INTEGER           REFERENCES categories (id),
    src           VARCHAR(255)      NOT NULL
  );
`;

const main = async () => {
  const client = pool;
  
  if (ENV === "test") {
    await client.query(`
      DROP TABLE IF EXISTS items;
      DROP TABLE IF EXISTS categories;
    `);
  }
  
  await client.query(SQL);
  
  // populate
  if (ENV === "development") {    
    const cate = await Promise.all(defaultCategories.map(category => categories.insert(category.name, category.background_colour)));
    await Promise.all(defaultItems.map(item => items.insert(item.name, cate[item.type - 1].id, item.price, item.quantity, item.src)));
  }
  
  await pool.end();
};

main();