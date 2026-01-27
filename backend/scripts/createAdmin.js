const bcrypt = require("bcryptjs");
const { getPool } = require("../src/config/db");

(async () => {
  const username = "admin";
  const password = "admin123";
  const name = "Administrator";

  const pool = await getPool();

  // cek dulu biar tidak double
  const [existing] = await pool.query(
    "SELECT id FROM users WHERE username = ? LIMIT 1",
    [username]
  );

  if (existing.length) {
    console.log("Admin sudah ada. username:", username);
    process.exit(0);
  }

  const hash = await bcrypt.hash(password, 10);

  await pool.query(
    `INSERT INTO users (name, username, password_hash, role, is_active)
     VALUES (?, ?, ?, 'admin', 1)`,
    [name, username, hash]
  );

  console.log("ADMIN CREATED → username: admin | password: admin123");
  process.exit(0);
})();
