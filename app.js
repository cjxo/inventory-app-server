const express = require("express");
const cors = require("cors");
const app = express();

const { reset } = require("./db/reset");

const categoriesRouter = require("./routes/categories");
const itemsRouter = require("./routes/items");
const {
  requestLogger,
  unknownEndpoint,
  errorHandler,
} = require("./utils/middleware");

// parse requests with application/json Content-Type
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: ["http://localhost:5173"], }));
app.use(requestLogger);

app.post("/reset", async (req, res, next) => {
  try {
    await reset();
    res.json({ message: "Successfully Reseted State" });
  } catch (err) {
    next(err);
  }
});

app.use("/categories", categoriesRouter);
app.use("/items", itemsRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;