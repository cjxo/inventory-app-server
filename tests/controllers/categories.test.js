const {
  test,
  after,
  describe,
  beforeEach,
  afterEach,
} = require("node:test");

const assert = require("node:assert");
const pool = require("../../db/pool");
const categories = require("../../db/categories");
const supertest = require("supertest");
const app = supertest(require("../../app"));

const defaultCategories = [
  { name: "uncategorized", background_colour: "#ffffff", },
  { name: "potion", background_colour: "#777ae6", },
  { name: "food", background_colour: "#e2b86c", },
  { name: "gems", background_colour: "#77e6a1", }
];

describe("Categories Route", () => {
  beforeEach(async () => {
    await Promise.all(defaultCategories.map(category => categories.insert(category.name, category.background_colour)));
  });
  
  afterEach(async () => {
    await pool.query("DELETE FROM categories;");
  });
  
  test("categories are returned as json", async () => {
    await app
      .get("/categories")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("inserting a category", async () => {
    const response = await app.get("/categories");
    assert.strictEqual(response.body.categories.length, defaultCategories.length);
    
    const newCategory = { name: "weapon", background_colour: "#888888" };
    
    const newCategoryResponse = await app
      .post("/categories")
      .send(newCategory)
      .expect(201)
      .expect("Content-Type", /application\/json/);
    
    assert.strictEqual(newCategoryResponse.body.message, "Successfully Created Category");
    assert.strictEqual(newCategoryResponse.body.category.name, newCategory.name);
    assert.strictEqual(newCategoryResponse.body.category.background_colour, newCategory.background_colour);
    
    const newResponse = await app.get("/categories");
    assert.strictEqual(newResponse.body.categories.length, defaultCategories.length + 1);
    assert.ok(newResponse.body.categories.some(category => {
      return ((category.name === newCategoryResponse.body.category.name) &&
              (category.background_colour === newCategoryResponse.body.category.background_colour));
    }));
  });
  
  test("category name should be stored as lowercase", async () => {
    const newCategory = { name: "WEaPoN", background_colour: "#888888" };
    const response = await app
      .post("/categories")
      .send(newCategory)
      .expect(201)
      .expect("Content-Type", /application\/json/);
      
    assert.ok(response.body.category.name === "weapon");
  });
  
  test("fails 409 if category name already exists", async () => {
    await app
      .post("/categories")
      .send({ name: "uncategorized", background_colour: "#999999" })
      .expect(409)
      .expect("Content-Type", /application\/json/)
      .expect({ message: "Category name 'uncategorized' already exists" });
  });
  
  test("can get a specific category given id", async () => {
    const response = await app.get("/categories");
    
    for (const category of response.body.categories) {
      await app
        .get(`/categories/${category.id}`)
        .expect(200)
        .expect("Content-Type", /application\/json/)
        .expect({ message: "Request Granted", category });
    }
  });
  
  test("inserting a category without a name or background_colour or both must fail 400", async () => {
    const initCategories = (await app.get("/categories")).body.categories;
    
    await app
        .post("/categories")
        .send({})
        .expect("Content-Type", /application\/json/)
        .expect(400);
    
    await app
        .post("/categories")
        .send({ name: "Hey" })
        .expect("Content-Type", /application\/json/)
        .expect(400);
        
    await app
        .post("/categories")
        .send({ background_colour: "Hey" })
        .expect("Content-Type", /application\/json/)
        .expect(400);
    
    const newCategories = (await app.get("/categories")).body.categories;
    
    assert.deepStrictEqual(initCategories, newCategories);
  });
  
  test("deleting a category", async () => {
    const initCategories = (await app.get("/categories")).body.categories;
    const categoryToDelete = initCategories[0];
    await app
      .delete(`/categories/${categoryToDelete.id}`)
      .expect(200)
      .expect({ message: "Successfully Deleted Category" })
    
    const newCategories = (await app.get("/categories")).body.categories;
    assert.notDeepStrictEqual(initCategories, newCategories);
    assert.ok(!newCategories.some(category => (category.name === categoryToDelete.name) && (category.background_colour === categoryToDelete.background_colour)));
  });
});

after(async () => {
  await pool.end();
});