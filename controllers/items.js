const items = require("../db/items");
const categories = require("../db/categories");
const { storage } = require("../utils/supabase");

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const result = await items.getAll();
      res.json({ message: "Request Granted", items: result });
    } catch (err) {
      next(err);
    }
  },
  
  blob: async (req, res, next) => {
    const src = req.params.src;
    //console.log(src);
    const { error, data } = await storage.download(src);
    res.setHeader("Content-Type", data.type);
    const arrayBuffer = await data.arrayBuffer();
    res.send(Buffer.from(arrayBuffer));
  },
  
  insert: async (req, res, next) => {
    try {
      //const { name, type, price, quantity, src } = req.body;      
      const name = req.body["item-name"];
      const type = req.body["item-category"];
      const price = parseFloat(req.body["item-price"]);
      const quantity = req.body["item-quantity"];
      const image = req.files["item-image"][0];
      const buffer = image.buffer;
      const src = image.originalname;
      
      if (!name || !type || !price || !quantity || !image) {
        return res.status(400).json({ message: "The fields item-name, item-category, item-price, item-quantity, and item-image are all required as FormData" });
      }
      
      const possibleExistence = await items.getByName(name);
      if (possibleExistence) {
        return res.status(400).json({ message: `Item name '${name}' already exists` });
      }
      
      const { error, data } = await storage.upload(src, buffer);
      if (error) {
        return res.status(parseInt(error.statusCode)).json({ message: error.message });
      }
      
      let id = parseInt(type);
      
      if (!id) {
        const category = await categories.getByName(type);
        id = category.id;
      }
      
      const result = await items.insert(name, id, `$${price.toFixed(2)}`, quantity, src);
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