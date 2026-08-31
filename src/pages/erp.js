// =========================================================================
// BLOQUE 0: CONTROL DE IMPORTACIONES Y CORE ADMINISTRATIVO (ERP ENFOQUE LINEAL)
// Ubicación: erp.js -> Adaptado para persistencia extendida 2026
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
    // Creamos un método intermedio vacío para cerrar el objeto legalmente antes del init
    verificarEstadoSalud: function() {
        return "OK";
    },

    // =========================================================================
    // 🔌 MÉTODO INICIALIZADOR ENCAPSULADO (DIBUJO NATIVO AUTÓNOMO ANTI-CLONES)
    // =========================================================================
    init: function() {
        console.log("📡 [SOTO ERP ENGINE]: Desplegando módulo administrativo de forma aislada...");

        // Definimos el lienzo general de la aplicación
        const appContainerGeneral = document.getElementById('contenedor-interno') || document.body;

        // 1. Renderizado nativo del panel del ERP en el lienzo secundario si existe
        if (typeof contenedorInterno !== 'undefined' && contenedorInterno !== null) {
            if (typeof erpPanel !== 'undefined') {
                contenedorInterno.appendChild(erpPanel);
            }

            // Refrescamos la persistencia local de la micro-tabla de gastos
            if (typeof ErpModulo.renderizarHistorialGastosLocal === 'function') {
                ErpModulo.renderizarHistorialGastosLocal();
            }
        } else {
            // Bypass seguro: Si no hay contenedor secundario, inyectamos el panel en la raíz general
            if (typeof erpPanel !== 'undefined') {
                appContainerGeneral.appendChild(erpPanel);
            }
        }

        // 2. ⏱️ DISPARO ASÍNCRONO DEL FOOTER CORPORATIVO (DIBUJO INDEPENDIENTE EXCLUSIVO)
        setTimeout(() => {
            const lienzoActivo = document.getElementById('contenedor-interno') || document.body;

            // Poda física preventiva para barrer cualquier residuo anterior
            const footersExistentes = document.querySelectorAll('.soto-system-footer, footer');
            footersExistentes.forEach(f => f.remove());

            // 🎯 CONSTRUCCIÓN AUTÓNOMA FÍSICA: Se dibuja desde cero sin usar herencia
            const footerNativo = document.createElement('footer');
            footerNativo.className = 'soto-system-footer';
            
            // Estilización premium en línea para garantizar simetría con las demás secciones
            footerNativo.style.textAlign = 'center';
            footerNativo.style.padding = '20px 15px';
            footerNativo.style.marginTop = '30px';
            footerNativo.style.width = '100%';
            footerNativo.style.display = 'block';
            footerNativo.style.clear = 'both';
            footerNativo.style.fontFamily = "'Inter', sans-serif";
            
            footerNativo.innerHTML = `
                <p style="margin: 0; padding: 0; font-size: 13px; font-weight: 700; color: #ffffff; letter-spacing: 0.03em;">
                    APIO E-COMMERCE SOFTWARE <span class="version-tag" style="color: #38bdf8; font-weight: 800;">v1.0.0-SaaS</span>
                </p>
                <p style="margin: 5px 0 0 0; padding: 0; font-size: 11px; color: #94a3b8; font-weight: 500;">
                    Fase de Desarrollo Comercial - Bodega Digital
                </p>
                <p style="margin: 3px 0 0 0; padding: 0; font-size: 11px; color: #64748b; font-weight: 400;">
                    © 2026 All Rights Reserved. Desarrollado por <span style="color: #cbd5e1; font-weight: 600;">Soto System Digital Solutions VE</span>
                </p>
            `;
            
            // Lo acoplamos al fondo estricto de la vista fuera de los cuadros de productos
            lienzoActivo.appendChild(footerNativo);
            console.log("🏆 [SOTO CENTRAL]: Footer nativo e independiente inyectado sin arrastrar herencia visual.");
        }, 150); // Tiempo de asentamiento exacto en la RAM
    }
}; // 🎯 CIERRE SANO DE OBJETO: Sella la estructura provisionalmente

// 📡 EXPORTACIÓN HOMOLOGADA DEL ENTORNO GLOBAL PARA ELECTRON
window.ErpModulo = ErpModulo;
export { ErpModulo };
