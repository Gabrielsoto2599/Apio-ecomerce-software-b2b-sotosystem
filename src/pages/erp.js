// =========================================================================
// 🚀 METODO RENDER: ESTRUCTURACIÓN LINEAL NATIVA (IGUAL A TASA CAMBIARIA)
// =========================================================================
ErpModulo.render = function() {
    // 1. Creamos la sección raíz del módulo ERP
    const section = document.createElement('section');
    section.id = "contenedor-erp-modulo";
    section.style.cssText = "display: flex; flex-direction: column; width: 100%; box-sizing: border-box; min-height: 100vh; background-color: #0d1117;";

    // 2. HERENCIA DEL HEADER: Se inyecta arriba de forma limpia
    if (typeof Home !== 'undefined' && typeof Home.renderMasterHeader === 'function') {
        section.appendChild(Home.renderMasterHeader());
    } else if (window.App && typeof window.App.renderMasterHeader === 'function') {
        section.appendChild(window.App.renderMasterHeader());
    }

    // 3. CUERPO DEL ERP (Tus componentes respaldados de Gastos, Stock e Historial)
    const erpCuerpoContenedor = document.createElement('div');
    erpCuerpoContenedor.id = "erp-cuerpo-componentes";
    erpCuerpoContenedor.style.cssText = "flex: 1; width: 100%; padding: 20px; box-sizing: border-box;";
    
    // Inyectamos el HTML de los componentes que tienes respaldados
    erpCuerpoContenedor.innerHTML = `
        <!-- AQUÍ PEGAS TUS COMPONENTES NUEVOS RESPALDADOS -->
        <!-- Módulo 1: Consola ERP Contable Master (Cierres y Métricas) -->
        <!-- Módulo 2: Registro de Gastos Express (CORPOELEC) -->
        <!-- Módulo 3: Recepción de Mercancía Nueva (Inyectar Stock) -->
        <!-- Módulo 4: Historial de Movimientos y Transacciones Diarias -->
    `;
    section.appendChild(erpCuerpoContenedor);

    // 4. HERENCIA DEL FOOTER ÚNICO: Se acopla estrictamente al fondo de la sección
    if (typeof Home !== 'undefined' && typeof Home.renderFooter === 'function') {
        section.appendChild(Home.renderFooter());
        console.log("📥 [SOTO CORE]: Footer original heredado al final de la estructura lineal del ERP.");
    } else if (typeof Home !== 'undefined' && typeof Home.renderMasterFooter === 'function') {
        section.appendChild(Home.renderMasterFooter());
    }

    return section;
};

// =========================================================================
// 🔌 INICIALIZADOR ASINCRONO SANEADO: SIN APENDICES FANTASMAS
// =========================================================================
ErpModulo.init = function() {
    console.log("📡 [SOTO CORE ENGINE]: Sincronizando datos persistentes del ERP...");
    
    // Capturamos el contenedor principal de la SPA donde se montan las pantallas
    const appContainerGeneral = document.getElementById('contenedor-interno') || document.body;
    
    if (appContainerGeneral) {
        // Limpiamos la pantalla anterior de forma segura
        appContainerGeneral.innerHTML = '';
        
        // Inyectamos la estructura lineal completa (Header + Componentes ERP + Footer) de un solo golpe
        appContainerGeneral.appendChild(ErpModulo.render());
        
        // Activamos los hilos lógicos de tus micro-tablas una vez el DOM esté pintado
        if (typeof ErpModulo.renderizarHistorialGastosLocal === 'function') {
            ErpModulo.renderizarHistorialGastosLocal();
        }
        console.log("🛡️ [SOTO CORE]: Ciclo de renderizado ERP completado con éxito.");
    }
};

// 📡 EXPORTACIÓN HOMOLOGADA DEL ENTORNO GLOBAL PARA ELECTRON
window.ErpModulo = ErpModulo;
export { ErpModulo };
