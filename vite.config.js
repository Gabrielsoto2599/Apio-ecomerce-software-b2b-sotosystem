// =========================================================================
// SOTO SYSTEM VITE ARCHITECTURE - RUNTIME DE RUTAS RELATIVAS (COMMONJS)
// Ubicación: Ecomerce_B2B_Apio/vite.config.js
// =========================================================================

// 🚀 REGLA DE ORO SOTO SYSTEM: Forzamos el empaquetado usando rutas relativas (./)
// Usamos el formato nativo module.exports para que Node lo lea sin colapsar en la terminal
module.exports = {
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
};
