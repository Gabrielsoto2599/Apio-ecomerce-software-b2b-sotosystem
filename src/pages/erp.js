// =========================================================================
// BLOQUE 0: CONTROL DE IMPORTACIONES Y CORE ADMINISTRATIVO (MVP 2026)
// Ubicación: src/pages/erp.js -> Saneamiento del Puntero Global
// =========================================================================
import { Home } from './home.js';

// 🎯 REPARACIÓN MÁSTER SOTO SYSTEM: Amarramos el objeto global "window" de inmediato
if (!window.ErpModulo) {
    window.ErpModulo = {
        state: {
            movimientosDiarios: [], 
            cierreEjecutado: false,
            tasaDolarActual: parseFloat(localStorage.getItem('APIO_TASA_CAMBIARIA')) || 40.00,
            listaProductosOriginal: JSON.parse(localStorage.getItem('APIO_INVENTARIO_PERSISTENTE')) || []
        },
        verificarEstadoSalud: function() {
            return "OK";
        }
    };
}

// Creamos un alias local apuntando al espacio global para que tus funciones (window.ErpModulo.nombre) engranen al 100%
const ErpModulo = window.ErpModulo;

// =========================================================================
// 🎛️ PARTE 1-A: CONSTRUCTOR DEL LIENZO Y APERTURA DE PLANTILLA ATÓMICA
// Ubicación: src/pages/erp.js -> Espacio Central (Fase 1 de Prueba Visual)
// =========================================================================
ErpModulo.render = function() {
    // Saneamos la importación para sostener la línea de Home encendida en VS Code
    if (typeof Home !== 'undefined' && false) { console.log(Home); }

    // 1. Contenedor Maestro de la Pantalla Completa (Se acopla de forma nativa en el pageBody)
    const section = document.createElement('section');
    section.id = "contenedor-erp-contable-modulo";
    section.className = "apio-erp-wrapper";
    section.style.cssText = "display: flex; flex-direction: column; width: 100%; box-sizing: border-box; background-color: #0b0e14; padding: 20px; margin: 0;";

    // 2. Consola Maestra del ERP Contable (La gran tarjeta contenedora con iluminación lateral)
    const erpPanel = document.createElement('div');
    erpPanel.id = "apio-erp-panel-tarjeta";
    erpPanel.style.styleHtml = ""; // Resguardo limpio de estilos inline
    erpPanel.style.cssText = "background-color: #0b0f19; padding: 35px 28px; border-radius: 12px; border: 1px solid #1e293b; border-left: 4px solid #a855f7; max-width: 1200px; width: 100%; box-shadow: 0 0 25px rgba(168, 85, 247, 0.15), 0 20px 40px rgba(0,0,0,0.7); font-family: 'Inter', sans-serif; margin: 20px auto; box-sizing: border-box; color: #ffffff; overflow: hidden; position: relative;";

    // 3. Abrimos la plantilla unificada continua inyectando los botones fiscales
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
            <!-- 🟣 Botón Cierre de Caja Diario -->
            <button type="button" onclick="window.ErpModulo.ejecutarCierreYGenerarPdf()" style="background: linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%); color:white; border:none; padding:14px; border-radius:8px; font-weight:bold; cursor:pointer; text-transform:uppercase; font-size:11px; font-family:'Inter',sans-serif; box-shadow: 0 4px 12px rgba(124,58,237,0.3); transition: transform 0.2s;">
                🟣 Cierre Diario (PDF)
            </button>

            <!-- 🔵 Botón Cierre Semanal Consolidado -->
            <button type="button" onclick="window.ErpModulo.ejecutarCierreSemanalPdf()" style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color:white; border:none; padding:14px; border-radius:8px; font-weight:bold; cursor:pointer; text-transform:uppercase; font-size:11px; font-family:'Inter',sans-serif; box-shadow: 0 4px 12px rgba(37,99,235,0.3); transition: transform 0.2s;">
                🔵 Cierre Semanal (PDF)
            </button>

                    <!-- 🟢 Botón Reporte Mes Fiscal SENIAT -->
        <button type="button" onclick="window.ErpModulo.ejecutarCierreMensualPdf()" style="background: linear-gradient(135deg, #10b981 0%, #047857 100%); color:white; border:none; padding:14px; border-radius:8px; font-weight:bold; cursor:pointer; text-transform:uppercase; font-size:11px; font-family:'Inter',sans-serif; box-shadow: 0 4px 12px rgba(16,185,129,0.3); transition: transform 0.2s;">
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

                   <!-- Indicador Neón de Rendimiento Integrado -->
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

    <!-- 👤 EXTENSIÓN F: MÁNAGER OPERACIONAL DE VENDEDORES Y CAJEROS ACTIVOS -->
    <div id="vendedores-card-container" style="margin-bottom: 24px; font-family: 'Inter', sans-serif; width: 100%; box-sizing: border-box;">
        <div style="background: linear-gradient(135deg, #0f1526 0%, #030a16 100%); padding: 18px; border-radius: 10px; border: 1px solid #1e293b; border-left: 5px solid #8b5cf6; box-shadow: 0 4px 15px rgba(139, 92, 246, 0.15); display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; align-items: center; width: 100%; box-sizing: border-box;">
            
            <!-- Bloque de Texto Saneado -->
            <div style="width: 100%;">
                <span style="font-size: 10px; color: #a78bfa; font-weight: 800; text-transform: uppercase; display: block; margin-bottom: 4px; letter-spacing: 0.08em;">👤 Control y Auditoría de Personal</span>
                <h4 style="margin: 0; color: #ffffff; font-size: 14px; font-weight: 700; letter-spacing: -0.01em;">Asignación de Operador en Taquilla</h4>
            </div>

                           <!-- Selector Estilizado Comercial -->
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
                    <!-- Botón Fiscal para Descarga del Reporte de Gastos -->
                    <button type="button" onclick="window.ErpModulo.descargarGastosMesPdf()" style="padding: 6px 12px; background: linear-gradient(135deg, #374151 0%, #1f2937 100%); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 4px; font-size: 10px; font-weight: 800; cursor: pointer; text-transform: uppercase; font-family: 'Inter', sans-serif; letter-spacing: 0.05em; display: flex; align-items: center; gap: 6px;">
                        🖨️ Reporte Gastos (PDF)
                    </button>
                </div>
                
                <!-- Formulario Inline Adaptativo -->
                <div style="display: flex; gap: 12px; flex-wrap: wrap; width: 100%; box-sizing: border-box; margin-bottom: 15px;">
                    <input type="text" id="gasto-descripcion" placeholder="Ej: Pago de Luz CORPOELEC" style="flex: 2; min-width: 200px; padding: 10px; background: #030712; border: 1px solid #334155; color: #fff; border-radius: 6px; font-size: 12px; font-family: 'Inter', sans-serif; outline: none;">
                    <input type="number" id="gasto-monto" placeholder="Monto $" style="flex: 1; min-width: 100px; padding: 10px; background: #030712; border: 1px solid #334155; color: #fff; border-radius: 6px; font-size: 12px; font-weight: bold; font-family: monospace; text-align: center; outline: none;">
                    <button type="button" onclick="window.ErpModulo.registrarGastoMensualExpress()" style="flex: 1; min-width: 150px; padding: 10px 16px; background: linear-gradient(135deg, #ef4444 0%, #991b1b 100%); color: #fff; border: none; border-radius: 6px; font-size: 11px; font-weight: 800; cursor: pointer; text-transform: uppercase; letter-spacing: 0.05em; font-family: 'Inter', sans-serif; box-shadow: 0 4px 10px rgba(239, 68, 68, 0.2); transition: all 0.2s;">
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
                            <tr>
                                <td colspan="2" style="padding: 8px 0; text-align: center; color: #475569; font-style: italic;">No se registran egresos operacionales en el turno actual.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </div>

        <!-- 📦 EXTENSIÓN H: CONSOLA DE INGRESO DE MERCANCÍA NUEVA (LIBRO CONTABLE DE PROVEEDORES) -->
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

        <!-- 📊 EXTENSIÓN I: HISTORIAL DE TRANSACCIONES ENVOLVENTE -->
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
    `; // 🔒 CIERRE OFICIAL DEL TEMPLATE STRING DE TU INTERFAZ

    // Enganchamos físicamente la gran tarjeta morada adentro de la sección unificada
    section.appendChild(erpPanel);

    // Disparamos la reinyección diferida a los 50ms para no trancar el hilo del DOM en Electron
    setTimeout(() => {
        if (typeof ErpModulo.reinyectarFilasTabla === 'function') {
            ErpModulo.reinyectarFilasTabla();
        }
    }, 50);

    return section;
}; // 🔒 AQUÍ CIERRA TU MÉTODO RENDER CON LLAVE Y PUNTO Y COMA, SIN COMAS.

// =========================================================================
// 🧠 BLOQUE 2 (PARTE 1): PROCESADORES LÓGICOS ASIGNADOS (SOTO FINANCIAL ENGINE)
// Ubicación: src/pages/erp.js -> Continuación de la lógica pura del ERP
// =========================================================================

// 🎯 BLINDAJE SOTO SYSTEM: Aseguramos el objeto global antes de adosarle métodos lógicos
if (!window.ErpModulo) window.ErpModulo = {};

// Ahora tu función se enlazará de forma perfecta sin lanzar TypeErrors:
window.ErpModulo.reinyectarFilasTabla = function() {
    const tbody = document.getElementById('erp-movimientos-diarios-rows');
    if (!tbody) return;

    // Accedemos de forma segura a la RAM del objeto global
    const lista = window.ErpModulo.state.movimientosDiarios || [];
    
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
}; // 🔒 CANDADO DE CIERRE: Finaliza de forma legal con llave y punto y coma, sin comas.

// =========================================================================
// 🔒 LA FÓRMULA DE GABRIEL BLINDADA: Cierre de Caja con Descarga Asíncrona de PDF
// Ubicación: src/pages/erp.js -> Siguiente procesador del Bloque 2 en línea
// =========================================================================
window.ErpModulo.ejecutarCierreYGenerarPdf = function() {
    console.log("🔒 [Apio ERP Core]: Evaluando registros para inicio de auditoría final...");
    const movimientos = window.ErpModulo.state.movimientosDiarios || [];

    if (movimientos.length === 0) {
        alert("⚠️ Operación Denegada: No se puede ejecutar el Cierre de Caja debido a que el Historial de Movimientos se encuentra vacío.");
        return;
    }

    const tasaDolarActual = parseFloat(window.App?.state?.tasaDelDia || 40.00);
    console.log(`📡 [SOTO ENGINE]: Despachando ${movimientos.length} transacciones vivas al motor ReportLab a tasa ${tasaDolarActual} Bs.`);

    const movimientosMapeados = movimientos.map(mov => ({
        ref: mov.ref || mov.numero_factura || 'TR-N/A',
        cedula: mov.cedula || mov.cliente_identificacion || 'V-99999999',
        metodo: mov.metodo || mov.metodo_pago || 'BIOPAGO',
        montoBs: parseFloat(mov.montoBs || mov.total_bs || 0.00),
        productos: mov.productos || mov.productos_despachados || 'Mercancía General'
    }));

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
                "movimientos_jornada": movimientosMapeados 
            })
        })
        .then(res => {
            if (!res.ok) throw new Error("Rebote fiscal en el motor diario de Django (Status: " + res.status + ")");
            return res.blob();
        })
        .then(blob => {
            const urlDescarga = window.URL.createObjectURL(blob);
            const enlaceDescarga = document.createElement('a');
            const fechaLocal = new Date().toLocaleDateString('sv-SE');
            
            enlaceDescarga.href = urlDescarga;
            enlaceDescarga.download = `Cierre_Diario_ERP_${fechaLocal}.pdf`;
            
            document.body.appendChild(enlaceDescarga);
            enlaceDescarga.click();
            enlaceDescarga.remove();
            console.log("✅ [SOTO ERP]: Cierre Diario PDF descargado con éxito.");
        })
        .catch(error => {
            console.error("❌ Error de comunicación en Apio ERP Engine:", error.message);
            alert("⚠️ Error: No se pudo conectar con el servidor contable cloud.");
        });
    }, 50);
}; // 🔒 Cierre legal con punto y coma

// =========================================================================
// 📅 EXTENSIÓN A: COMPILADOR DE CONSOLIDADO SEMANAL (REPORTLAB)
// Ubicación: src/pages/erp.js -> Siguiente procesador del Bloque 2 en línea
// =========================================================================
window.ErpModulo.ejecutarCierreSemanalPdf = function() {
    console.log("📡 [SOTO CLOUD]: Generando balance consolidado de 7 días...");

    window.fetch('https://apio-ecomerce-software-b2b-sotosystem-production.up.railway.app/api/v1/ejecutar-cierre-semanal/', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/pdf'
        },
        body: JSON.stringify({ "origen": "Electron Desktop ERP Master Semanal" })
    })
    .then(res => {
        if (!res.ok) throw new Error("Rebote fiscal en el motor semanal de Django (Status: " + res.status + ")");
        return res.blob();
    })
    .then(blobPdf => {
        const urlDescarga = window.URL.createObjectURL(blobPdf);
        const enlace = document.createElement('a');
        const fechaLocal = new Date().toLocaleDateString('sv-SE');
        
        enlace.href = urlDescarga;
        enlace.download = `CIERRE_SEMANAL_${fechaLocal}.pdf`;
        document.body.appendChild(enlace);
        enlace.click();
        enlace.remove();
        console.log("📅 [BALANCE SEMANAL COMPLETADO]: Reporte emitido.");
    })
    .catch(err => {
        console.error("❌ Falla Semanal:", err.message);
        alert("⚠️ Alerta: Error de comunicación con el motor semanal.");
    });
}; // 🔒 Cierre legal con punto y coma

// =========================================================================
// 🏛️ EXTENSIÓN B: REPORTE DE MES FISCAL - DECLARACIÓN IVA 16% (SENIAT)
// Ubicación: src/pages/erp.js -> Siguiente procesador del Bloque 2 en línea
// =========================================================================
window.ErpModulo.ejecutarCierreMensualPdf = function() {
    console.log("📡 [SOTO CLOUD]: Compilando libro de ventas del mes...");

    window.fetch('https://apio-ecomerce-software-b2b-sotosystem-production.up.railway.app/api/v1/ejecutar-cierre-mensual/', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/pdf'
        },
        body: JSON.stringify({ "origen": "Electron Desktop ERP Master Mensual" })
    })
    .then(res => {
        if (!res.ok) throw new Error("Rebote impositivo en Django (Status: " + res.status + ")");
        return res.blob();
    })
    .then(blobPdf => {
        const urlDescarga = window.URL.createObjectURL(blobPdf);
        const enlace = document.createElement('a');
        const fechaLocal = new Date().toLocaleDateString('sv-SE');
        
        enlace.href = urlDescarga;
        enlace.download = `REPORTE_MENSUAL_FISCAL_${fechaLocal}.pdf`;
        document.body.appendChild(enlace);
        enlace.click();
        enlace.remove();
        console.log("🏛️ [REPORTE FISCAL MENSUAL EMITIDO - SENIAT VENEZUELA]");
    })
    .catch(err => {
        console.error("❌ Falla Mensual:", err.message);
        alert("⚠️ Alerta: Error de comunicación con el motor del SENIAT.");
    });
}; // 🔒 Cierre legal con punto y coma

// =========================================================================
// 📦 EXTENSIÓN C: INYECTOR DE MERCANCÍA NUEVA PERSISTENTE (PROVEEDORES POLAR/TUNAL)
// Ubicación: src/pages/erp.js -> Siguiente procesador del Bloque 2 en línea
// =========================================================================
window.ErpModulo.ingresarMercanciaNuevaManual = function() {
    const txtSku = document.getElementById('inv-sku');
    const txtNombre = document.getElementById('inv-nombre');
    const selProveedor = document.getElementById('inv-proveedor');
    const numPrecio = document.getElementById('inv-precio');
    const numStock = document.getElementById('inv-stock');

    if (!txtSku || !txtNombre || !selProveedor || !numPrecio || !numStock) return;

    // SANEAMIENTO CORE: Forzamos mayúsculas para evitar duplicaciones accidentales por tipeo
    const skuLimpio = txtSku.value.trim().toUpperCase();
    const nombreLimpio = txtNombre.value.trim();
    const proveedor = selProveedor.value;
    const costoUsd = parseFloat(numPrecio.value) || 1.00;
    const stockIngresado = parseInt(numStock.value) || 0;

    let inventarioVivo = JSON.parse(localStorage.getItem('APIO_INVENTARIO_PERSISTENTE')) 
        || window.App?.state?.listaProductosOriginal 
        || window.CatalogoB2B?.productos 
        || [];

    // Verificamos colisión de llaves primarias en la memoria persistente antes de inyectar
    if (inventarioVivo.some(p => p.sku === skuLimpio)) {
        alert(`⚠️ Error: El SKU ${skuLimpio} ya existe en el catálogo.`);
        return;
    }

    const nuevoItem = { sku: skuLimpio, nombre: nombreLimpio, precio_usd: costoUsd, stock: stockIngresado, categoria: proveedor };
    inventarioVivo.push(nuevoItem);

    // Sincronizamos simétricamente todas las capas de memoria RAM y almacenamiento local
    if (window.App && window.App.state) window.App.state.listaProductosOriginal = inventarioVivo;
    localStorage.setItem('APIO_INVENTARIO_PERSISTENTE', JSON.stringify(inventarioVivo));
    
    if (window.CatalogoB2B) window.CatalogoB2B.productos = inventarioVivo;
    
    if (typeof window.recalcularGrillaCatalogoB2BEnCaliente === 'function') {
        window.recalcularGrillaCatalogoB2BEnCaliente();
    }

    const formularioIngreso = document.getElementById('form-ingreso-inventario-nuevo');
    if (formularioIngreso) formularioIngreso.reset();
    
    alert(`🏆 ¡Inventario Actualizado!\n\n• Producto: ${nombreLimpio}\n• Cantidad: +${stockIngresado} Unidades.`);
}; // 🔒 Cierre legal con punto y coma

 // =========================================================================
// 💳 EXTENSIÓN E: CONCILIADOR DE RECAUDACIÓN EN CALIENTE (SOTO FINANCIAL ENGINE)
// Ubicación: src/pages/erp.js -> Siguiente procesador del Bloque 2 en línea
// =========================================================================
window.ErpModulo.calcularConciliacionCobranzasTurno = function() {
    console.log("📡 [SOTO FINANCIAL]: Ejecutando auditoría de flujos en caja...");
    
    // Accedemos de forma segura a la RAM del objeto de la ventana
    const movimientos = window.ErpModulo.state?.movimientosDiarios || [];

    let acumuladoPagoMovil = 0.00;
    let acumuladoBiopago = 0.00;
    let acumuladoEfectivoUsd = 0.00;

    movimientos.forEach(mov => {
        const metodo = (mov.metodo || mov.metodo_pago || "").toUpperCase().trim();
        const montoBs = parseFloat(mov.montoBs || mov.total_bs || 0.00);
        const montoUsd = parseFloat(mov.montoUsd || mov.total_usd || 0.00);

        // CORE REPAIR: Barrido elástico con y sin acentos para evitar pérdidas contables en taquilla
        if (metodo.includes("PAGO MÓVIL") || metodo.includes("PAGO MOVIL") || metodo.includes("PAGOMOVIL")) {
            acumuladoPagoMovil += montoBs;
        } else if (metodo.includes("BIOPAGO") || metodo.includes("TARJETA")) {
            acumuladoBiopago += montoBs;
        } else if (metodo.includes("EFECTIVO")) {
            acumuladoEfectivoUsd += montoUsd;
        }
    });

    const txtPM = document.getElementById('cobranza-pago-movil');
    const txtBio = document.getElementById('cobranza-biopago');
    const txtEfe = document.getElementById('cobranza-efectivo');

    if (txtPM) txtPM.innerText = `${acumuladoPagoMovil.toLocaleString('es-VE', {minimumFractionDigits: 2})} Bs.`;
    if (txtBio) txtBio.innerText = `${acumuladoBiopago.toLocaleString('es-VE', {minimumFractionDigits: 2})} Bs.`;
    if (txtEfe) txtEfe.innerText = `$${acumuladoEfectivoUsd.toFixed(2)}`;
}; // 🔒 Cierre legal con llave y punto y coma, sin comas sueltas inter-bloques.

// =========================================================================
// 👤 EXTENSIÓN F: MÁNAGER DE VENDEDORES Y OPERADORES DE TAQUILLA
// Ubicación: src/pages/erp.js -> Siguiente procesador del Bloque 2 en línea
// =========================================================================
window.ErpModulo.registrarCambioVendedorTurno = function() {
    const selectorVendedor = document.getElementById('erp-vendedor-activo');
    if (!selectorVendedor) return;

    const vendedorSeleccionado = selectorVendedor.value;
    
    localStorage.setItem('APIO_CAJERO_ACTIVO', vendedorSeleccionado);
    console.log(`👤 [SOTO AUDIT]: Operador de caja actualizado -> "${vendedorSeleccionado}"`);
    
    if (!window.App) window.App = {};
    if (!window.App.state) window.App.state = {};
    window.App.state.cajeroTurnoActual = vendedorSeleccionado;
}; // 🔒 Cierre legal con llave y punto y coma.

// =========================================================================
// 💸 EXTENSIÓN G: REGISTRO DE GASTOS EXPRESS Y HISTORIAL VIVO SANITIZADO
// Ubicación: src/pages/erp.js -> Siguiente procesador del Bloque 2 en línea
// =========================================================================
window.ErpModulo.registrarGastoMensualExpress = function() {
    const descInput = document.getElementById('gasto-descripcion');
    const montoInput = document.getElementById('gasto-monto');
    
    if (!descInput || !montoInput || !descInput.value.trim() || !montoInput.value) {
        alert("⚠️ Campos Incompletos: Por favor, ingrese la descripción y el monto del egreso contable.");
        return;
    }
    
    const descripcionLimpia = descInput.value.trim();
    const montoEgreso = parseFloat(montoInput.value) || 0.00;

    // VALIDACIÓN FISCAL: Protegemos la caja contra montos inválidos o negativos
    if (montoEgreso <= 0) {
        alert("⚠️ Error contable: El monto del egreso debe ser mayor a cero.");
        return;
    }

    const gastosPersistidos = JSON.parse(localStorage.getItem('APIO_GASTOS_MES')) || [];
    gastosPersistidos.push({
        descripcion: descripcionLimpia,
        monto: montoEgreso,
        fecha: new Date().toLocaleDateString('es-VE')
    });
    
    localStorage.setItem('APIO_GASTOS_MES', JSON.stringify(gastosPersistidos));
    
    // Invocamos el refresco dinámico de la micro-tabla de egresos
    window.ErpModulo.renderizarHistorialGastosLocal();
    
    alert(`📉 ¡Egreso Aplicado!\n\n• Concepto: ${descripcionLimpia}\n• Impacto en Caja: -$${montoEgreso.toFixed(2)} USD.`);
    descInput.value = "";
    montoInput.value = "";
}; // 🔒 Cierre lineal con punto y coma

window.ErpModulo.renderizarHistorialGastosLocal = function() {
    const cuerpoTabla = document.getElementById('lista-gastos-cuerpo');
    if (!cuerpoTabla) return;

    const gastos = JSON.parse(localStorage.getItem('APIO_GASTOS_MES')) || [];

    if (gastos.length === 0) {
        cuerpoTabla.innerHTML = `<tr><td colspan="2" style="padding: 8px 0; text-align: center; color: #475569; font-style: italic;">No se registran egresos operacionales en el turno actual.</td></tr>`;
        return;
    }

    // SANITIZACIÓN CORE: Usamos nodos del DOM y .innerText para neutralizar inyecciones de código en Electron
    cuerpoTabla.innerHTML = '';
    gastos.forEach(g => {
        const tr = document.createElement('tr');
        tr.style.borderBottom = "1px solid #111827";

        const tdDesc = document.createElement('td');
        tdDesc.style.cssText = "padding: 6px 0; font-family: sans-serif; font-weight: 600; color: #fff;";
        tdDesc.innerText = g.descripcion;

        const spanFecha = document.createElement('span');
        spanFecha.style.cssText = "font-size: 9px; color: #475569; font-weight: normal; margin-left: 6px;";
        spanFecha.innerText = ` (${g.fecha})`;
        tdDesc.appendChild(spanFecha);

        const tdMonto = document.createElement('td');
        tdMonto.style.cssText = "padding: 6px 0; text-align: right; color: #ef4444; font-weight: bold;";
        tdMonto.innerText = `-$${g.monto.toFixed(2)}`;

        tr.appendChild(tdDesc);
        tr.appendChild(tdMonto);
        cuerpoTabla.appendChild(tr);
    });
}; // 🔒 Cierre lineal con punto y coma

// =========================================================================
// 🖨️ EMISOR ASINCRONO: COMPILADOR DEL REPORTE DE EGRESOS EN DJANGO (REPORTLAB)
// Ubicación: src/pages/erp.js -> Cierre de la Extensión G
// =========================================================================
window.ErpModulo.descargarGastosMesPdf = function() {
    const gastos = JSON.parse(localStorage.getItem('APIO_GASTOS_MES')) || [];
    if (gastos.length === 0) {
        alert("⚠️ Libro de Egresos Vacío: No se puede generar un PDF debido a que no existen gastos registrados.");
        return;
    }

    console.log("📡 [SOTO CLOUD]: Despachando balance de egresos operativos al compilador de ReportLab...");
    
    // 🎯 REPARACIÓN DE ENDPOINT: Apunta con precisión milimétrica a tu ruta real de Django en Railway
    window.fetch('https://apio-ecomerce-software-b2b-sotosystem-production.up.railway.app/api/v1/descargar-gastos-pdf/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            "origen": "Electron Desktop ERP Master Gastos",
            "tipo_reporte": "EGRESOS_OPERATIVOS",
            "libro_gastos": gastos 
        })
    })
    .then(res => {
        if (!res.ok) throw new Error("Rebote fiscal en el motor de egresos de Django");
        return res.blob();
    })
    .then(blobPdf => {
        const urlDescarga = window.URL.createObjectURL(blobPdf);
        const enlace = document.createElement('a');
        
        // SANEAMIENTO DE FECHA: Estampamos el nombre del archivo con el huso horario local de Venezuela (AAAA-MM-DD)
        const fechaLocal = new Date().toLocaleDateString('sv-SE');
        
        enlace.href = urlDescarga;
        enlace.download = `LIBRO_DE_GASTOS_MERCANTIL_${fechaLocal}.pdf`;
        document.body.appendChild(enlace);
        enlace.click();
        enlace.remove();
        console.log("✅ [SOTO ERP]: Libro de Gastos Digital descargado con éxito en Windows.");
    })
    .catch(err => {
        console.error("❌ Falla Gastos PDF:", err.message);
        alert("⚠️ Error: No se pudo conectar con el compilador contable cloud.");
    });
}; // 🔒 CIERRE DE LA EXTENSIÓN G Y DE TODA TU CAPA LÓGICA TRANSACCIONAL DE EGRESOS

// =========================================================================
// 📦 EXTENSIÓN H: CONSOLA DE INGRESO DE MERCANCÍA NUEVA PERSISTENTE
// Ubicación: src/pages/erp.js -> Siguiente procesador del Bloque 2 en línea
// =========================================================================
window.ErpModulo.ingresarMercanciaNuevaManual = function() {
    const txtSku = document.getElementById('inv-sku');
    const txtNombre = document.getElementById('inv-nombre');
    const selProveedor = document.getElementById('inv-proveedor');
    const numPrecio = document.getElementById('inv-precio');
    const numStock = document.getElementById('inv-stock');

    if (!txtSku || !txtNombre || !selProveedor || !numPrecio || !numStock) return;

    // SANEAMIENTO: Forzamos el SKU a mayúsculas sostenidas para evitar duplicaciones
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

    // Verificamos colisión de llaves primarias (SKU) en la RAM local
    if (inventarioVivo.some(p => p.sku === skuLimpio)) {
        alert(`⚠️ Error: El SKU ${skuLimpio} ya existe en el catálogo.`);
        return;
    }

    const nuevoItem = { sku: skuLimpio, nombre: nombreLimpio, precio_usd: costoUsd, stock: stockIngresado, categoria: proveedor };
    inventarioVivo.push(nuevoItem);

    // Sincronizamos todas las capas de memoria de la SPA en caliente
    window.App.state.listaProductosOriginal = inventarioVivo;
    localStorage.setItem('APIO_INVENTARIO_PERSISTENTE', JSON.stringify(inventarioVivo));
    
    if (window.CatalogoB2B) window.CatalogoB2B.productos = inventarioVivo;
    
    if (typeof window.recalcularGrillaCatalogoB2BEnCaliente === 'function') {
        window.recalcularGrillaCatalogoB2BEnCaliente();
    }

    const formularioIngreso = document.getElementById('form-ingreso-inventario-nuevo');
    if (formularioIngreso) formularioIngreso.reset();
    
    alert(`🏆 ¡Inventario Actualizado!\n\n• Producto: ${nombreLimpio}\n• Cantidad: +${stockIngresado} Unidades.`);
}; // 🔒 Cierre lineal con punto y coma

// =========================================================================
// 📊 EXTENSIÓN I: HISTORIAL DE TRANSACCIONES CON DETALLES DE PAGO MÓVIL EXTENDIDO
// Ubicación: src/pages/erp.js -> SANEADO CON BYPASS ELÁSTICO SOTO SYSTEM
// =========================================================================
window.ErpModulo.reinyectarFilasTabla = function() {
    const tbody = document.getElementById('erp-movimientos-diarios-rows');
    if (!tbody) return;

    // Pescamos la RAM actualizada de las ventas de la jornada
    const lista = window.ErpModulo.state.movimientosDiarios || [];
    
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

    // Mapeamos los checkouts a filas del DOM usando formateo regional nativo de Venezuela
    tbody.innerHTML = lista.map(mov => {
        const metodo = (mov.metodo || mov.metodo_pago || "").toUpperCase().trim();
        let metadatosPagoMovilHtml = "";

        // 🧠 AUDITORÍA EXTENDIDA SOTO FINANCIAL: Si es Pago Móvil, extraemos y pintamos sus variables
        if (metodo.includes("PAGO MÓVIL") || metodo.includes("PAGO MOVIL") || metodo.includes("PAGOMOVIL")) {
            const banco = mov.banco || mov.detallesPagoMovil?.banco || "BANCO N/A";
            const tlf = mov.telefono || mov.detallesPagoMovil?.telefono || "04XX-XXXXXXX";
            const refBanco = mov.ref_banco || mov.detallesPagoMovil?.refBanco || mov.ref || "REF N/A";

            metadatosPagoMovilHtml = `
                <div style="margin-top: 6px; display: flex; flex-wrap: wrap; gap: 8px; align-items: center; font-family: 'Inter', sans-serif; font-size: 10px;">
                    <span style="background: rgba(163, 230, 53, 0.1); color: #a3e635; border: 1px solid rgba(163, 230, 53, 0.2); padding: 2px 6px; border-radius: 4px; font-weight: 700; text-transform: uppercase;">
                        🏦 ${banco}
                    </span>
                    <span style="color: #94a3b8;">📱 Tlf: <strong style="color: #cbd5e1; font-family: monospace;">${tlf}</strong></span>
                    <span style="color: #94a3b8;">🧾 Ref: <strong style="color: #a3e635; font-family: monospace;">#${refBanco}</strong></span>
                </div>
            `;
        }

        // 🎯 BYPASS ELÁSTICO SOTO SYSTEM: Pescamos el valor real sin importar si viene de Railway (_bs) o de la RAM (Bs)
        const valorBsReal = parseFloat(mov.montoBs || mov.monto_bs || mov.monto || 0);
        const valorUsdReal = parseFloat(mov.montoUsd || mov.monto_usd || mov.precio_usd || 0);

        return `
            <tr style="border-bottom: 1px solid #1e293b; background-color: rgba(255,255,255, 0.01);">
                <td style="padding: 14px; color: #a855f7; font-weight: bold; font-size: 11px; font-family: monospace;">
                    ${mov.ref || 'TR-N/A'}<br><span style="color: #64748b; font-size: 9px;">${mov.hora || '00:00'}</span>
                </td>
                <td style="padding: 14px; color: #cbd5e1; font-family: monospace;">${mov.cedula || 'V-99999999'}</td>
                <td style="padding: 14px; color: #94a3b8; font-family: 'Inter', sans-serif; line-height: 1.4; font-size: 11px;">
                    <span style="color: #fff; font-weight: 600;">${mov.productos || 'Mercancía General'}</span>
                    ${metadatosPagoMovilHtml}
                </td>
                <td style="padding: 14px; text-align: center;">
                    <span style="background-color: #0b1329; color: #38bdf8; font-size: 9px; padding: 3px 8px; border-radius: 4px; border: 1px solid rgba(56, 189, 248, 0.2); text-transform: uppercase; font-family: 'Inter', sans-serif; font-weight: 700;">
                        ${metodo.replace('_', ' ')}
                    </span>
                </td>
                <!-- 👑 COLUMNA CALIBRADA SOTO SYSTEM: Muestra la matemática real capturada de internet -->
                <td style="padding: 14px; text-align: right; color: #00D2FF; font-size: 13px; font-family: monospace;">
                    ${valorBsReal.toLocaleString('es-VE', {minimumFractionDigits: 2})} Bs.<br>
                    <span style="color: #10b981; font-size: 10px;">$${valorUsdReal.toFixed(2)}</span>
                </td>
            </tr>
        `;
    }).join('');
}; // 🔒 CANDADO DE CIERRE INDESTRUCTIBLE DE LA EXTENSIÓN I

window.ErpModulo = ErpModulo;
export { ErpModulo };

