const { Client } = require("pg");
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

const defaultCategories = [
  { name: "uncategorized", background_colour: "#ffffff", },
  { name: "potion", background_colour: "#777ae6", },
  { name: "food", background_colour: "#e2b86c", },
  { name: "gems", background_colour: "#77e6a1", }
];

const defaultItems = [
  { name: "Blueberry", price: "$2.99", quantity: 14, type: 3, src: "./src/assets/textures/blueberry.png", },
  { name: "Tomato", price: "$1.99", quantity: 10, type: 3, src: "./src/assets/textures/tomato.png", },
  { name: "Ramen", price: "$10.99", quantity: 3, type: 3, src: "./src/assets/textures/ramen.png", },
  { name: "Health Potion", price: "$5.99", quantity: 6, type: 2, src: "./src/assets/textures/health-potion.png", },
  { name: "Speed Potion", price: "$5.99", quantity: 6, type: 2, src: "./src/assets/textures/speed-potion.png", },
  { name: "Luck Potion", price: "$5.99", quantity: 6, type: 2, src: "./src/assets/textures/luck-potion.png", },
  { name: "Poison Potion", price: "$5.99", quantity: 6, type: 2, src: "./src/assets/textures/poison-potion.png", },
  { name: "Diamond", price: "$1699.99", quantity: 4, type: 4,  src: "./src/assets/textures/diamond.png", },
  { name: "Ruby", price: "$999.99", quantity: 4, type: 4, src: "./src/assets/textures/ruby.png", },
];

const main = async () => {
  const client = new Client({
    connectionString: PG_CONNECTION_STRING,
  });
  
  await client.connect();
  
  if (ENV === "test") {
    await client.query(`
      DROP TABLE IF EXISTS items;
      DROP TABLE IF EXISTS categories;
    `);
  }
  
  await client.query(SQL);
  
  // populate
  if (ENV === "development") {
    //
    let insertStmnt;
    
    insertStmnt = `
      INSERT INTO categories (name, background_colour)
      VALUES 
    `;
    
    for (let index = 0;
         index < defaultCategories.length - 1;
         ++index) {
      insertStmnt += `('${defaultCategories[index].name}', '${defaultCategories[index].background_colour}'), `;
    }
    
    insertStmnt += `('${defaultCategories[defaultCategories.length - 1].name}', '${defaultCategories[defaultCategories.length - 1].background_colour}') ON CONFLICT DO NOTHING;`;
    await client.query(insertStmnt);
        
    insertStmnt = `
      INSERT INTO items (name, price, quantity, type, src)
      VALUES 
    `;
    
    for (let index = 0;
         index < defaultItems.length - 1;
         ++index) {
      const item = defaultItems[index];
      insertStmnt += `('${item.name}', '${item.price}', '${item.quantity}', '${item.type}', '${item.src}'), `;
    }
    
    insertStmnt += `('${defaultItems[defaultItems.length - 1].name}', '${defaultItems[defaultItems.length - 1].price}', '${defaultItems[defaultItems.length - 1].quantity}', '${defaultItems[defaultItems.length - 1].type}', '${defaultItems[defaultItems.length - 1].src}') ON CONFLICT DO NOTHING`;
    
    await client.query(insertStmnt);
    
    //console.log("DELETE: ", deleteStmnt);
    //console.log("INSERT: ", insertStmnt);
  }
  
  await client.end();
};

main();