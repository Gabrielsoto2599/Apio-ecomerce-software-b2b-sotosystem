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
    // 🔌 MÉTODOR INICIALIZADOR ENCAPSULADO (ANTI-DUPLICACIÓN GLOBAL)
    // =========================================================================
    init: function() {
        console.log("📡 [SOTO ERP ENGINE]: Desplegando módulo administrativo de forma aislada...");

        // 1. Renderizado nativo del panel del ERP en el lienzo secundario
        if (typeof contenedorInterno !== 'undefined' && contenedorInterno !== null) {
            if (typeof erpPanel !== 'undefined') {
                contenedorInterno.appendChild(erpPanel);
            }

            // 2. Refrescamos la persistencia local de la micro-tabla de gastos
            if (typeof ErpModulo.renderizarHistorialGastosLocal === 'function') {
                ErpModulo.renderizarHistorialGastosLocal();
            }

            // 3. 🖨️ EL CANDADO DE CONTEXTO EXCLUSIVO:
            // El footer SOLO se inyectará si el inicializador init() es invocado formalmente
            if (typeof Home !== 'undefined' && typeof Home.renderFooter === 'function') {
                // Validación absoluta: Limpiamos duplicados previos dentro del contenedor interno
                const footerViejo = contenedorInterno.querySelector('.soto-system-footer') || document.querySelector('footer');
                if (footerViejo) {
                    footerViejo.remove();
                }
                
                // Inyección inmaculada en la última línea física del panel ERP
                const footerOriginal = Home.renderFooter();
                contenedorInterno.appendChild(footerOriginal);
                console.log("📥 [SOTO CORE]: Footer inyectado con éxito exclusivo dentro de erp.js");
            }
        }
    }
}; // 🎯 LLAVE DE CIERRE CORPORATIVA: Cierra el objeto ErpModulo al final de toda la lógica

// =========================================================================
// 🚀 INYECCIÓN CONTROLADA SOTO SYSTEM
// =========================================================================
// Para levantar la sección desde el enrutador principal de tu SPA (home.js),
// simplemente debes llamar a: window.ErpModulo.init(); en el evento del menú.

// 📡 EXPORTACIÓN HOMOLOGADA DEL ENTORNO GLOBAL PARA ELECTRON
window.ErpModulo = ErpModulo;
export { ErpModulo };


