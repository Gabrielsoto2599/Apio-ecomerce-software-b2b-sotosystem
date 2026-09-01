// =========================================================================
// BLOQUE 0: CONTROL DE IMPORTACIONES Y CORE ADMINISTRATIVO (SOTO SYSTEM 2026)
// Ubicación: erp.js -> Adaptado para persistencia extendida y herencia limpia
// =========================================================================
import { Home } from './home.js';

// Inicialización directa e indestructible en el objeto de la ventana global de Electron
window.ErpModulo = {
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

    // =========================================================================
    // 🎛️ PARTE 1-A: CONSTRUCTOR DEL LIENZO Y APERTURA DE PLANTILLA ATÓMICA
    // Ubicación: erp.js -> Reemplaza el inicio del método render()
    // =========================================================================
    render() {
        // Saneamos la importación para sostener la línea de Home encendida en VS Code
        if (typeof Home !== 'undefined' && false) { console.log(Home); }

        // 1. Contenedor Maestro de la Pantalla Completa
        const section = document.createElement('section');
        section.id = "contenedor-erp-contable-modulo";
        section.className = "apio-erp-wrapper";
        section.style.cssText = "display: flex; flex-direction: column; width: 100%; box-sizing: border-box; flex: 1; background-color: #0d1117; padding: 20px;";

        // 2. Consola Maestra del ERP Contable (Estilo Pasarela con Iluminación Lateral Púrpura)
        const erpPanel = document.createElement('div');
        erpPanel.style.cssText = "background-color: #0b0f19; padding: 35px 28px; border-radius: 12px; border: 1px solid #1e293b; border-left: 4px solid #a855f7; max-width: 1200px; width: 100%; box-shadow: 0 0 25px rgba(168, 85, 247, 0.15), 0 20px 40px rgba(0,0,0,0.7); font-family: 'Inter', sans-serif; margin: 20px auto; box-sizing: border-box; color: #ffffff; overflow: hidden; position: relative;";

        // 3. Abrimos la plantilla unificada continua
        erpPanel.innerHTML = `
            <!-- 👑 ENCABEZADO PREMIUM DE LA CONSOLA -->
<div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 25px; border-bottom: 1px solid #1e293b; padding-bottom: 15px;">
    <div style="display: flex; align-items: center; gap: 12px;">
        <span style="width: 24px; height: 24px; border-radius: 50%; background-color: #a855f7; display: flex; align-items: center; justify-content: center; font-weight: 900; color: #ffffff; font-size: 13px; box-shadow: 0 0 10px rgba(168, 85, 247, 0.65);">E</span>
        <div>
            <h3 style="font-weight: 800; font-size: 16px; color: #FFFFFF; margin: 0; letter-spacing: -0.01em; text-transform: uppercase; font-family: monospace;">Consola ERP Contable Master</h3>
            <p style="margin: 2px 0 0 0; color: #64748b; font-size: 11px; font-weight: 600;">Auditoría Corporativa, Control de Deudores y Cierres Fiscales</p>
        </div>
    </div>
    <span style="background: rgba(168, 85, 247, 0.15); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.3); padding: 4px 10px; border-radius: 4px; font-size: 10px; font-weight: 800; letter-spacing: 0.05em; font-family: monospace;">SISTEMA MANUAL MVP</span>
</div>

<!-- 🎚️ REJILLA DE CONTROL MULTI-CIERRE CON DISPARADORES INDEPENDIENTES (REPORTLAB PDF) -->
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 20px;">
    <!-- 🟣 Botón Cierre de Caja Diario (Original Fino) -->
    <button onclick="window.ErpModulo.ejecutarCierreYGenerarPdf()" style="background: linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%); color:white; border:none; padding:14px; border-radius:8px; font-weight:bold; cursor:pointer; text-transform:uppercase; font-size:11px; font-family:'Inter',sans-serif; box-shadow: 0 4px 12px rgba(124,58,237,0.3); transition: transform 0.2s;">
        🟣 Cierre Diario (PDF)
    </button>

    <!-- 🔵 Botón Cierre Semanal Consolidado (¡NUEVO!) -->
    <button onclick="window.ErpModulo.ejecutarCierreSemanalPdf()" style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color:white; border:none; padding:14px; border-radius:8px; font-weight:bold; cursor:pointer; text-transform:uppercase; font-size:11px; font-family:'Inter',sans-serif; box-shadow: 0 4px 12px rgba(37,99,235,0.3); transition: transform 0.2s;">
        🔵 Cierre Semanal (PDF)
    </button>

    <!-- 🟢 Botón Reporte Mes Fiscal SENIAT (¡NUEVO!) -->
    <button onclick="window.ErpModulo.ejecutarCierreMensualPdf()" style="background: linear-gradient(135deg, #10b981 0%, #047857 100%); color:white; border:none; padding:14px; border-radius:8px; font-weight:bold; cursor:pointer; text-transform:uppercase; font-size:11px; font-family:'Inter',sans-serif; box-shadow: 0 4px 12px rgba(16,185,129,0.3); transition: transform 0.2s;">
        🟢 Reporte Mes (IVA 16% SENIAT)
    </button>
</div>

<!-- 📊 EXTENSIÓN D: TARJETA ANALÍTICA PREMIUM CON COLOR GLOW (APIO INTELLIGENCE) -->
<div id="analytics-card-container" style="margin-bottom: 30px; font-family: 'Inter', sans-serif; width: 100%; box-sizing: border-box;">
    <div style="background: linear-gradient(135deg, #0f172a 0%, #020617 100%); padding: 18px; border-radius: 10px; border: 1px solid #1e293b; border-left: 5px solid #00D2FF; box-shadow: 0 4px 15px rgba(0, 210, 255, 0.15); display: flex; justify-content: space-between; align-items: center; gap: 15px;">
        
        <div>
            <span style="font-size: 10px; color: #38bdf8; font-weight: 800; text-transform: uppercase; display: block; margin-bottom: 4px; letter-spacing: 0.08em;">🔥 Métrica de Rotación (PostgreSQL Cloud)</span>
            <h4 id="analytics-producto-estrella" style="margin: 0; color: #ffffff; font-size: 15px; font-weight: 800; letter-spacing: -0.01em;">Sincronizando con Railway...</h4>
        </div>

        <!-- Botón/Indicador Neón de Rendimiento Integrado -->
        <div style="background: rgba(0, 210, 255, 0.1); border: 1px solid rgba(0, 210, 255, 0.3); padding: 8px 14px; border-radius: 6px; text-align: center; box-shadow: 0 0 10px rgba(0, 210, 255, 0.1); min-width: 110px;">
            <span style="display: block; font-size: 9px; color: #64748b; font-weight: 700; text-transform: uppercase; margin-bottom: 2px;">Ventas Mes</span>
            <strong id="analytics-unidades-estrella" style="font-size: 13px; color: #00D2FF; font-family: monospace; font-weight: 900;">0 Unds</strong>
        </div>

    </div>
</div>

<!-- 💳 EXTENSIÓN E: PANEL DE RECAUDACIÓN Y CONCILIACIÓN DE COBRANZAS (SOTO FINANCIAL ENGINE) -->
<div id="cobranzas-card-container" style="margin-bottom: 30px; font-family: 'Inter', sans-serif; width: 100%; box-sizing: border-box;">
    <div style="background: linear-gradient(135deg, #0b1329 0%, #020c1b 100%); padding: 18px; border-radius: 10px; border: 1px solid #1e293b; border-left: 5px solid #10b981; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.15);">
        
        <span style="font-size: 10px; color: #10b981; font-weight: 800; text-transform: uppercase; display: block; margin-bottom: 12px; letter-spacing: 0.08em;">📋 Canales de Recaudación y Cobranzas (Turno Activo)</span>
        
        <!-- Rejilla Triple de Métodos de Pago con Estilo Fiscal Fino -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px;">
            
            <!-- Canal A: Pago Móvil -->
            <div style="background: #030712; padding: 10px; border-radius: 6px; border: 1px solid #1e293b; text-align: center;">
                <span style="display: block; font-size: 9px; color: #a3e635; font-weight: 700; text-transform: uppercase; margin-bottom: 2px;">📱 PAGO MÓVIL</span>
                <strong id="cobranza-pago-movil" style="font-size: 14px; color: #ffffff; font-family: monospace;">0.00 Bs.</strong>
            </div>

            <!-- Canal B: Biopago / Tarjeta -->
            <div style="background: #030712; padding: 10px; border-radius: 6px; border: 1px solid #1e293b; text-align: center;">
                <span style="display: block; font-size: 9px; color: #38bdf8; font-weight: 700; text-transform: uppercase; margin-bottom: 2px;">⚡ BIOPAGO / REF</span>
                <strong id="cobranza-biopago" style="font-size: 14px; color: #ffffff; font-family: monospace;">0.00 Bs.</strong>
            </div>

            <!-- Canal C: Efectivo -->
            <div style="background: #030712; padding: 10px; border-radius: 6px; border: 1px solid #1e293b; text-align: center;">
                <span style="display: block; font-size: 9px; color: #fbbf24; font-weight: 700; text-transform: uppercase; margin-bottom: 2px;">💵 EFECTIVO (USD)</span>
                <strong id="cobranza-efectivo" style="font-size: 14px; color: #ffffff; font-family: monospace;">$0.00</strong>
            </div>

        </div>

    </div>
</div>

<!-- 👤 EXTENSIÓN F: MÁNAGER OPERACIONAL DE VENDEDORES Y CAJEROS ACTIVOS (REPARACIÓN GRID DETALLISTA) -->
<div id="vendedores-card-container" style="margin-bottom: 24px; font-family: 'Inter', sans-serif; width: 100%; box-sizing: border-box;">
    <div style="background: linear-gradient(135deg, #0f1526 0%, #030a16 100%); padding: 18px; border-radius: 10px; border: 1px solid #1e293b; border-left: 5px solid #8b5cf6; box-shadow: 0 4px 15px rgba(139, 92, 246, 0.15); display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; align-items: center; width: 100%; box-sizing: border-box;">
        
        <!-- Bloque de Texto Saneado -->
        <div style="width: 100%;">
            <span style="font-size: 10px; color: #a78bfa; font-weight: 800; text-transform: uppercase; display: block; margin-bottom: 4px; letter-spacing: 0.08em;">👤 Control y Auditoría de Personal</span>
            <h4 style="margin: 0; color: #ffffff; font-size: 14px; font-weight: 700; letter-spacing: -0.01em;">Asignación de Operador en Taquilla</h4>
        </div>

        <!-- Selector Estilizado Comercial Genérico -->
        <div style="width: 100%;">
            <select id="erp-vendedor-activo" onchange="window.ErpModulo.registrarCambioVendedorTurno()" style="width: 100%; padding: 10px 12px; background: #030712; border: 1px solid #334155; color: #a78bfa; border-radius: 6px; font-size: 12px; font-weight: bold; cursor: pointer; outline: none; box-shadow: 0 0 10px rgba(139, 92, 246, 0.05); font-family: 'Inter', sans-serif; box-sizing: border-box;">
                <option value="Cajera Turno Mañana">👤 Cajera Turno Mañana (Taquilla A)</option>
                <option value="Cajera Turno Tarde">👤 Cajera Turno Tarde (Taquilla B)</option>
                <option value="Supervisor General">👑 Supervisor / Administrador Central</option>
                <option value="Taquilla Auxiliar">👤 Operador de Relevo (Fin de Semana)</option>
            </select>
        </div>

    </div>
</div>

<!-- 💸 EXTENSIÓN G: PANEL DE REGISTRO DE GASTOS EXPRESS CON HISTORIAL FISCAL DIGITAL -->
<div id="gastos-card-container" style="margin-bottom: 24px; font-family: 'Inter', sans-serif; width: 100%; box-sizing: border-box;">
    <div style="background: linear-gradient(135deg, #1a0f1a 0%, #0a030a 100%); padding: 18px; border-radius: 10px; border: 1px solid #1e293b; border-left: 5px solid #ef4444; box-shadow: 0 4px 15px rgba(239, 68, 68, 0.12);">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 10px;">
            <span style="font-size: 10px; color: #f87171; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em;">💸 Registro de Gastos Express y Libro de Egresos Digital</span>
            <!-- 🖨️ Botón Fiscal para Descarga del Reporte de Gastos -->
            <button onclick="window.ErpModulo.descargarGastosMesPdf()" style="padding: 6px 12px; background: linear-gradient(135deg, #374151 0%, #1f2937 100%); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 4px; font-size: 10px; font-weight: 800; cursor: pointer; text-transform: uppercase; font-family: 'Inter', sans-serif; letter-spacing: 0.05em; display: flex; align-items: center; gap: 6px;">
                🖨️ Reporte Gastos (PDF)
            </button>
        </div>
        
        <!-- Formulario Inline Adaptativo -->
        <div style="display: flex; gap: 12px; flex-wrap: wrap; width: 100%; box-sizing: border-box; margin-bottom: 15px;">
            <input type="text" id="gasto-descripcion" placeholder="Ej: Pago de Luz CORPOELEC" style="flex: 2; min-width: 200px; padding: 10px; background: #030712; border: 1px solid #334155; color: #fff; border-radius: 6px; font-size: 12px; font-family: 'Inter', sans-serif; outline: none;">
            <input type="number" id="gasto-monto" placeholder="Monto $" style="flex: 1; min-width: 100px; padding: 10px; background: #030712; border: 1px solid #334155; color: #fff; border-radius: 6px; font-size: 12px; font-weight: bold; font-family: monospace; text-align: center; outline: none;">
            <button onclick="window.ErpModulo.registrarGastoMensualExpress()" style="flex: 1; min-width: 150px; padding: 10px 16px; background: linear-gradient(135deg, #ef4444 0%, #991b1b 100%); color: #fff; border: none; border-radius: 6px; font-size: 11px; font-weight: 800; cursor: pointer; text-transform: uppercase; letter-spacing: 0.05em; font-family: 'Inter', sans-serif; box-shadow: 0 4px 10px rgba(239, 68, 68, 0.2); transition: all 0.2s;">
                📉 Aplicar Egreso
            </button>
        </div>

        <!-- 📋 Pizarra del Historial de Egresos en Vivo -->
        <div style="background: #030712; padding: 12px; border-radius: 6px; border: 1px solid #1e293b; max-height: 120px; overflow-y: auto;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 11px; font-family: 'Inter', sans-serif;">
                <thead>
                    <tr style="color: #64748b; border-bottom: 1px solid #1e293b; font-size: 10px; text-transform: uppercase;">
                        <th style="padding-bottom: 6px; width: 65%;">Descripción del Egreso</th>
                        <th style="padding-bottom: 6px; text-align: right; width: 35%;">Monto Deducido</th>
                    </tr>
                </thead>
                <tbody id="lista-gastos-cuerpo" style="color: #cbd5e1; font-family: monospace;">
                    <!-- Inyectado dinámicamente en caliente por tu script -->
                    <tr>
                        <td colspan="2" style="padding: 8px 0; text-align: center; color: #475569; font-family: sans-serif; font-style: italic;">No se registran egresos operacionales en el turno actual.</td>
                    </tr>
                </tbody>
            </table>
        </div>

    </div>
</div>



            <!-- 📦 EXTENSIÓN H: CONSOLA DE INGRESO DE MERCANCÍA NUEVA (LIBRO CONTABLE DE PROVEEDORES ENVOLVENTE SANEADO) -->
<div id="inventario-card-container" style="margin-bottom: 30px; font-family: 'Inter', sans-serif; width: 100%; box-sizing: border-box;">
    
    <div style="background-color: #030712; padding: 20px; border-radius: 8px; border: 1px solid #1e293b; font-family: 'Inter', sans-serif;">
        <h4 style="margin: 0 0 15px 0; font-size: 12px; color: #38bdf8; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">📦 Recepción de Mercancía Nueva (Carga Inventario Fijo)</h4>
        
        <form id="form-ingreso-inventario-nuevo" onsubmit="event.preventDefault(); window.ErpModulo.ingresarMercanciaNuevaManual();" 
            style="display: flex; flex-wrap: wrap; gap: 14px; align-items: flex-end;">
            
            <div style="flex: 1; min-width: 120px;">
                <label style="display:block; font-size:10px; color:#64748b; margin-bottom:4px; font-weight:700;">SKU / CÓDIGO:</label>
                <input type="text" id="inv-sku" required placeholder="Ej: POL-PAN-01" style="width:100%; background:#0b0f19; border:1px solid #1e293b; padding:10px; color:white; border-radius:6px; font-family:monospace; font-size:13px; outline:none;">
            </div>

            <div style="flex: 2; min-width: 180px;">
                <label style="display:block; font-size:10px; color:#64748b; margin-bottom:4px; font-weight:700;">DESCRIPCIÓN DEL VÍVERE:</label>
                <input type="text" id="inv-nombre" required placeholder="Ej: Harina P.A.N. 1kg" style="width:100%; background:#0b0f19; border:1px solid #1e293b; padding:10px; color:white; border-radius:6px; font-size:13px; outline:none;">
            </div>

            <div style="flex: 1; min-width: 140px;">
                <label style="display:block; font-size:10px; color:#64748b; margin-bottom:4px; font-weight:700;">DISTRIBUIDOR / PROVEEDOR:</label>
                <select id="inv-proveedor" style="width:100%; background:#0b0f19; border:1px solid #1e293b; padding:10px; color:white; border-radius:6px; cursor:pointer; font-size:13px; outline:none;">
                    <option value="POLAR">Empresas Polar C.A.</option>
                    <option value="EL TUNAL">Alimentos El Tunal</option>
                    <option value="NATULAC">Industrias Natulac</option>
                    <option value="OTROS">Mercancía General / Genéricos</option>
                </select>
            </div>

            <div style="flex: 1; min-width: 90px;">
                <label style="display:block; font-size:10px; color:#64748b; margin-bottom:4px; font-weight:700;">COSTO COMPRA ($):</label>
                <input type="number" id="inv-precio" step="0.01" required value="1.10" style="width:100%; background:#0b0f19; border:1px solid #1e293b; padding:10px; color:#00D2FF; border-radius:6px; font-family:monospace; font-weight:bold; font-size:13px; outline:none;">
            </div>

            <div style="flex: 1; min-width: 80px;">
                <label style="display:block; font-size:10px; color:#64748b; margin-bottom:4px; font-weight:700;">CANTIDAD (UNID):</label>
                <input type="number" id="inv-stock" required value="20" style="width:100%; background:#0b0f19; border:1px solid #1e293b; padding:10px; color:white; border-radius:6px; font-family:monospace; font-size:13px; outline:none;">
            </div>

            <button type="submit" style="background: linear-gradient(135deg, #00D2FF 0%, #0072FF 100%); color:#030712; border:none; padding:11px 24px; border-radius:6px; font-weight:800; cursor:pointer; text-transform:uppercase; font-size:11px; letter-spacing:0.05em; box-shadow: 0 4px 12px rgba(0, 210, 255, 0.3);">
                📥 Inyectar Stock
            </button>
        </form>
    </div>

</div>

                        <!-- 📊 EXTENSIÓN I: HISTORIAL DE TRANSACCIONES ENVOLVENTE Y FOOTER INTEGRAL SANEADO -->
<div id="historial-card-container" style="margin-bottom: 24px; font-family: 'Inter', sans-serif; width: 100%; box-sizing: border-box;">
    
    <div style="background-color: #030712; padding: 22px; border-radius: 8px; border: 1px solid #1e293b;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px; border-bottom: 1px solid #1e293b; padding-bottom: 8px;">
            <span style="color: #a855f7; font-size: 14px;">📊</span>
            <h4 style="margin: 0; font-size: 12px; font-weight: 800; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em;">Historial de Movimientos y Transacciones Diarias</h4>
        </div>
        <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 12px;">
                <thead>
                    <tr style="background: #000000; color: #ffffff; border-bottom: 2px solid #1e293b; font-family: monospace; font-size: 11px; text-transform: uppercase;">
                        <th style="padding: 12px 14px; width: 110px;">REF / HORA</th>
                        <th style="padding: 12px 14px; width: 130px;">CÉDULA/RIF</th>
                        <th style="padding: 12px 14px;">PRODUCTOS DESPACHADOS</th>
                        <th style="padding: 12px 14px; width: 140px; text-align: center;">MÉTODO PAGO</th>
                        <th style="padding: 12px 14px; width: 160px; text-align: right;">MONTO PAGADO</th>
                    </tr>
                </thead>
                <tbody id="erp-movimientos-diarios-rows" style="font-family: monospace; font-weight: 600; color: #e2e8f0;">
                    <tr>
                        <td colspan="5" style="padding: 60px; text-align: center; color: #475569; font-style: italic; font-family: 'Inter', sans-serif; font-size: 13px;">
                            No se registran movimientos en la jornada actual. Las transacciones de la pasarela se listarán aquí en tiempo real.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

</div>

`; // <-- Aquí cerramos oficialmente el gran template string de tu ERP

        // Colgamos la consola unificada adentro del cascarón maestro de la SPA
        section.appendChild(erpPanel);

        // Disparamos la inyección preventiva diferida de los renglones del turno
        setTimeout(() => {
            if (typeof this.reinyectarFilasTabla === 'function') {
                this.reinyectarFilasTabla();
            }
        }, 50);

        return section;
    }, // 🎯 Cierre hermético perfecto y balanceado de tu método render()       

  // =========================================================================
// 🚀 BLOQUE 2: PROCESADORES LÓGICOS Y EMISOR DE REPORTE FISCAL PDF (CORREGIDO 2026)
// Ubicación: erp.js
// =========================================================================
    
    // 🧬 INYECTOR ULTRA-RÁPIDO DE HISTORIAL TRANSACCIONAL MULTICANAL
    reinyectarFilasTabla() {
        const tbody = document.getElementById('erp-movimientos-diarios-rows');
        if (!tbody) return;

        const lista = this.state.movimientosDiarios || [];
        
        // Si no hay ventas registradas en el turno, pintamos la celda de contingencia visual
        if (lista.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="padding: 60px; text-align: center; color: #475569; font-style: italic; font-family: 'Inter', sans-serif; font-size: 13px;">
                        No se registran movimientos en la jornada actual. Las transacciones de la pasarela se listarán aquí en tiempo real.
                    </td>
                </tr>
            `;
            return;
        }

        // 🎨 Mapeamos y pintamos cada fila en base a los datos extendidos del checkout
        tbody.innerHTML = lista.map(mov => `
            <tr style="border-bottom: 1px solid #1e293b; background-color: rgba(255,255,255, 0.01);">
                <td style="padding: 14px; color: #a855f7; font-weight: bold; font-size: 11px; font-family: monospace;">
                    ${mov.ref || 'TR-N/A'}<br><span style="color: #64748b; font-size: 9px;">${mov.hora || '00:00'}</span>
                </td>
                <td style="padding: 14px; color: #cbd5e1; font-family: monospace;">${mov.cedula || 'V-99999999'}</td>
                <td style="padding: 14px; color: #94a3b8; font-family: 'Inter', sans-serif; line-height: 1.4; font-size: 11px;">
                    ${mov.productos || 'Mercancía General'}
                </td>
                <td style="padding: 14px; text-align: center;">
                    <span style="background-color: #0b1329; color: #38bdf8; font-size: 9px; padding: 3px 8px; border-radius: 4px; border: 1px solid rgba(56, 189, 248, 0.2); text-transform: uppercase; font-family: 'Inter', sans-serif; font-weight: 700;">
                        ${(mov.metodo || 'BIOPAGO').replace('_', ' ')}
                    </span>
                </td>
                <td style="padding: 14px; text-align: right; color: #00D2FF; font-size: 13px; font-family: monospace;">
                    ${parseFloat(mov.montoBs || 0).toLocaleString('es-VE', {minimumFractionDigits: 2})} Bs.<br>
                    <span style="color: #10b981; font-size: 10px;">$${parseFloat(mov.montoUsd || 0).toFixed(2)}</span>
                </td>
            </tr>
        `).join('');
    },

       // 🔒 LA FÓRMULA DE GABRIEL BLINDADA: Cierre de Caja con Descarga Asíncrona de PDF
    ejecutarCierreYGenerarPdf() {
        console.log("🔒 [Apio ERP Core]: Evaluando registros para inicio de auditoría final...");
        
        // 1. Extraemos el historial vivo de ventas de la RAM de Electron
        const movimientos = this.state.movimientosDiarios || [];

        // REGLA DE NEGOCIO CRÍTICA: Impedimos cierres con la caja en blanco
        if (movimientos.length === 0) {
            alert("⚠️ Operación Denegada: No se puede ejecutar el Cierre de Caja debido a que el Historial de Movimientos se encuentra vacío.");
            return;
        }

        // 📐 Recuperamos la tasa viva de la PC para estampar el reporte real
        const tasaDolarActual = parseFloat(window.TasaCambioModulo?.state?.precio_bcv || 40.00);

        console.log(`📡 [SOTO ENGINE]: Despachando ${movimientos.length} transacciones vivas al motor ReportLab a tasa ${tasaDolarActual} Bs.`);

        // 2. Mapeamos las variables de tu RAM local al formato estricto que exige Python en views.py
        const movimientosMapeados = movimientos.map(mov => ({
            ref: mov.ref || mov.numero_factura || 'TR-N/A',
            cedula: mov.cedula || mov.cliente_identificacion || 'V-99999999',
            metodo: mov.metodo || mov.metodo_pago || 'BIOPAGO',
            montoBs: parseFloat(mov.montoBs || mov.total_bs || 0.00),
            productos: mov.productos || mov.productos_despachados || 'Mercancía General'
        }));

        // 3. Creamos el iframe fantasma para el manejo del DOM
        const iframeDiario = document.createElement('iframe');
        iframeDiario.style.display = 'none';
        document.body.appendChild(iframeDiario);

        // 4. Disparamos la ráfaga de red nativa usando el window.fetch global de Electron
        setTimeout(() => {
            window.fetch('https://apio-ecomerce-software-b2b-sotosystem-production.up.railway.app/api/v1/ejecutar-cierre-pdf/', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/pdf'
                },
                body: JSON.stringify({ 
                    "origen": "Electron Desktop ERP Master",
                    "tasa_bcv": tasaDolarActual,
                    "movimientos_jornada": movimientosMapeados // 👈 AQUÍ SE INYECTA EL HISTORIAL REAL EN VIVO
                })
            })
            .then(res => {
                if (!res.ok) {
                    if (document.body.contains(iframeDiario)) document.body.removeChild(iframeDiario);
                    throw new Error("Rebote fiscal en el motor diario de Django (Status: " + res.status + ")");
                }
                return res.blob();
            })
            .then(blob => {
                // Transformamos los bytes de ReportLab en un enlace de descarga física nativo
                const urlDescarga = window.URL.createObjectURL(blob);
                const enlaceDescarga = document.createElement('a');
                
                enlaceDescarga.href = urlDescarga;
                enlaceDescarga.download = `Cierre_Diario_ERP_${new Date().toISOString().split('T')[0]}.pdf`;
                
                document.body.appendChild(enlaceDescarga);
                enlaceDescarga.click();
                
                // Limpiamos los nodos de la RAM para evitar fugas de memoria
                document.body.removeChild(enlaceDescarga);
                if (document.body.contains(iframeDiario)) document.body.removeChild(iframeDiario);
                console.log("✅ [SOTO ERP]: Cierre Diario PDF descargado con éxito con datos REALES.");
            })
            .catch(error => {
                if (document.body.contains(iframeDiario)) document.body.removeChild(iframeDiario);
                console.error("❌ Error de comunicación en Apio ERP Engine:", error.message);
            });
        }, 50);
    }, // 🎯 CANDADO MÁSTER: Cierre estructural de la función contable

        // =========================================================================
    // 📅 EXTENSIÓN A: COMPILADOR DE CONSOLIDADO SEMANAL (REPORTLAB)
    // =========================================================================
    ejecutarCierreSemanalPdf() {
        console.log("📡 [SOTO CLOUD]: Generando balance consolidado de 7 días...");
        const iframeSemanal = document.createElement('iframe');
        iframeSemanal.style.display = 'none';
        document.body.appendChild(iframeSemanal);

        // 🎯 CORE REPAIR: Usamos directamente el fetch nativo global para saltar bloqueos CORS locales de Electron
        window.fetch('https://apio-ecomerce-software-b2b-sotosystem-production.up.railway.app/api/v1/ejecutar-cierre-semanal/', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/pdf'
            },
            body: JSON.stringify({ "origen": "Electron Desktop ERP Master Semanal" })
        })
        .then(res => {
            if (!res.ok) {
                if (document.body.contains(iframeSemanal)) document.body.removeChild(iframeSemanal);
                throw new Error("Rebote fiscal en el motor semanal de Django (Status: " + res.status + ")");
            }
            return res.blob();
        })
        .then(blobPdf => {
            const urlDescarga = window.URL.createObjectURL(blobPdf);
            const enlace = document.createElement('a');
            enlace.href = urlDescarga;
            enlace.download = `CIERRE_SEMANAL_${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(enlace);
            enlace.click();
            enlace.remove();
            if (document.body.contains(iframeSemanal)) document.body.removeChild(iframeSemanal);

            alert("📅 [BALANCE SEMANAL COMPLETADO]\n\n• Reporte emitido en PDF.");
        })
        .catch(err => {
            console.error("❌ Falla Semanal:", err.message);
            if (document.body.contains(iframeSemanal)) document.body.removeChild(iframeSemanal);
            alert("⚠️ Alerta: Error de comunicación con el motor semanal.");
        });
    }, // 🎯 COMA OBLIGATORIA: Cierra el Bloque A y le da paso en limpio al Bloque B

    // =========================================================================
    // 🏛️ EXTENSIÓN B: REPORTE DE MES FISCAL - DECLARACIÓN IVA 16% (SENIAT)
    // =========================================================================
    ejecutarCierreMensualPdf() {
        console.log("📡 [SOTO CLOUD]: Compilando libro de ventas del mes...");
        const iframeMensual = document.createElement('iframe');
        iframeMensual.style.display = 'none';
        document.body.appendChild(iframeMensual);

        window.fetch('https://apio-ecomerce-software-b2b-sotosystem-production.up.railway.app/api/v1/ejecutar-cierre-mensual/', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/pdf'
            },
            body: JSON.stringify({ "origen": "Electron Desktop ERP Master Mensual" })
        })
        .then(res => {
            if (!res.ok) {
                if (document.body.contains(iframeMensual)) document.body.removeChild(iframeMensual);
                throw new Error("Rebote impositivo en Django (Status: " + res.status + ")");
            }
            return res.blob();
        })
        .then(blobPdf => {
            const urlDescarga = window.URL.createObjectURL(blobPdf);
            const enlace = document.createElement('a');
            enlace.href = urlDescarga;
            enlace.download = `REPORTE_MENSUAL_FISCAL_${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(enlace);
            enlace.click();
            enlace.remove();
            if (document.body.contains(iframeMensual)) document.body.removeChild(iframeMensual);

            alert("🏛️ [REPORTE FISCAL MENSUAL EMITIDO - SENIAT VENEZUELA]");
        })
        .catch(err => {
            console.error("❌ Falla Mensual:", err.message);
            if (document.body.contains(iframeMensual)) document.body.removeChild(iframeMensual);
            alert("⚠️ Alerta: Error de comunicación con el motor mensual.");
        });
    }, // 🎯 COMA OBLIGATORIA: Cierra el Bloque B y abre el espacio para los nuevos módulos

                // =========================================================================
    // 📦 EXTENSIÓN C: INYECTOR DE MERCANCÍA NUEVA PERSISTENTE (PROVEEDORES POLAR/TUNAL)
    // =========================================================================
    ingresarMercanciaNuevaManual() {
        const txtSku = document.getElementById('inv-sku');
        const txtNombre = document.getElementById('inv-nombre');
        const selProveedor = document.getElementById('inv-proveedor');
        const numPrecio = document.getElementById('inv-precio');
        const numStock = document.getElementById('inv-stock');

        if (!txtSku || !txtNombre || !selProveedor || !numPrecio || !numStock) return;

        const skuLimpio = txtSku.value.trim().toUpperCase();
        const nombreLimpio = txtNombre.value.trim();
        const proveedor = selProveedor.value;
        const costoUsd = parseFloat(numPrecio.value) || 1.00;
        const stockIngresado = parseInt(numStock.value) || 0;

        if (!window.App) window.App = {};
        if (!window.App.state) window.App.state = {};
        
        let inventarioVivo = JSON.parse(localStorage.getItem('APIO_INVENTARIO_PERSISTENTE')) 
            || window.App.state.listaProductosOriginal 
            || window.CatalogoB2B?.productos 
            || [];

        if (inventarioVivo.some(p => p.sku === skuLimpio)) {
            alert(`⚠️ Error: El SKU ${skuLimpio} ya existe.`);
            return;
        }

        const nuevoItem = { sku: skuLimpio, nombre: nombreLimpio, precio_usd: costoUsd, stock: stockIngresado, categoria: proveedor };
        inventarioVivo.push(nuevoItem);

        window.App.state.listaProductosOriginal = inventarioVivo;
        localStorage.setItem('APIO_INVENTARIO_PERSISTENTE', JSON.stringify(inventarioVivo));
        
        if (window.CatalogoB2B) window.CatalogoB2B.productos = inventarioVivo;
        
        if (typeof window.recalcularGrillaCatalogoB2BEnCaliente === 'function') {
            window.recalcularGrillaCatalogoB2BEnCaliente();
        }

        const formularioIngreso = document.getElementById('form-ingreso-inventario-nuevo');
        if (formularioIngreso) formularioIngreso.reset();
        
        alert(`🏆 ¡Inventario Actualizado!\n• Producto: ${nombreLimpio}\n• Cantidad: +${stockIngresado} Unidades.`);
    }, // 🎯 CANDADO DE CONTINUIDAD: Cierre limpio con coma para dar paso al bloque por bloque.

        // =========================================================================
    // 💳 EXTENSIÓN E: CONCILIADOR DE RECAUDACIÓN EN CALIENTE (SOTO FINANCIAL ENGINE)
    // =========================================================================
    calcularConciliacionCobranzasTurno() {
        console.log("📡 [SOTO FINANCIAL]: Ejecutando auditoría de flujos en caja...");
        
        // Pescamos el historial de facturas vivas desde el estado local de tu RAM
        const movimientos = this.state?.movimientosDiarios || [];

        let acumuladoPagoMovil = 0.00;
        let acumuladoBiopago = 0.00;
        let acumuladoEfectivoUsd = 0.00;

        // Recorremos las ventas hechas en el mostrador para desglosar canales
        movimientos.forEach(mov => {
            const metodo = (mov.metodo || mov.metodo_pago || "").toUpperCase().trim();
            const montoBs = parseFloat(mov.montoBs || mov.total_bs || 0.00);
            const montoUsd = parseFloat(mov.montoUsd || mov.total_usd || 0.00);

            if (metodo.includes("PAGO MÓVIL") || metodo.includes("PAGOMOVIL")) {
                acumuladoPagoMovil += montoBs;
            } else if (metodo.includes("BIOPAGO") || metodo.includes("TARJETA")) {
                acumuladoBiopago += montoBs;
            } else if (metodo.includes("EFECTIVO")) {
                acumuladoEfectivoUsd += montoUsd;
            }
        });

        // Inyectamos las sumas matemáticas formateadas directo en la pizarra fiscal
        const txtPM = document.getElementById('cobranza-pago-movil');
        const txtBio = document.getElementById('cobranza-biopago');
        const txtEfe = document.getElementById('cobranza-efectivo');

        if (txtPM) txtPM.innerText = `${acumuladoPagoMovil.toLocaleString('es-VE', {minimumFractionDigits: 2})} Bs.`;
        if (txtBio) txtBio.innerText = `${acumuladoBiopago.toLocaleString('es-VE', {minimumFractionDigits: 2})} Bs.`;
        if (txtEfe) txtEfe.innerText = `$${acumuladoEfectivoUsd.toFixed(2)}`;
    }, // 🎯 COMA OBLIGATORIA: Cierra el Bloque E y le abre paso limpio a la Extensión F

        // =========================================================================
    // 👤 EXTENSIÓN F: MÁNAGER DE VENDEDORES Y OPERADORES DE TAQUILLA
    // =========================================================================
    registrarCambioVendedorTurno() {
        const selectorVendedor = document.getElementById('erp-vendedor-activo');
        if (!selectorVendedor) return;

        const vendedorSeleccionado = selectorVendedor.value;
        
        // Persistimos el nombre del cajero para que la pasarela lo adose a cada factura
        localStorage.setItem('APIO_CAJERO_ACTIVO', vendedorSeleccionado);
        console.log(`👤 [SOTO AUDIT]: Operador de caja actualizado -> "${vendedorSeleccionado}"`);
        
        // Sincronizamos con el estado global de tu SPA por seguridad
        if (!window.App) window.App = {};
        if (!window.App.state) window.App.state = {};
        window.App.state.cajeroTurnoActual = vendedorSeleccionado;
    }, // 🎯 COMA OBLIGATORIA: Cierra el Bloque F y le abre paso limpio a la Extensión G (Gastos)

            // =========================================================================
    // 💸 EXTENSIÓN G: REGISTRO DE GASTOS EXPRESS, HISTORIAL VIVO Y REPORTE PDF
    // =========================================================================
    registrarGastoMensualExpress() {
        const descInput = document.getElementById('gasto-descripcion');
        const montoInput = document.getElementById('gasto-monto');
        
        if (!descInput || !montoInput || !descInput.value.trim() || !montoInput.value) {
            alert("⚠️ Campos Incompletos: Por favor, ingrese la descripción y el monto en dólares del egreso contable.");
            return;
        }
        
        const descripcionLimpia = descInput.value.trim();
        const montoEgreso = parseFloat(montoInput.value) || 0.00;

        const gastosPersistidos = JSON.parse(localStorage.getItem('APIO_GASTOS_MES')) || [];
        
        gastosPersistidos.push({
            descripcion: descripcionLimpia,
            monto: montoEgreso,
            fecha: new Date().toLocaleDateString('es-VE')
        });
        
        localStorage.setItem('APIO_GASTOS_MES', JSON.stringify(gastosPersistidos));
        
        // 🔄 RENDERIZADO EN CALIENTE: Refrescamos la micro-tabla de inmediato
        this.renderizarHistorialGastosLocal();
        
        alert(`📉 ¡Egreso Aplicado!\n\n• Concepto: ${descripcionLimpia}\n• Impacto en Caja: -$${montoEgreso.toFixed(2)} USD.`);
        
        descInput.value = "";
        montoInput.value = "";
    },

    renderizarHistorialGastosLocal() {
        const cuerpoTabla = document.getElementById('lista-gastos-cuerpo');
        if (!cuerpoTabla) return;

        const gastos = JSON.parse(localStorage.getItem('APIO_GASTOS_MES')) || [];

        if (gastos.length === 0) {
            cuerpoTabla.innerHTML = `<tr><td colspan="2" style="padding: 8px 0; text-align: center; color: #475569; font-family: sans-serif; font-style: italic;">No se registran egresos operacionales en el turno actual.</td></tr>`;
            return;
        }

        // Mapeamos el arreglo persistido a filas reales del DOM
        cuerpoTabla.innerHTML = gastos.map(g => `
            <tr style="border-bottom: 1px solid #111827;">
                <td style="padding: 6px 0; font-family: sans-serif; font-weight: 600; color: #fff;">${g.descripcion} <span style="font-size: 9px; color: #475569; font-weight: normal; margin-left: 6px;">(${g.fecha})</span></td>
                <td style="padding: 6px 0; text-align: right; color: #ef4444; font-weight: bold;">-$${g.monto.toFixed(2)}</td>
            </tr>
        `).join('');
    },

    descargarGastosMesPdf() {
        const gastos = JSON.parse(localStorage.getItem('APIO_GASTOS_MES')) || [];
        if (gastos.length === 0) {
            alert("⚠️ Libro de Egresos Vacío: No se puede generar un PDF debido a que no existen gastos registrados en la jornada.");
            return;
        }

        console.log("📡 [SOTO CLOUD]: Despachando balance de egresos operativos al compilador de ReportLab...");
        const iframeGastos = document.createElement('iframe');
        iframeGastos.style.display = 'none';
        document.body.appendChild(iframeGastos);

        // Disparamos la petición nativa segura de Electron hacia tu Django
        window.fetch('https://apio-ecomerce-software-b2b-sotosystem-production.up.railway.app/api/v1/descargar-gastos-pdf/'
, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                "origen": "Electron Desktop ERP Master Gastos",
                "tipo_reporte": "EGRESOS_OPERATIVOS",
                "libro_gastos": gastos 
            })
        })
        .then(res => {
            if (!res.ok) {
                if (document.body.contains(iframeGastos)) document.body.removeChild(iframeGastos);
                throw new Error("Rebote fiscal en el motor de egresos de Django");
            }
            return res.blob();
        })
        .then(blobPdf => {
            const urlDescarga = window.URL.createObjectURL(blobPdf);
            const enlace = document.createElement('a');
            enlace.href = urlDescarga;
            enlace.download = `LIBRO_DE_GASTOS_MERCANTIL_${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(enlace);
            enlace.click();
            enlace.remove();
            if (document.body.contains(iframeGastos)) document.body.removeChild(iframeGastos);
            console.log("✅ [SOTO ERP]: Libro de Gastos Digital descargado con éxito en Windows.");
        })
        .catch(err => {
            console.error("❌ Falla Gastos PDF:", err.message);
            if (document.body.contains(iframeGastos)) document.body.removeChild(iframeGastos);
            alert("⚠️ Error: No se pudo conectar con el compilador contable cloud.");
        });
    }, // 🎯 COMA OBLIGATORIA: Cierra el Bloque G extendido en limpia continuidad
}; 

