// =========================================================================
// SOTO SYSTEM ERP - SCRIPT DE PURGA INDEPENDIENTE NATIVO EN JAVASCRIPT
// Ubicación: raíz_proyecto_pc/purgar.js
// =========================================================================
const { Client } = require('pg');

// 🚀 CADENA DE CONEXIÓN PURA Y LIMPIA SIN CARACTERES EXTRAÑOS
const connectionString = "postgresql://postgres:nPYWxvHGDZHhWbtdBJBKOPreJcoSEweG@sakura.proxy.rlwy.net:58280/railway";

const client = new Client({
  connectionString: connectionString,
});

async function ejecutarPurgaTotal() {
  try {
    await client.connect();
    console.log("📡 [SOTO NET]: Conexión exitosa a PostgreSQL en Railway. Iniciando purga...");

    // 🚀 1. BORRAMOS LOS ARROCES HUÉRFANOS (Buscamos coincidencias en la tabla)
    // Nota: Cambia 'bodega_producto' por el nombre real de tu tabla si Django la nombró distinto
    const queryArroz = "DELETE FROM bodega_producto WHERE nombre ILIKE '%Arroz Inarma%' OR nombre ILIKE '%Arroz Yaracuy%';";
    const resArroz = await client.query(queryArroz);
    console.log(`✅ Arroces fantasmas eliminados. Filas afectadas: ${resArroz.rowCount}`);

    // 🚀 2. REORDENAMIENTO DE LA LECHE EN LA CASILLA 8
    // Borramos la leche vieja que está duplicada e interfiriendo con el Refresco Golden, conservando solo tu nuevo SKU 054
    const queryLeche = "DELETE FROM bodega_producto WHERE nombre ILIKE '%Leche Amanecer 400g%' AND sku != 'LEC-AMA-054';";
    const resLeche = await client.query(queryLeche);
    console.log(`✅ Duplicados de Leche Amanecer 400g removidos. Filas afectadas: ${resLeche.rowCount}`);

    // 🚀 3. CONFIRMACIÓN FINANCIERA
    const resTotal = await client.query("SELECT COUNT(*) FROM bodega_producto;");
    console.log(`📊 [SOTO DATABASE SUCCESS]: Saneamiento completado. Quedan exactamente ${resTotal.rows[0].count} productos activos.`);

  } catch (err) {
    console.error("❌ [SOTO CRITICAL ERROR]: Falló la inyección SQL de purga:", err.message);
  } finally {
    await client.end();
  }
}

ejecutarPurgaTotal();
