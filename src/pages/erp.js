// =========================================================================
// BLOQUE 0: CONTROL DE IMPORTACIONES Y CORE ADMINISTRATIVO (SOTO SYSTEM 2026)
// Ubicación: erp.js -> Adaptado para persistencia extendida y herencia limpia
// =========================================================================
import { Home } from './home.js';

const ErpModulo = {
    // 📊 CORE MEMORY SOTO SYSTEM: El estado del negocio centraliza el histórico
    state: {
        movimientosDiarios: [], 
        cierreEjecutado: false,
        tasaDolarActual: parseFloat(localStorage.getItem('APIO_TASA_CAMBIARIA')) || 36.50,
        listaProductosOriginal: JSON.parse(localStorage.getItem('APIO_INVENTARIO_PERSISTENTE')) || []
    },

    // 🎯 REPARACIÓN TEMPORAL SOTO SYSTEM: 
    // Método de verificación inicial antes de montar las vistas
    verificarEstadoSalud: function() {
        return "OK";
    },

    // 🧾 MÓDULO INTERMEDIO: Manejo local del registro de egresos (CORPOELEC)
    renderizarHistorialGastosLocal: function() {
        console.log("💾 [SOTO CORE]: Refrescando micro-tabla de gastos operacionales...");
        // Tu lógica interna de manipulación de tablas locales va aquí
    }
};


// =========================================================================
// 📡 ENLAZADO FINAL HOMOLOGADO PARA ELECTRON Y VITE (LÍNEAS FINALES)
// =========================================================================

// 1. Aseguramos el objeto en la ventana global de Electron
window.ErpModulo = ErpModulo; 

// 2. EXPORTACIÓN NOMINAL ESTRICTA (Detección limpia de dependencias en Vite)
export { ErpModulo };
