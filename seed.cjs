const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Configuración de conexión (Asegúrate de poner tu contraseña real aquí)
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'apio_bodega',
  password: 'Daniela.14',
  port: 5433,
});

async function seed() {
  const client = await pool.connect();
  try {
    console.log('--- Iniciando carga de datos en Apio B2B ---');

    // 1. Crear tabla si no existe
    await client.query(`
      CREATE TABLE IF NOT EXISTS productos (
        id SERIAL PRIMARY KEY,
        sku VARCHAR(50) UNIQUE NOT NULL,
        nombre VARCHAR(255) NOT NULL,
        precio_usd DECIMAL(10, 2) NOT NULL,
        stock INT NOT NULL,
        categoria VARCHAR(100) NOT NULL
      );
    `);

    // 2. Leer archivo (usamos la variable global __dirname directamente)
    const filePath = path.join(__dirname, 'bodega', 'untas.json');
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const productos = JSON.parse(rawData);

    // 3. Inserción
    for (const prod of productos) {
      await client.query(
        `INSERT INTO productos (sku, nombre, precio_usd, stock, categoria)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (sku) DO NOTHING;`,
        [prod.sku, prod.nombre, prod.precio_usd, prod.stock, prod.categoria]
      );
    }
    console.log(`¡Éxito! Se procesaron ${productos.length} productos.`);
  } catch (err) {
    console.error('Error en el proceso:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
