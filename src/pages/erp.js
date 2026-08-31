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
    // 🔌 MÉTODO INICIALIZADOR ENCAPSULADO (RENDERIZADO AUTÓNOMO DEL FOOTER)
    // =========================================================================
    init: function() {
        console.log("📡 [SOTO ERP ENGINE]: Desplegando módulo administrativo de forma aislada...");

        // Definimos el contenedor raíz de respaldo para asegurar que nunca falle la visual
        const appContainerGeneral = document.getElementById('contenedor-interno') || document.body;

        // 1. Renderizado nativo del panel del ERP en el lienzo secundario si existe
        if (typeof contenedorInterno !== 'undefined' && contenedorInterno !== null) {
            if (typeof erpPanel !== 'undefined') {
                contenedorInterno.appendChild(erpPanel);
            }

            // 2. Refrescamos la persistencia local de la micro-tabla de gastos
            if (typeof ErpModulo.renderizarHistorialGastosLocal === 'function') {
                ErpModulo.renderizarHistorialGastosLocal();
            }

            // 3. 🖨️ INYECCIÓN NATIVA AUTÓNOMA DIRECTA (BYPASS DE IMPORTACIÓN)
            // Creamos el nodo físicamente desde erp.js para no depender de home.js
            const footerViejo = contenedorInterno.querySelector('.soto-system-footer') || document.querySelector('footer');
            if (footerViejo) {
                footerViejo.remove();
            }
            
            const footerOriginal = document.createElement('footer');
            footerOriginal.className = 'soto-system-footer';
            footerOriginal.style.textAlign = 'center';
            footerOriginal.style.padding = '15px';
            footerOriginal.style.marginTop = '20px';
            footerOriginal.innerHTML = `
                <p><strong>APIO E-COMMERCE SOFTWARE</strong> <span class="version-tag" style="color: #38bdf8;">v1.0.0-SaaS</span></p>
                <p style="font-size: 11px; color: #94a3b8;">Fase de Desarrollo Comercial - Bodega Digital</p>
                <p style="font-size: 11px; color: #64748b;">© 2026 All Rights Reserved. Desarrollado por Soto System Digital Solutions VE</p>
            `;
            
            contenedorInterno.appendChild(footerOriginal);
            console.log("📥 [SOTO CORE]: Footer nativo e independiente inyectado con éxito en erp.js");

        } else {
            // 🎯 BYPASS DE EMERGENCIA: Si el lienzo secundario no está listo, inyectamos en la raíz general
            if (typeof erpPanel !== 'undefined') {
                appContainerGeneral.appendChild(erpPanel);
            }
            
            const footerViejo = appContainerGeneral.querySelector('.soto-system-footer') || document.querySelector('footer');
            if (footerViejo) {
                footerViejo.remove();
            }
            
            const footerOriginal = document.createElement('footer');
            footerOriginal.className = 'soto-system-footer';
            footerOriginal.style.textAlign = 'center';
            footerOriginal.style.padding = '15px';
            footerOriginal.innerHTML = `
                <p><strong>APIO E-COMMERCE SOFTWARE</strong> <span class="version-tag" style="color: #38bdf8;">v1.0.0-SaaS</span></p>
                <p style="font-size: 11px; color: #94a3b8;">Fase de Desarrollo Comercial - Bodega Digital</p>
                <p style="font-size: 11px; color: #64748b;">© 2026 All Rights Reserved. Desarrollado por Soto System Digital Solutions VE</p>
            `;
            appContainerGeneral.appendChild(footerOriginal);
        }
    }
}; // 🎯 LLAVE DE CIERRE CORPORATIVA: Cierra el objeto ErpModulo al final de toda la lógica

// =========================================================================
// 🚀 INYECCIÓN CONTROLADA SOTO SYSTEM
// =========================================================================
window.ErpModulo = ErpModulo;
export { ErpModulo };

