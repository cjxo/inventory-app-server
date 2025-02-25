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
    
    const { rows } = await pool.query(SQL, [name, type, price, quantity, src]);
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
};