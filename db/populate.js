const pool = require("./pool");
const { reset, resetWithoutDropping } = require("./reset");
const { ENV } = require("../utils/config");

const main = async () => {
  if (ENV !== "production") {
    console.log("Dev Build");
    try {
      await reset();
    } catch (err) {
    }
  } else {
    console.log("Production Build");
    await resetWithoutDropping();
  }
  
  await pool.end();
};

main();