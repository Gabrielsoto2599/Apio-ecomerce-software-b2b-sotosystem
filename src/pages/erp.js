// =========================================================================
// BLOQUE 0: SANEAMIENTO DE EXPORTACIÓN Y CORE ADMINISTRATIVO (SOTO SYSTEM)
// =========================================================================
import { Home } from './home.js';

// Inicialización directa e indestructible en el objeto de la ventana
window.ErpModulo = {
    state: {
        movimientosDiarios: [], 
        cierreEjecutado: false,
        tasaDolarActual: parseFloat(localStorage.getItem('APIO_TASA_CAMBIARIA')) || 36.50,
        listaProductosOriginal: JSON.parse(localStorage.getItem('APIO_INVENTARIO_PERSISTENTE')) || []
    },
    verificarEstadoSalud: function() {
        return "OK";
    },
    renderizarHistorialGastosLocal: function() {
        console.log("💾 [SOTO CORE]: Refrescando micro-tabla de gastos operacionales...");
    }
};

// Vinculamos una referencia local para que los métodos de abajo no se rompan
const ErpModulo = window.ErpModulo;

// =========================================================================
// 🚀 METODO RENDER CALIBRADO: ACOPLE LINEAL ESTÁTICO
// =========================================================================
ErpModulo.render = function() {
    const section = document.createElement('section');
    section.id = "contenedor-erp-modulo";
    section.style.cssText = "display: block; width: 100%; box-sizing: border-box; background-color: #0d1117; padding: 0; margin: 0;";

    // Header heredado
    if (typeof Home !== 'undefined' && typeof Home.renderMasterHeader === 'function') {
        section.appendChild(Home.renderMasterHeader());
    } else if (window.App && typeof window.App.renderMasterHeader === 'function') {
        section.appendChild(window.App.renderMasterHeader());
    }

    const erpCuerpoContenedor = document.createElement('div');
    erpCuerpoContenedor.id = "erp-cuerpo-componentes";
    erpCuerpoContenedor.style.cssText = "width: 100%; padding: 20px; box-sizing: border-box; display: block;";
    
    erpCuerpoContenedor.innerHTML = `
        <!-- ========================================================================= -->
        <!-- 📥 GABRIEL, PEGA AQUÍ ABAJO TUS COMPONENTES RESPALDADOS LA SEMANA PASADA:   -->
        <!-- ========================================================================= -->
        
    `;
    section.appendChild(erpCuerpoContenedor);

    // Footer heredado estático para que no flote de forma invisible
    if (typeof Home !== 'undefined' && typeof Home.renderFooter === 'function') {
        const footerOriginal = Home.renderFooter();
        if (footerOriginal) {
            footerOriginal.style.position = 'static'; 
            footerOriginal.style.display = 'block';
            footerOriginal.style.width = '100%';
            section.appendChild(footerOriginal);
        }
    } else if (typeof Home !== 'undefined' && typeof Home.renderMasterFooter === 'function') {
        const footerMaster = Home.renderMasterFooter();
        if (footerMaster) {
            footerMaster.style.position = 'static';
            footerMaster.style.display = 'block';
            section.appendChild(footerMaster);
        }
    }

    return section;
};

// =========================================================================
// 🔌 INICIALIZADOR ASINCRONO
// =========================================================================
ErpModulo.init = function() {
    const appContainerGeneral = document.getElementById('contenedor-interno') || document.body;
    if (appContainerGeneral) {
        appContainerGeneral.innerHTML = '';
        appContainerGeneral.appendChild(ErpModulo.render());
        if (typeof ErpModulo.renderizarHistorialGastosLocal === 'function') {
            ErpModulo.renderizarHistorialGastosLocal();
        }
    }
};

// 🔒 CANDADO ABSOLUTO DE EXPORTACIÓN (Satisface a Vite de forma obligatoria)
export { ErpModulo };
