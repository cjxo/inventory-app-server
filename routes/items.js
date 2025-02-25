const itemsRouter = require("express").Router();
const items = require("../controllers/items");

itemsRouter.get("/", items.getAll);
itemsRouter.post("/", items.insert);
itemsRouter.get("/:id", items.getByID);
itemsRouter.delete("/:id", items.deleteByID);

module.exports = itemsRouter;