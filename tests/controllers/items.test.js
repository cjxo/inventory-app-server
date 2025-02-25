const {
  test,
  after,
  describe,
  beforeEach,
  afterEach,
} = require("node:test");

const assert = require("node:assert");
const pool = require("../../db/pool");
const items = require("../../db/items");
const categories = require("../../db/categories");
const supertest = require("supertest");
const app = supertest(require("../../app"));

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

const defaultCategories = [
  { name: "uncategorized", background_colour: "#ffffff", },
  { name: "potion", background_colour: "#777ae6", },
  { name: "food", background_colour: "#e2b86c", },
  { name: "gems", background_colour: "#77e6a1", }
];

describe("Items Route", (ctx) => {
  let cate;
  beforeEach(async () => {
    cate = await Promise.all(
      defaultCategories.map(category => categories.insert(category.name, category.background_colour))
    );
    
    await Promise.all(
      defaultItems.map(item => items.insert(item.name, cate[item.type - 1].id, item.price, item.quantity, item.src))
    );
  });
  
  afterEach(async () => {
    await pool.query("DELETE FROM items;");
    await pool.query("DELETE FROM categories;");
  });
  
  test("getAll items should be returned as json", async () => {
    const response = await app
      .get("/items")
      .expect(200)
      .expect("Content-Type", /application\/json/);
      
    assert.ok(response.body.message === "Request Granted");
  });
  
  test("item insertion", async () => {
    const response = await app.get("/items");
    const oldItems = response.body.items;
    
    const newItem = (await app
      .post("/items")
      .send({ name: "Jam", price: "$3.99", quantity: 9, type: cate[2].id, src: "src" })
      .expect(201)
      .expect("Content-Type", /application\/json/)).body.item;
      
    assert.ok(newItem.name === "Jam");
    assert.ok(newItem.price === "$3.99");
    assert.ok(newItem.quantity === 9);
    assert.ok(newItem.type === cate[2].id);
    assert.ok(newItem.src === "src");
      
    const newResponse = await app.get("/items");
    const newItems = newResponse.body.items;
    
    assert.ok(newItems.length === (oldItems.length + 1));
  });
  
  test("fails 400 when one of the fields are undefined", async () => {
    await app
      .post("/items")
      .send({})
      .expect(400)
      .expect({ message: "The fields name, type, price, quantity, and src are all required" });
      
    await app
      .post("/items")
      .send({ name: "Hey" })
      .expect(400)
      .expect({ message: "The fields name, type, price, quantity, and src are all required" });
      
    await app
      .post("/items")
      .send({ type: 1 })
      .expect(400)
      .expect({ message: "The fields name, type, price, quantity, and src are all required" });
      
    await app
      .post("/items")
      .send({ price: "$4.99" })
      .expect(400)
      .expect({ message: "The fields name, type, price, quantity, and src are all required" });
      
    await app
      .post("/items")
      .send({ quantity: 6 })
      .expect(400)
      .expect({ message: "The fields name, type, price, quantity, and src are all required" });
      
    await app
      .post("/items")
      .send({ src: "buffer" })
      .expect(400)
      .expect({ message: "The fields name, type, price, quantity, and src are all required" });
  });
  
  test("can get a specific item given id", async () => {
    const response = await app.get("/items");
    const items = response.body.items;
    
    for (item of items) {
      await app
        .get(`/items/${item.id}`)
        .expect(200)
        .expect("Content-Type", /application\/json/)
        .expect({ message: "Request Granted", item });
    }
  });
  
  test("deleting an item", async () => {
    const items = (await app.get("/items")).body.items;
    
    await app
      .delete(`/items/${items[0].id}`)
      .expect(200)
      .expect({ message: "Successfully Deleted Item" });
      
    const newItems = (await app.get("/items")).body.items;
    assert.notDeepStrictEqual(items, newItems);
    assert.ok(items.length === (newItems.length + 1));
  });
});

after(async () => {
  await pool.end();
});