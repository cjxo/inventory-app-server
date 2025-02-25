const {
  test,
  after,
  describe,
  beforeEach,
  afterEach,
} = require("node:test");

const assert = require("node:assert");
const pool = require("../../db/pool");
const { reset } = require("../../db/reset");
const items = require("../../db/items");
const categories = require("../../db/categories");
const supertest = require("supertest");
const app = supertest(require("../../app"));

describe("Items Route", (ctx) => {
  let cate;
  beforeEach(async () => {
    await reset();
    cate = await categories.getAll();
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