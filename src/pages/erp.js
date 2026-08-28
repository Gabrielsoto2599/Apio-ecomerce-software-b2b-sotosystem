// =========================================================================
// BLOQUE 0: CONTROL DE IMPORTACIONES Y CORE ADMINISTRATIVO (ERP ENFOQUE LINEAL)
// Ubicación: erp.js -> Adaptado para persistencia extendida 2026
// =========================================================================
import { Home } from './home.js';

const ErpModulo = {
    // 📊 CORE MEMORY SOTO SYSTEM: El estado del negocio centraliza el histórico
    state: {
        movimientosDiarios: [], // Traga: ref, hora, fecha, productos, monto, cedula, metodo
        cierreEjecutado: false,
        tasaDolarActual: parseFloat(localStorage.getItem('APIO_TASA_CAMBIARIA')) || 36.50,
        
        // 💾 LECTURA MAESTRA DE DISCO: Carga el inventario vivo de Polar, Tunal y Natulac al arrancar
        listaProductosOriginal: JSON.parse(localStorage.getItem('APIO_INVENTARIO_PERSISTENTE')) || []
    },

    // =========================================================================
    // 🚧 ESPACIO RESERVADO: Aquí puedes pegar de regreso el Bloque 1, el render()
    // y todos tus métodos contables desde la A hasta la Extensión G.
    // =========================================================================

}; // 🎯 LLAVE DE CIERRE OBLIGATORIA: Cierra el objeto ErpModulo de forma limpia

// =========================================================================
// 🚀 INYECCIÓN GENERAL DEL FOOTER INSTITUCIONAL (AFUERA DE TODO CUADRO)
// =========================================================================
// Aseguramos que el orquestador tenga un contenedor para renderizar el pie de página
const appContainer = document.getElementById('contenedor-interno') || document.body;

if (typeof Home !== 'undefined' && typeof Home.renderFooter === 'function') {
    const footerOriginal = Home.renderFooter();
    appContainer.appendChild(footerOriginal);
}

// 📡 EXPORTACIÓN HOMOLOGADA DEL ENTORNO GLOBAL PARA ELECTRON
window.ErpModulo = ErpModulo;
export { ErpModulo };
