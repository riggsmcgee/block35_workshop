const express = require('express');
const app = express();
const port = 3000;
const pg = require('pg');
const client = new pg.Client('postgres://localhost:5432/block34');

async function connect() {
  await client.connect();
}

app.use(express.json());

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
// fetchUsers
app.get('/users', async (req, res) => {
  const result = await client.query('SELECT * FROM users');
  console.table(result.rows);
  res.send(result.rows);
});
// fetchTables
app.get('/tables', async (req, res) => {
  const result = await client.query('SELECT * FROM tables');
  console.table(result.rows);
  res.send(result.rows);
});

// createUser
app.post('/users', async (req, res) => {
  const { name, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await client.query(
    'INSERT INTO users (name, hashedPassword) VALUES ($1, $2) RETURNING *',
    [name, hashedPassword]
  );
  res.json(result.rows);
});

// createTable
app.post('/tables', async (req, res) => {
  const { name } = req.body;
  const result = await client.query(
    'INSERT INTO tables (name) VALUES ($1) RETURNING *',
    [name]
  );
});

// createProduct
app.post('/products', async (req, res) => {
  const { name } = req.body;
  const result = await client.query(
    'INSERT INTO products (name) VALUES ($1) RETURNING *',
    [name]
  );
  res.json(result.rows);
});

// fetchProducts
app.get('/products', async (req, res) => {
  const result = await client.query('SELECT * FROM products');
  console.table(result.rows);
  res.send(result.rows);
});

// fetchFavorites
app.get('/favorites', async (req, res) => {
  const result = await client.query('SELECT * FROM favorites');
  console.table(result.rows);
  res.send(result.rows);
});

// createFavorites
app.post('/favorites', async (req, res) => {
  const { user_id, product_id } = req.body;
  const result = await client.query(
    'INSERT INTO reservations (user_id, product_id) VALUES ($1, $2) RETURNING *',
    [user_id, product_id]
  );
  res.json(result.rows);
});

// destroyFavortites
app.delete('/favorites/:id', async (req, res) => {
  const { id } = req.params;
  const result = await client.query(
    'DELETE FROM favorites WHERE id = $1 RETURNING *',
    [id]
  );
});

connect();
