const express = require("express");
const cors = require("cors");
const app = express();

const { defaultCategories, defaultItems, } = require("./utils/constants");
const pool = require("./db/pool");
const items = require("./db/items");
const categories = require("./db/categories");

const categoriesRouter = require("./routes/categories");
const itemsRouter = require("./routes/items");
const {
  requestLogger,
  unknownEndpoint,
  errorHandler,
} = require("./utils/middleware");

// parse requests with application/json Content-Type
app.use(express.json());
app.use(cors({ origin: ["http://localhost:5173"], }));
app.use(requestLogger);

app.post("/reset", async (req, res, next) => {
  await pool.query("DELETE FROM items;");
  await pool.query("DELETE FROM categories;");
  
  const cate = await Promise.all(defaultCategories.map(category => categories.insert(category.name, category.background_colour)));
  await Promise.all(defaultItems.map(item => items.insert(item.name, cate[item.type - 1].id, item.price, item.quantity, item.src)));
  
  res.json({ message: "Successfully Reseted State" });
});

app.use("/categories", categoriesRouter);
app.use("/items", itemsRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;