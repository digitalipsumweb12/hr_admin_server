import mysql from "mysql";

// ---------- [DATABASE CONNECTION] ------------

const db = mysql.createConnection({
  host: "",
  user: "",
  password: "",
  database: "",
});

export default db;