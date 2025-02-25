const defaultCategories = [
  { name: "potion", background_colour: "#777ae6", },
  { name: "food", background_colour: "#e2b86c", },
  { name: "gems", background_colour: "#77e6a1", },
  { name: "weapons", background_colour: "#77e6a1", },
];

const defaultItems = [
  { name: "Blueberry", price: "$2.99", quantity: 14, type: 2, src: "./src/assets/textures/blueberry.png", },
  { name: "Tomato", price: "$1.99", quantity: 10, type: 2, src: "./src/assets/textures/tomato.png", },
  { name: "Ramen", price: "$10.99", quantity: 3, type: 2, src: "./src/assets/textures/ramen.png", },
  { name: "Health Potion", price: "$5.99", quantity: 6, type: 1, src: "./src/assets/textures/health-potion.png", },
  { name: "Speed Potion", price: "$5.99", quantity: 6, type: 1, src: "./src/assets/textures/speed-potion.png", },
  { name: "Luck Potion", price: "$5.99", quantity: 6, type: 1, src: "./src/assets/textures/luck-potion.png", },
  { name: "Poison Potion", price: "$5.99", quantity: 6, type: 3, src: "./src/assets/textures/poison-potion.png", },
  { name: "Diamond", price: "$1699.99", quantity: 4, type: 3,  src: "./src/assets/textures/diamond.png", },
  { name: "Ruby", price: "$999.99", quantity: 4, type: 3, src: "./src/assets/textures/ruby.png", },
];

const resetSQL = `
  DROP TABLE IF EXISTS items;
  DROP TABLE IF EXISTS categories;
      
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
  
  INSERT INTO categories
  (name, background_colour)
  VALUES ('uncategorized', '#FFFFFF')
  ON CONFLICT DO NOTHING;
`;

const initSQL = `
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
  
  INSERT INTO categories
  (name, background_colour)
  VALUES ('uncategorized', '#FFFFFF')
  ON CONFLICT DO NOTHING;
`;

module.exports = {
  defaultCategories,
  defaultItems,
  resetSQL,
  initSQL,
};