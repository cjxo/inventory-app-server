const { defaultCategories, defaultItems, resetSQL, initSQL } = require("../utils/constants");
const { ENV } = require("../utils/config");
const pool = require("./pool");
const items = require("./items");
const categories = require("./categories");

const reset = async () => {
  await pool.query(resetSQL);
  
  const cate = await Promise.all(defaultCategories.map(category => categories.insert(category.name, category.background_colour)));
  await Promise.all(defaultItems.map(item => items.insert(item.name, cate[item.type - 1].id, item.price, item.quantity, item.src)));
};

const resetWithoutDropping = async () => {
  await pool.query(initSQL);
  
  const cate = await Promise.all(defaultCategories.map(category => categories.insert(category.name, category.background_colour)));
  await Promise.all(defaultItems.map(item => items.insert(item.name, cate[item.type - 1].id, item.price, item.quantity, item.src)));
};

module.exports = {
  reset,
  resetWithoutDropping,
};