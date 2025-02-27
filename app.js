const express = require("express");
const cors = require("cors");
const app = express();
const path = require("node:path");

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

app.post("/api/reset", async (req, res, next) => {
  try {
    await reset();
    res.json({ message: "Successfully Reseted State" });
  } catch (err) {
    next(err);
  }
});

app.use("/api/categories", categoriesRouter);
app.use("/api/items", itemsRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../inventory-app-client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../inventory-app-client", "dist", "index.html"));
  });
}

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
