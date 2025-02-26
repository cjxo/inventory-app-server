const categories = require("../db/categories");
const items = require("../db/items");

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const result = await categories.getAll();
      res.json({ message: "Request Granted", categories: result });
    } catch (err) {
      next(err);
    }
  },
  
  insert: async (req, res, next) => {
    try {
      const { name, background_colour } = req.body;
      
      if (!name || !background_colour) {
        return res.status(400).json({ message: "name and background_colour must be provided" });
      }
      
      const namePrime = name.toLowerCase();
      const exists = await categories.getByName(namePrime);
      if (exists) {
        return res.status(409).json({ message: `Category name '${namePrime}' already exists` });
      }
            
      const result = await categories.insert(namePrime, background_colour);
      res.status(201).json({ message: "Successfully Created Category", category: result });
    } catch (err) {
      next(err);
    }
  },
  
  getByID: async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "id must be provided" });
      }
      
      let newID = parseInt(id);
      
      if (!newID) {
        const category = await categories.getByName(id);
        newID = category.id;
      }

      const result = await categories.getByID(newID);
      res.json({ message: "Request Granted", category: result });
    } catch (err) {
      next(err);
    }
  },
  
  deleteByID: async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "id must be provided" });
      }
      
      let newID = parseInt(id);
      let category;
      
      if (!newID) {
        category = await categories.getByName(id);
        newID = category.id;
      } else {
        category = await categories.getByID(newID);
      }
      
      if (category.name === "uncategorized") {
        return res.status(403).json({ message: "'uncategorized' is not allowed to be deleted" });
      }
      
      const uncategorized = await categories.getByName("uncategorized");
      await items.changeItemCategoryFromCategoryIDToNewCategoryID(newID, uncategorized.id);
      
      const result = await categories.deleteByID(newID);
      res.status(200).json({ message: "Successfully Deleted Category" });
    } catch (err) {
      next(err);
    }
  },
};