// Vinculamos una referencia local interna para sostener los métodos del enrutador
const ErpModulo = window.ErpModulo;

// =========================================================================
// 🚀 METODO RENDER: ESTRUCTURACIÓN LINEAL Y CANDADO DE POSITION DEL FOOTER
// =========================================================================
ErpModulo.render = function() {
    // Saneamos la importación para sostener la línea de Home encendida en VS Code
    if (typeof Home !== 'undefined' && false) { console.log(Home); }

    // 1. Contenedor Maestro de la Pantalla Completa (Usa Flexbox para empujar el footer)
    const section = document.createElement('section');
    section.id = "contenedor-erp-contable-modulo";
    section.className = "apio-erp-wrapper";
    section.style.cssText = "display: flex; flex-direction: column; width: 100%; min-height: calc(100vh - 85px); box-sizing: border-box; background-color: #0d1117; padding: 20px; margin: 0;";

    // 2. HERENCIA DEL HEADER GLOBAL: Se acopla arriba de la sección raíz de forma limpia
    if (typeof Home !== 'undefined' && typeof Home.renderMasterHeader === 'function') {
        section.appendChild(Home.renderMasterHeader());
    } else if (window.App && typeof window.App.renderMasterHeader === 'function') {
        section.appendChild(window.App.renderMasterHeader());
    }

    // 3. Consola Maestra del ERP Contable (La gran Tarjeta que encapsula los componentes)
    const erpPanel = document.createElement('div');
    erpPanel.style.cssText = "background-color: #0b0f19; padding: 35px 28px; border-radius: 12px; border: 1px solid #1e293b; border-left: 4px solid #a855f7; max-width: 1200px; width: 100%; box-shadow: 0 0 25px rgba(168, 85, 247, 0.15), 0 20px 40px rgba(0,0,0,0.7); font-family: 'Inter', sans-serif; margin: 20px auto; box-sizing: border-box; color: #ffffff; overflow: hidden; position: relative;";


    // Adjuntamos la tarjeta consolidada al lienzo principal de la sección
    section.appendChild(erpPanel);

    // 4. 🎯 EL CANDADO DE ACOPLE DEL FOOTER MAESTRO (COMPLETAMENTE AISLADO DE LA TARJETA)
    if (typeof Home !== 'undefined' && typeof Home.renderFooter === 'function') {
        const footerOriginal = Home.renderFooter();
        if (footerOriginal) {
            footerOriginal.style.position = 'static'; 
            footerOriginal.style.display = 'block';
            footerOriginal.style.width = '100%';
            footerOriginal.style.marginTop = 'auto'; // Truco maestro Flexbox: empuja el footer al fondo absoluto de la sección
            section.appendChild(footerOriginal);
            console.log("📥 [SOTO CORE]: Footer original acoplado de forma indestructible abajo del todo.");
        }
    } else if (typeof Home !== 'undefined' && typeof Home.renderMasterFooter === 'function') {
        const footerMaster = Home.renderMasterFooter();
        if (footerMaster) {
            footerMaster.style.position = 'static';
            footerMaster.style.display = 'block';
            footerMaster.style.marginTop = 'auto';
            section.appendChild(footerMaster);
        }
    }

    // Disparamos la reinyección de las filas a los 50ms para no trancar el hilo del DOM
    setTimeout(() => {
        if (typeof ErpModulo.reinyectarFilasTabla === 'function') {
            ErpModulo.reinyectarFilasTabla();
        }
    }, 50);

    return section;
};

// =========================================================================
// 🔌 INICIALIZADOR ASINCRONO SANEADO: SIN APENDICES FANTASMAS
// =========================================================================
ErpModulo.init = function() {
    console.log("📡 [SOTO CORE ENGINE]: Sincronizando datos persistentes del ERP...");
    const appContainerGeneral = document.getElementById('contenedor-interno') || document.body;
    
    if (appContainerGeneral) {
        appContainerGeneral.innerHTML = '';
        appContainerGeneral.appendChild(ErpModulo.render());
        if (typeof ErpModulo.renderizarHistorialGastosLocal === 'function') {
            ErpModulo.renderizarHistorialGastosLocal();
        }
        console.log("🛡️ [SOTO CORE]: Ciclo de renderizado ERP completado con éxito.");
    }
};

// =========================================================================
// 📡 ENLAZADO FINAL HOMOLOGADO PARA ELECTRON Y VITE (LÍNEAS FINALES)
// =========================================================================
window.ErpModulo = ErpModulo; 
export { ErpModulo };
