const pool = require("./pool");

module.exports = {
  getAll: async () => {
    const SQL = `
      SELECT * FROM categories;
    `;
    
    const { rows } = await pool.query(SQL);
    return rows;
  },
  
  insert: async (name, background_colour) => {
    const SQL = `
      INSERT INTO categories (name, background_colour)
      VALUES ($1, $2)
      RETURNING *;
    `;
    
    const { rows } = await pool.query(SQL, [name, background_colour]);
    return rows[0];
  },
  
  getByName: async (name) => {
    const SQL = `
      SELECT * FROM categories
      WHERE name = $1;
    `;
    
    const { rows } = await pool.query(SQL, [name]);
    return rows[0];
  },
  
  getByID: async (id) => {
    const SQL = `
      SELECT * FROM categories
      WHERE id = $1;
    `;
    
    const { rows } = await pool.query(SQL, [id]);
    return rows[0];
  },
  
  deleteByID: async (id) => {
    const SQL = `
      DELETE FROM categories
      WHERE id = $1;
    `;
    
    await pool.query(SQL, [id]);
  },
};