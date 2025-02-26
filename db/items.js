const pool = require("./pool");

module.exports = {
  getAll: async () => {
    const SQL = `
      SELECT items.*, categories.name AS type_name FROM items
      INNER JOIN categories
        ON categories.id = items.type;
    `;
    
    const { rows } = await pool.query(SQL);
    return rows;
  },
  
  insert: async (name, type, price, quantity, src) => {
    const SQL = `
      INSERT INTO items
      (name, type, price, quantity, src)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    
    const SQL_SELECT = `
      SELECT items.*, categories.name AS type_name FROM items
      INNER JOIN categories
        ON categories.id = items.type
      WHERE items.id = $1;
    `;
    
    const insertedResult = await pool.query(SQL, [name, type, price, quantity, src]);
    console.log()
    const { rows } = await pool.query(SQL_SELECT, [insertedResult.rows[0].id]);
    return rows[0];
  },
  
  getByID: async (id) => {
    const SQL = `
      SELECT items.*, categories.name AS type_name FROM items
      INNER JOIN categories
        ON categories.id = items.type
      WHERE items.id = $1;
    `;
    
    const { rows } = await pool.query(SQL, [id]);
    return rows[0];
  },
  
  deleteByID: async (id) => {
    const SQL = `
      DELETE FROM items
      WHERE id = $1;
    `;
    
    await pool.query(SQL, [id]);
  },
  
  getByCategoryID: async (categoryID) => {
    const SQL = `
      SELECT items.*, categories.name AS type_name FROM items
      INNER JOIN categories
        ON categories.id = items.type
      WHERE items.type = $1;
    `;
    
    const { rows } = await pool.query(SQL, [categoryID]);
    return rows;
  },

  changeItemCategoryFromCategoryIDToNewCategoryID: async (categoryID, newCategoryID) => {
    const SQL = `
      UPDATE items
      SET type = $2
      WHERE type = $1;
    `;
    
    await pool.query(SQL, [categoryID, newCategoryID]);
  },
  
  getByName: async (name) => {
    const SQL = `
      SELECT items.*, categories.name AS type_name FROM items
      INNER JOIN categories
        ON categories.id = items.type
      WHERE items.name = $1;
    `;
    
    const { rows } = await pool.query(SQL, [name]);
    return rows[0];
  },
};