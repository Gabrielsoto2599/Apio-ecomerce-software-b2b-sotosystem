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
// 🚀 METODO RENDER CALIBRADO: DETECCIÓN Y ACOPLE DE BLOQUE LINEAL
// =========================================================================
ErpModulo.render = function() {
    // 1. Creamos la sección raíz del módulo ERP sin forzar 100vh (dejamos que crezca natural)
    const section = document.createElement('section');
    section.id = "contenedor-erp-modulo";
    section.style.cssText = "display: block; width: 100%; box-sizing: border-box; background-color: #0d1117; padding: 0; margin: 0;";

    // 2. HERENCIA DEL HEADER: Se inyecta arriba (Esto ya funciona bien en tu app)
    if (typeof Home !== 'undefined' && typeof Home.renderMasterHeader === 'function') {
        section.appendChild(Home.renderMasterHeader());
    } else if (window.App && typeof window.App.renderMasterHeader === 'function') {
        section.appendChild(window.App.renderMasterHeader());
    }

    // 3. CUERPO DEL ERP: Contenedor plano sin flex-bloqueos
    const erpCuerpoContenedor = document.createElement('div');
    erpCuerpoContenedor.id = "erp-cuerpo-componentes";
    erpCuerpoContenedor.style.cssText = "width: 100%; padding: 20px; box-sizing: border-box; display: block;";
    
    // Inyectamos un texto de prueba temporal o tus componentes respaldados
    erpCuerpoContenedor.innerHTML = `
        <!-- Puedes pegar aquí tus 4 módulos contables respaldados -->
        <div style="background-color: #0b0f19; padding: 20px; border-radius: 8px; border: 1px solid #1e293b; color: white;">
            <h3 style="margin:0;">📡 Suite Contable Activada</h3>
            <p style="color:#64748b; font-size:13px;">Lienzo listo para inyección de componentes transaccionales.</p>
        </div>
    `;
    section.appendChild(erpCuerpoContenedor);

    // 4. 🎯 AUDITORÍA ESTRICTA DEL FOOTER FINAL:
    // Forzamos a que el footer heredado se comporte como un bloque estático al final del flujo
    if (typeof Home !== 'undefined' && typeof Home.renderFooter === 'function') {
        const footerOriginal = Home.renderFooter();
        if (footerOriginal) {
            // Le quitamos posicionamientos absolutos que puedan tener en home.js para que no flote
            footerOriginal.style.position = 'static'; 
            footerOriginal.style.display = 'block';
            footerOriginal.style.width = '100%';
            section.appendChild(footerOriginal);
            console.log("📥 [SOTO AUDITORÍA]: Footer inyectado con éxito al final de la sección del ERP.");
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

