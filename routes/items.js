const itemsRouter = require("express").Router();
const items = require("../controllers/items");
const multer = require("multer");
const upload = multer();
const fields = upload.fields([
  { name: "item-name", maxCount: 1 },
  { name: "item-category", maxCount: 1 },
  { name: "item-price", maxCount: 1 },
  { name: "item-quantity", maxCount: 1 },
  { name: "item-image", maxCount: 1 },
])

itemsRouter.get("/", items.getAll);
itemsRouter.get("/blob/:src", items.blob);
itemsRouter.post("/", fields, items.insert);
itemsRouter.get("/:id", items.getByID);
itemsRouter.delete("/:id", items.deleteByID);

module.exports = itemsRouter;