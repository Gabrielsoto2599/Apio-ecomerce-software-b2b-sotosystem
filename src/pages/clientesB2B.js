// =========================================================================
// BLOQUE 0: CONTROL DE IMPORTACIONES Y NÚCLEO DE LA CARTERA MULTIPERFIL (MVP 2026)
// Ubicación: clientesB2B.js
// =========================================================================
// Encendemos de forma nativa la importación usándola en las líneas de inyección de abajo
import { Home } from './home.js';

const ClientesB2B = {
    // 🧠 MEMORIA RADIAL SOTO SYSTEM CON PERSISTENCIA DE DISCO RÍGIDO (localStorage)
    state: {
        // Lee el disco duro; si está vacío por ser el primer arranque, nace limpio []
        listaClientes: JSON.parse(localStorage.getItem('APIO_CARTERA_CLIENTES_MANUAL')) || [],
        tipoFiltroActivo: 'TODOS',
        cargandoDatos: false
    },

        // =========================================================================
    // BLOQUE 1: CONSTRUCTOR CORE Y MAQUETACIÓN VISUAL DE DEUDORES (ESTRUCTURA MAESTRA)
    // =========================================================================
    render() {
        // 1. Creamos la sección contenedora principal de la pantalla completa (Full Viewport Layout)
        const section = document.createElement('section');
        section.id = "contenedor-cartera-comercial-modulo";
        section.className = "apio-clientes-wrapper";
        // Estructura flex vertical rígida: min-height de 100vh y ancho total libre de márgenes
        section.style.cssText = "display: flex; flex-direction: column; width: 100%; min-height: 100vh; background-color: #0d1117; box-sizing: border-box; margin: 0; padding: 0;";

        // === INYECCIÓN DEL HEADER GLOBAL (Cubre el 100% del ancho de la pantalla arriba) ===
        if (typeof Home.renderMasterHeader === 'function') {
            section.appendChild(Home.renderMasterHeader());
        } else if (window.App && typeof window.App.renderMasterHeader === 'function') {
            section.appendChild(window.App.renderMasterHeader());
        }

                // 2. Cuerpo Central del Contenido (Usa flex: 1 para expandirse y empujar al footer al ras inferior)
        const pageBodyContent = document.createElement('div');
        pageBodyContent.style.cssText = "flex: 1; width: 100%; max-width: 1200px; margin: 0 auto; padding: 40px 20px; box-sizing: border-box;";

        // Panel de la Cartera de Clientes (Estilo Premium con línea lateral de control cian)
        const carteraPanel = document.createElement('div');
        carteraPanel.style.cssText = "background-color: #0b0f19; padding: 32px 24px; border-radius: 12px; border: 1px solid #1e293b; border-left: 4px solid #00D2FF; width: 100%; box-shadow: 0 0 25px rgba(0, 210, 255, 0.15), 0 20px 40px rgba(0,0,0,0.7); font-family: 'Inter', sans-serif; box-sizing: border-box; color: #ffffff;";

        carteraPanel.innerHTML = `
            <!-- Encabezado del Módulo Estilo Consola (MVP MANUAL TOTAL) -->
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 25px; border-bottom: 1px solid #1e293b; padding-bottom: 15px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <span style="width: 24px; height: 24px; border-radius: 50%; background-color: #00D2FF; display: flex; align-items: center; justify-content: center; font-weight: 900; color: #030712; font-size: 13px; box-shadow: 0 0 10px rgba(0, 210, 255, 0.65);">C</span>
                    <div>
                        <h3 style="font-weight: 800; font-size: 16px; color: #FFFFFF; margin: 0; letter-spacing: -0.01em; text-transform: uppercase; font-family: monospace;">Cartera de Clientes y Perfiles</h3>
                        <p style="margin: 2px 0 0 0; color: #64748b; font-size: 11px; font-weight: 600;">Control Multi-Tarifa y Registro de Deudores</p>
                    </div>
                </div>
                <!-- 🔒 Sello Autónomo Manual -->
                <span style="background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); padding: 4px 10px; border-radius: 4px; font-size: 10px; font-weight: 800; letter-spacing: 0.05em; font-family: monospace;">SISTEMA MANUAL MVP</span>
            </div>

            <!-- Resumen de Métricas de Cuentas por Cobrar en USD -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-bottom: 30px;">
                <div style="background: #030712; border: 1px solid #1e293b; padding: 16px; border-radius: 8px; border-left: 3px solid #ef4444;">
                    <span style="font-size: 10px; color: #64748b; text-transform: uppercase; font-weight: 800; display: block; margin-bottom: 4px;">Balance Fiado Global Pendiente</span>
                    <h2 id="total-usd-cartera" style="margin: 0; color: #ffffff; font-family: monospace; font-size: 22px; font-weight: 800;">$ 0.00</h2>
                </div>
                <div style="background: #030712; border: 1px solid #1e293b; padding: 16px; border-radius: 8px; border-left: 3px solid #ff9900;">
                    <span style="font-size: 10px; color: #64748b; text-transform: uppercase; font-weight: 800; display: block; margin-bottom: 4px;">Clientes en Cuenta por Cobrar</span>
                    <h2 id="total-clientes-mora" style="margin: 0; color: #ffffff; font-family: monospace; font-size: 22px; font-weight: 800;">0 Deudores</h2>
                </div>
                <div style="background: #030712; border: 1px solid #1e293b; padding: 16px; border-radius: 8px; border-left: 3px solid #10b981;">
                    <span style="font-size: 10px; color: #64748b; text-transform: uppercase; font-weight: 800; display: block; margin-bottom: 4px;">Base de Datos Registrada</span>
                    <h2 id="total-clientes-base" style="margin: 0; color: #ffffff; font-family: monospace; font-size: 22px; font-weight: 800;">0 Registros</h2>
                </div>
            </div>

            <!-- ➕ FORMULARIO DE REGISTRO MANUAL MULTIPERFIL (SOTO SYSTEM 2026) -->
            <div style="background-color: #030712; padding: 20px; border-radius: 8px; border: 1px solid #1e293b; margin-bottom: 25px; font-family: 'Inter', sans-serif;">
                <h4 style="margin: 0 0 15px 0; font-size: 12px; font-weight: 800; text-transform: uppercase; color: #38bdf8; letter-spacing: 0.05em;">Ficha de Registro Manual de Clientes</h4>
                <form id="form-registro-cliente-manual" onsubmit="event.preventDefault(); window.ClientesB2B.guardarClienteNuevo();" 
                    style="display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-end;">
                    
                    <div style="flex: 1; min-width: 180px;">
                        <label style="display: block; font-size: 11px; color: #64748b; font-weight: 700; margin-bottom: 6px; text-transform: uppercase;">Cédula o RIF:</label>
                        <input type="text" id="reg-cliente-cedula" required placeholder="Ej: V-27966675" 
                            style="width: 100%; background: #0b0f19; border: 1px solid #1e293b; border-radius: 6px; padding: 10px; color: #ffffff; font-family: monospace; font-size: 13px; box-sizing: border-box;">
                    </div>

                    <div style="flex: 2; min-width: 240px;">
                        <label style="display: block; font-size: 11px; color: #64748b; font-weight: 700; margin-bottom: 6px; text-transform: uppercase;">Nombre / Razón Social:</label>
                        <input type="text" id="reg-cliente-nombre" required placeholder="Ej: Juan Pérez o Distribuidora Yaracuy" 
                            style="width: 100%; background: #0b0f19; border: 1px solid #1e293b; border-radius: 6px; padding: 10px; color: #ffffff; font-size: 13px; box-sizing: border-box;">
                    </div>

                    <div style="flex: 1; min-width: 180px;">
                        <label style="display: block; font-size: 11px; color: #64748b; font-weight: 700; margin-bottom: 6px; text-transform: uppercase;">Tipo de Perfil (Tarifa):</label>
                        <select id="reg-cliente-tipo" required onchange="window.ClientesB2B.conmutarInputDeuda(this.value)"
                            style="width: 100%; background: #0b0f19; border: 1px solid #1e293b; border-radius: 6px; padding: 10px; color: #ffffff; font-size: 13px; box-sizing: border-box; cursor: pointer;">
                            <option value="MINORISTA">Minorista (Precio Detal)</option>
                            <option value="MAYORISTA">Aliado Comercial (Mayorista)</option>
                            <option value="DEUDOR">Cuenta por Cobrar (Deudor)</option>
                        </select>
                    </div>

                    <!-- Casilla reaccionaria de saldo flotante (Inicia oculta y se enciende solo para Deudores) -->
                    <div id="wrapper-saldo-inicial" style="flex: 1; min-width: 140px; display: none;">
                        <label style="display: block; font-size: 11px; color: #ef4444; font-weight: 700; margin-bottom: 6px; text-transform: uppercase;">Saldo Fiado Inicial ($):</label>
                        <input type="number" id="reg-cliente-saldo" step="0.01" value="0.00" 
                            style="width: 100%; background: #0b0f19; border: 1px solid #ef4444; border-radius: 6px; padding: 10px; color: #ef4444; font-family: monospace; font-size: 13px; box-sizing: border-box; font-weight: bold;">
                    </div>

                    <!-- 📦 NUEVO: Casilla reaccionaria de productos fiados desglozados -->
                    <div id="wrapper-detalles-fiado" style="flex: 2; min-width: 240px; display: none; width: 100%; margin-top: 10px;">
                        <label style="display: block; font-size: 11px; color: #ef4444; font-weight: 700; margin-bottom: 6px; text-transform: uppercase;">Víveres Dejados en Fiado (Detalle Fijo):</label>
                        <textarea id="reg-cliente-detalles-fiado" placeholder="Ej: 3 Harinas PAN (x1.10), 1 Salsa Pampero 370g (x1.70). Total guardado en dólares." 
                            style="width: 100%; background: #0b0f19; border: 1px solid #ef4444; border-radius: 6px; padding: 10px; color: #ffffff; font-size: 13px; box-sizing: border-box; font-family: sans-serif; min-height: 50px; resize: vertical; outline: none;"></textarea>
                    </div>

                    <button type="submit" style="background: linear-gradient(135deg, #00D2FF 0%, #0072FF 100%); color: #030712; border: none; padding: 11px 24px; border-radius: 6px; font-size: 12px; font-weight: 800; text-transform: uppercase; cursor: pointer; font-family: 'Inter', sans-serif; letter-spacing: 0.05em; box-shadow: 0 4px 12px rgba(0, 210, 255, 0.3); margin-top: 10px;">
                        💾 Registrar Cliente
                    </button>
                </form>
            </div>

            <!-- 📊 TABLA DE CONTROL DE CLIENTES Y CARTERA UNIFICADA -->
            <div style="background-color: #030712; border: 1px solid #1e293b; border-radius: 8px; overflow: hidden;">
                <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 12px;">
                    <thead>
                        <tr style="background: #000000; color: #64748b; border-bottom: 2px solid #1e293b; font-family: monospace; text-transform: uppercase; font-size: 11px;">
                            <th style="padding: 14px 16px;">CÉDULA / RIF FISCAL</th>
                            <th style="padding: 14px 16px;">CLIENTE / REVOLVENTE</th>
                            <th style="padding: 14px 16px; text-align: center;">TIPO DE PERFIL</th>
                            <th style="padding: 14px 16px; text-align: right;">SALDO EN MORA (USD)</th>
                            <th style="padding: 14px 16px; text-align: center; width: 180px;">ACCIÓN CONTABLE MASTER</th>
                        </tr>
                    </thead>
                    <tbody id="tabla-clientes-dinamica" style="font-family: monospace; font-weight: 600; color: #e2e8f0;">
                        <tr>
                            <td colspan="5" style="padding: 50px; text-align: center; color: #475569; font-style: italic; font-family: 'Inter', sans-serif; font-size: 13px;">
                                Base de datos vacía. No se registran perfiles comerciales en el mostrador manual.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- 🚨 EXTENSIÓN H: LIBRO DE MOROSIDAD CORPORATIVA (CLIENTES FIAR VENCIDOS) -->
<div id="morosidad-card-container" style="margin-top: 20px; font-family: 'Inter', sans-serif; width: 100%; box-sizing: border-box;">
    <div style="background: linear-gradient(135deg, #1c0d0d 0%, #0a0202 100%); padding: 18px; border-radius: 10px; border: 1px solid #301616; border-left: 5px solid #ef4444; box-shadow: 0 4px 15px rgba(239, 68, 68, 0.15);">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 10px;">
            <div>
                <span style="font-size: 10px; color: #f87171; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em;">🚨 Registro Crítico de Morosidad</span>
                <h4 style="margin: 2px 0 0 0; color: #ffffff; font-size: 14px; font-weight: 700;">Auditoría de Cuentas por Cobrar Retrasadas</h4>
            </div>
            <span id="morosidad-conteo-alerta" style="font-size: 10px; font-weight: 900; background: #ef444433; color: #f43f5e; padding: 4px 8px; border-radius: 12px; border: 1px solid rgba(244, 63, 94, 0.3);">0 Alertas Críticas</span>
        </div>

        <!-- Tabla de Clientes Deudores en Vivo -->
        <div style="background: #030712; padding: 12px; border-radius: 6px; border: 1px solid #1e293b; max-height: 180px; overflow-y: auto;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 11px;">
                <thead>
                    <tr style="color: #64748b; border-bottom: 1px solid #1e293b; font-size: 10px; text-transform: uppercase;">
                        <th style="padding-bottom: 6px;">Vecino / Comprador</th>
                        <th style="padding-bottom: 6px;">Factura Ref</th>
                        <th style="padding-bottom: 6px;">Días Retraso</th>
                        <th style="padding-bottom: 6px; text-align: right;">Saldo Pendiente</th>
                    </tr>
                </thead>
                <tbody id="lista-morosos-cuerpo" style="color: #cbd5e1; font-family: monospace;">
                    <tr>
                        <td colspan="4" style="padding: 12px 0; text-align: center; color: #475569; font-family: sans-serif; font-style: italic;">Sincronizando deudores con PostgreSQL Cloud...</td>
                    </tr>
                </tbody>
            </table>
        </div>

    </div>
</div>

        `;
        
        pageBodyContent.appendChild(carteraPanel);
        section.appendChild(pageBodyContent);

        // === 🔒 INYECTOR TELEMÉTRICO: Dispara el llenado de las filas tras el renderizado ===
        setTimeout(() => { 
            if (typeof this.reinyectarFilasClientes === 'function') {
                this.reinyectarFilasClientes(); 
                        // 💾 SELLO INYECTOR DE DISCO DURO: Resguarda la cartera contra apagones de luz
        localStorage.setItem('APIO_CARTERA_CLIENTES_MANUAL', JSON.stringify(this.state.listaClientes));

            }
        }, 50);

        // === INYECCIÓN DEL FOOTER GLOBAL FIXED (EXTIRPADO EL WIDGET DE DANIELA IA) ===
        if (window.Home && typeof window.Home.renderFooter === 'function') {
            section.appendChild(window.Home.renderFooter());
        }

        return section;
    }, // <--- Cierre impecable y balanceado del método render() del Módulo de Clientes

    
    // =========================================================================
// 🚀 BLOQUE 2 (PARTE A): PROCESADORES LÓGICOS DE SIEMBRA MULTIPERFIL (MVP 2026)
// Ubicación: clientesB2B.js -> Continuación de render()
// =========================================================================

    // 🎯 Conmutador de casillas reactivas e Inyector de Morosidad
    conmutarInputDeuda(tipoSeleccionado) {
        const wrapperSaldo = document.getElementById('wrapper-saldo-inicial');
        const wrapperDetalles = document.getElementById('wrapper-detalles-fiado');
        
        if (tipoSeleccionado === 'DEUDOR') {
            if (wrapperSaldo) wrapperSaldo.style.display = 'block';
            if (wrapperDetalles) wrapperDetalles.style.display = 'block'; // 📦 Enciende el block de productos
            
            // 📡 DISPARADOR TELEMÉTRICO SOTO SYSTEM:
            // Al activarse el perfil de deudor, forzamos la sincronización de pasivos en vivo
            if (typeof window.consultarLibroMorosidadCloud === 'function') {
                window.consultarLibroMorosidadCloud();
            }
        } else {
            if (wrapperSaldo) wrapperSaldo.style.display = 'none';
            if (wrapperDetalles) wrapperDetalles.style.display = 'none';
        }
    }, // 🎯 Cierre limpio de la propiedad conmutarInputDeuda con su coma de continuidad

    // =========================================================================
// 🧠 REPAIR DE SIEMBRA CONTABLE MANUAL (EXTINGUIDO EL REFERENCEERROR LÍNEA 185)
// Ubicación: Al inicio del método guardarClienteNuevo() en clientesB2B.js
// =========================================================================
    guardarClienteNuevo() {
        // 🎯 CORE COUPLING SOTO SYSTEM: Declaración rígida de los cables del formulario
        const txtCedula = document.getElementById('reg-cliente-cedula');
        const txtNombre = document.getElementById('reg-cliente-nombre');
        const selTipo = document.getElementById('reg-cliente-tipo');
        const numSaldo = document.getElementById('reg-cliente-saldo');
        const txtDetalles = document.getElementById('reg-cliente-detalles-fiado');

        // Verificación estricta de hardware visual para impedir colapsos en la RAM
        if (!txtCedula || !txtNombre || !selTipo) {
            console.error("❌ [SOTO CRITICAL]: Elementos físicos del formulario no detectados en el DOM.");
            return;
        }

        const cedulaLimpia = txtCedula.value.trim().toUpperCase();
        const nombreLimpio = txtNombre.value.trim();
        const tipoPerfil = selTipo.value;
        const saldoInicial = numSaldo ? parseFloat(numSaldo.value) || 0.00 : 0.00;
        const detallesFiado = txtDetalles ? txtDetalles.value.trim() : "Mercancía General";

        console.log(`📡 [SOTO CLIENTES]: Sembrando perfil manual -> ${cedulaLimpia} | ${tipoPerfil}`);

        if (!this.state.listaClientes) this.state.listaClientes = [];

        // Filtro estricto contra duplicación de registros en taquilla
        if (this.state.listaClientes.some(cli => cli.cedula === cedulaLimpia)) {
            alert(`⚠️ Error de Cartera: El RIF/Cédula ${cedulaLimpia} ya se encuentra registrado.`);
            return;
        }

        // Empaquetamos el expediente con el cargamento extendido de inventario fiado
        this.state.listaClientes.push({
            cedula: cedulaLimpia,
            nombre: nombreLimpio,
            tipo: tipoPerfil,
            saldoDeuda: saldoInicial,
            detallesFiado: tipoPerfil === 'DEUDOR' ? detallesFiado : "Solvente (Sin fiado)",
            fechaRegistro: new Date().toLocaleDateString('es-VE')
        });

        // Sincronizamos la RAM global para que la pasarela de pagos lo lea de inmediato
        if (!window.App) window.App = {};
        if (!window.App.state) window.App.state = {};
        window.App.state.carteraClientesGlobal = this.state.listaClientes;

        // Limpieza física del mostrador para el siguiente vecino
        document.getElementById('form-registro-cliente-manual').reset();
        if (txtDetalles) txtDetalles.value = '';
        this.conmutarInputDeuda(tipoPerfil);

        // Forzamos el redibujado de la tabla y el recalculo de métricas superiores
        this.reinyectarFilasClientes();
        alert(`🏆 ¡Ficha Contable Guardada!\n• Cliente: ${nombreLimpio}\n• Estatus: Indexado en la libreta digital.`);
                // 💾 SELLO INYECTOR DE DISCO DURO: Resguarda la cartera contra apagones de luz
        localStorage.setItem('APIO_CARTERA_CLIENTES_MANUAL', JSON.stringify(this.state.listaClientes));

    },

    // =========================================================================
    // 🚀 BLOQUE 2 (PARTE B): RENDERIZADOR ATÓMICO Y GESTOR DE ABONOS FIADOS (MVP 2026)
    // Ubicación: clientesB2B.js -> Cierre definitivo del objeto ClientesB2B
    // =========================================================================

    // 🎨 RENDERIZADOR ATÓMICO DE LA CUADRÍCULA FISCAL (MUESTRA LOS 3 PERFILES)
    reinyectarFilasClientes() {
        const tbody = document.getElementById('tabla-clientes-dinamica');

        const lblTotalUSD = document.getElementById('total-usd-cartera');
        const lblTotalDeudores = document.getElementById('total-clientes-mora');
        const lblTotalBase = document.getElementById('total-clientes-base');

        if (!tbody) return;

        const lista = this.state.listaClientes || [];

        // 1. Recalculamos las métricas superiores basándose en los datos vivos
        let balanceGlobalFiado = 0;
        let contadorDeudores = 0;

        lista.forEach(cli => {
            if (cli.tipo === 'DEUDOR') {
                balanceGlobalFiado += parseFloat(cli.saldoDeuda || 0);
                if (parseFloat(cli.saldoDeuda) > 0) contadorDeudores++;
            }
        });

        if (lblTotalUSD) lblTotalUSD.innerText = `$ ${balanceGlobalFiado.toFixed(2)}`;
        if (lblTotalDeudores) lblTotalDeudores.innerText = `${contadorDeudores} Deudores`;
        if (lblTotalBase) lblTotalBase.innerText = `${lista.length} Registros`;

        // 2. Si no hay clientes registrados, pintamos la celda de contingencia visual
        if (lista.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="padding: 50px; text-align: center; color: #475569; font-style: italic; font-family: 'Inter', sans-serif; font-size: 13px;">
                        Base de datos vacía. No se registran perfiles comerciales en el mostrador manual.
                    </td>
                </tr>
            `;
            return;
        }

        // 3. Mapeamos y pintamos cada renglón aplicando las etiquetas de colores corporativos
        tbody.innerHTML = lista.map(cli => {
            let labelPerfilHtml = '';
            let celdaDeudaHtml = '';

            // Calibramos los colores según el plano multi-tarifa de Gabriel
            if (cli.tipo === 'MAYORISTA') {
                labelPerfilHtml = `<span style="background-color: rgba(168, 85, 247, 0.15); color: #a855f7; font-size: 9px; padding: 3px 8px; border-radius: 4px; border: 1px solid rgba(168, 85, 247, 0.2); font-weight: 800;">MAYORISTA</span>`;
                celdaDeudaHtml = `<span style="color: #64748b;">N/A (Precios B2B)</span>`;
            } else if (cli.tipo === 'MINORISTA') {
                labelPerfilHtml = `<span style="background-color: rgba(56, 189, 248, 0.15); color: #38bdf8; font-size: 9px; padding: 3px 8px; border-radius: 4px; border: 1px solid rgba(56, 189, 248, 0.2); font-weight: 800;">DETAL (MINORISTA)</span>`;
                celdaDeudaHtml = `<span style="color: #64748b;">0.00 USD</span>`;
            } else {
                labelPerfilHtml = `<span style="background-color: rgba(239, 68, 68, 0.15); color: #ef4444; font-size: 9px; padding: 3px 8px; border-radius: 4px; border: 1px solid rgba(239, 68, 68, 0.2); font-weight: 800;">CUENTA POR COBRAR</span>`;
                celdaDeudaHtml = `<span style="color: #ef4444; font-weight: bold;">$ ${parseFloat(cli.saldoDeuda || 0).toFixed(2)}</span>`;
            }

            // Botón de acción inteligente para abonar dinero de forma manual en el mostrador
            const botonAccionHtml = cli.tipo === 'DEUDOR' && parseFloat(cli.saldoDeuda) > 0
                ? `<button onclick="window.ClientesB2B.liquidarAbonoManual('${cli.cedula}')" style="background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); padding: 4px 10px; border-radius: 4px; font-size: 10px; font-weight: 800; cursor: pointer; transition: all 0.2s;" onmouseenter="this.style.background='#ef4444'; this.style.color='#030712'; " onmouseleave="this.style.background='rgba(239, 68, 68, 0.15)'; this.style.color='#ef4444';">💵 Cobrar Abono</button>`
                : `<span style="color: #475569; font-size: 11px;">Perfil Solvente</span>`;

                        return `
                <tr style="border-bottom: 1px solid #1e293b; background-color: rgba(255,255,255, 0.005);">
                    <td style="padding: 14px 16px; color: #00D2FF; font-family: monospace; font-size: 12px;">${cli.cedula}</td>
                    <td style="padding: 14px 16px; color: #ffffff; font-family: 'Inter', sans-serif;">
                        ${cli.nombre}<br>
                        <span style="color: #64748b; font-size: 9px; display: block; margin-top: 2px;">Registrado: ${cli.fechaRegistro}</span>
                        <!-- 🎯 SUB-LÍNEA EXTENDIDA SOTO SYSTEM: Muestra los víveres fiados en rojo apagado si es deudor -->
                        ${cli.tipo === 'DEUDOR' ? `<span style="color: #f43f5e; font-size: 11px; font-weight: 700; display: block; margin-top: 4px; font-family: monospace;">📦 FIADO: ${cli.detallesFiado || 'Sin especificar'}</span>` : ''}
                    </td>
                    <td style="padding: 14px 16px; text-align: center;">${labelPerfilHtml}</td>
                    <td style="padding: 14px 16px; text-align: right; font-family: monospace; font-size: 13px;">${celdaDeudaHtml}</td>
                    <td style="padding: 14px 16px; text-align: center;">${botonAccionHtml}</td>
                </tr>
            `;

        }).join('');
    },

    // 💵 COBRAR ABONO MANUAL: Permite disminuir la cuenta pendiente en la misma taquilla
    liquidarAbonoManual(cedulaCliente) {
        const lista = this.state.listaClientes || [];
        const index = lista.findIndex(cli => cli.cedula === cedulaCliente);
        if (index === -1) return;

        const cliente = lista[index];
        const montoAbono = prompt(`💵 REGISTRO DE ABONO - CLIENTE: ${cliente.nombre}\n\n• Saldo Deuda Actual: $${parseFloat(cliente.saldoDeuda).toFixed(2)}\n\nDigite el monto en Dólares ($) que está pagando el cliente en caja:`);
        
        if (montoAbono === null) return; // Cancela la alerta

        const abonoEntero = parseFloat(montoAbono) || 0.00;
        if (abonoEntero <= 0) {
            alert("⚠️ Operación Cancelada: El monto del abono debe ser mayor a 0.00 USD.");
            return;
        }

        if (abonoEntero > cliente.saldoDeuda) {
            alert(`⚠️ Operación Denegada: El abono ($${abonoEntero.toFixed(2)}) supera la deuda pendiente ($${parseFloat(cliente.saldoDeuda).toFixed(2)}).`);
            return;
        }

        // Restamos la deuda en caliente en la memoria
        cliente.saldoDeuda -= abonoEntero;
        if (window.App && window.App.state) {
            window.App.state.carteraClientesGlobal = this.state.listaClientes;
        }

        this.reinyectarFilasClientes();
        alert(`✅ Recibo de Pago Emitido:\n• Cliente: ${cliente.nombre}\n• Abono Procesado: $${abonoEntero.toFixed(2)}\n• Saldo Nuevo en Cuenta: $${cliente.saldoDeuda.toFixed(2)}`);
                // 💾 SELLO INYECTOR DE DISCO DURO: Resguarda la cartera contra apagones de luz
        localStorage.setItem('APIO_CARTERA_CLIENTES_MANUAL', JSON.stringify(this.state.listaClientes));

    }

};

// Vinculamos al entorno global window para que App.js lo detecte de forma inmediata
window.ClientesB2B = ClientesB2B;
export { ClientesB2B };
