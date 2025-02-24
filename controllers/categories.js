const categories = require("../db/categories");

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
      
      const result = await categories.getByID(id);
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
      
      const result = await categories.deleteByID(id);
      res.status(200).json({ message: "Successfully Deleted Category" });
    } catch (err) {
      next(err);
    }
  },
};