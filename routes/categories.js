const categoriesRouter = require("express").Router();
const categories  = require("../controllers/categories");

categoriesRouter.get("/", categories.getAll);
categoriesRouter.post("/", categories.insert);
categoriesRouter.get("/:id", categories.getByID);
categoriesRouter.delete("/:id", categories.deleteByID);

module.exports = categoriesRouter;