const items = require("../db/items");
const categories = require("../db/categories");

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const result = await items.getAll();
      res.json({ message: "Request Granted", items: result });
    } catch (err) {
      next(err);
    }
  },
  
  insert: async (req, res, next) => {
    try {
      const { name, type, price, quantity, src } = req.body;
      if (!name || !type || !price || !quantity || !src) {
        return res.status(400).json({ message: "The fields name, type, price, quantity, and src are all required" });
      }
      
      let id = type;
      
      if (typeof type !== "number") {
        const category = await categories.getByName(type);
        id = category.id;
      }
      
      const result = await items.insert(name, id, price, quantity, src);
      res.status(201).json({ message: "Successfully Created Item", item: result });
    } catch (err) {
      next(err);
    }
  },
  
  getByID: async (req, res, next) => {
    try {
      const id = req.params.id;
       if (!id) {
        return res.status(400).json({ message: "id must be provided" });
      }
      
      const result = await items.getByID(id);
      res.json({ message: "Request Granted", item: result });
    } catch (err) {
      next(err);
    }
  },
  
  deleteByID: async (req, res, next) => {
    try {
      const id = req.params.id;
       if (!id) {
        return res.status(400).json({ message: "id must be provided" });
      }
      
      await items.deleteByID(id);
      res.json({ message: "Successfully Deleted Item" });
    } catch (err) {
      next(err);
    }
  },
};