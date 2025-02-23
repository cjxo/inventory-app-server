const express = require("express");
const cors = require("cors");
const app = express();

const categoriesRouter = require("./routes/categories");
//const itemsRouter = require("./routes/items");
const {
  requestLogger,
  unknownEndpoint,
  errorHandler,
} = require("./utils/middleware");

// parse requests with application/json Content-Type
app.use(express.json());
app.use(cors({ origin: ["http://localhost:5173"], }));
app.use(requestLogger);

app.use("/categories", categoriesRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;