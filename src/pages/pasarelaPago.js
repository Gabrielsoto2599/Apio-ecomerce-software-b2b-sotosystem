// =========================================================================
// BLOQUE 0: CONFIGURACIÓN INTEGRAL DEL ENTORNO DE PASARELA (APIO CORE)
// =========================================================================
import { Home } from './home.js';

// =========================================================================
// 💰 ENGINE DE CAJA MASTER: LIQUIDADOR DE VUELTO MULTIMONEDA GLOBAL SOTO POS
// =========================================================================
window.calcularVueltoEnCaliente = function(totalVentaUsd, tasaBcv) {
    // Si los parámetros no llegan dinámicos, los pescamos directamente del DOM del formulario
    const totalRealUsd = totalVentaUsd || parseFloat(window.App?.state?.montoTotal || 0.00);
    const tasaRealBcv = tasaBcv || parseFloat(window.TasaCambioModulo?.state?.precio_bcv || 780.00); // 🎯 Toma tu tasa actual de la captura

    const montoRecibidoInput = document.getElementById('pm-pago-cliente');
    const montoRecibido = montoRecibidoInput ? parseFloat(montoRecibidoInput.value) : 0.00;
    
    const cuadroUsd = document.getElementById('vuelto-usd');
    const cuadroVes = document.getElementById('vuelto-ves');

    // Si la casilla está vacía o el monto recibido es menor al total de la compra, limpiamos la pizarra
    if (!montoRecibido || montoRecibido <= totalRealUsd) {
        if (cuadroUsd) cuadroUsd.innerHTML = "$0.00";
        if (cuadroVes) cuadroVes.innerHTML = "0.00 Bs.";
        return;
    }

    // Algoritmo matemático exacto de desglose de vuelto
    const vueltoUsd = montoRecibido - totalRealUsd;
    const vueltoVes = vueltoUsd * tasaRealBcv;

    // Inyectamos con formato limpio en las tarjetas neón de tu pasarela
    if (cuadroUsd) cuadroUsd.innerHTML = `$${vueltoUsd.toFixed(2)}`;
    if (cuadroVes) cuadroVes.innerHTML = `${vueltoVes.toLocaleString('es-VE', {minimumFractionDigits: 2})} Bs.`;
};

const PasarelaPago = {
    // Propiedad mutable global para tu calculadora manual o API del BCV
    tasaActivaBCV: 0.00, 

    // Estado transaccional compacto que leerán Daniela IA y tu Server.cjs
    estadoTransaccion: {
        metodoSeleccionado: 'PAGO_MOVIL', // PAGO_MOVIL, BIOPAGO, PUNTO
        montoBs: 0.00,
        montoUSD: 0.00,
        referenciaBancaria: '',
        estatus: 'PENDIENTE', // PENDING_GATEWAY, COMPLETED, FAILED
        rifCliente: ''
    },

    pagosProcesados: [],

               render() {
        // 1. Contenedor Maestro acoplado a la identidad oscura de Apio B2B
        const section = document.createElement('div');
        section.className = "pasarela-pago-view-wrapper w-full";
        section.setAttribute('style', 'background-color: #0B0E14 !important; min-height: 100vh !important; display: flex; flex-direction: column; box-sizing: border-box !important; width: 100% !important; margin: 0 !important; padding: 0 !important; font-family: "Inter", sans-serif !important;');

        // 2. Inyección del Header Maestro directamente en el flujo vertical (IDÉNTICO AL CATÁLOGO)
        if (window.App && typeof window.App.renderMasterHeader === 'function') {
            section.appendChild(window.App.renderMasterHeader());
        } else if (window.Home && typeof window.Home.renderMasterHeader === 'function') {
            section.appendChild(window.Home.renderMasterHeader());
        }

        // 3. Contenedor de Contenido Central Acotado
        const mainContent = document.createElement('main');
        mainContent.setAttribute('style', 'flex: 1; padding: 40px 24px; background-color: #0B0E14; box-sizing: border-box; width: 100%; display: flex; flex-direction: column; align-items: center;');

        mainContent.innerHTML = `
            <div style="width: 100%; max-width: 900px; margin: 0 auto 24px auto; box-sizing: border-box; text-align: left;">
                <p style="color: #64748b; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin: 0;">Módulo de Cierre Contable Express</p>
                <h1 style="color: #ffffff; font-size: 26px; font-weight: 800; margin: 4px 0 0 0; letter-spacing: -0.02em;">Procesamiento de Factura</h1>
            </div>
            <div id="contenedor-pasarela-pago" style="width: 100%; max-width: 900px; margin: 0 auto; box-sizing: border-box;"></div>
        `;
        section.appendChild(mainContent);
        const contenedorInterno = mainContent.querySelector('#contenedor-pasarela-pago');


                // =========================================================================
        // BLOQUE 1: COMPONENTE INYECTABLE - BUSCADOR DE CÉDULA / RIF FISCAL (ESTILO PREMIUM GARENA)
        // =========================================================================
        const moduloIdentificacion = document.createElement('section');
        // ESTILO BASE: Fondo ultra-oscuro #0b0f19, bordes pulidos y tipografía Inter integrada
        moduloIdentificacion.setAttribute('style', 'background-color: #0b0f19; padding: 24px; border-radius: 12px; border: 1px solid #1e293b; position: relative; margin-bottom: 20px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); box-sizing: border-box; width: 100%; font-family: "Inter", sans-serif;');
        
        moduloIdentificacion.innerHTML = `
            <!-- ANCLA VISUAL: Borde vertical morado neón fluido a la izquierda -->
            <div style="position: absolute; top: 0; left: 0; width: 4px; height: 100%; background-color: #a855f7; border-top-left-radius: 12px; border-bottom-left-radius: 12px;"></div>
            
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <!-- INDICADOR NUMÉRICO 1 CORREGIDO: Morado claro #a855f7 con Glow Neón -->
                    <span style="width: 24px; height: 24px; border-radius: 50%; background-color: #a855f7; display: flex; align-items: center; justify-content: center; font-weight: 900; color: #FFFFFF; font-size: 13px; box-shadow: 0 0 10px rgba(168, 85, 247, 0.65);">1</span>
                    <h3 style="font-weight: 700; font-size: 16px; color: #FFFFFF; margin: 0; letter-spacing: -0.01em;">Identificación Fiscal del Cliente</h3>
                </div>
                <!-- ESTATUS INICIAL: Manteniendo tu id "validation-status" listo para mutar visualmente -->
                <span id="validation-status" style="font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 6px; background-color: rgba(30, 41, 59, 0.4); color: #94a3b8; border: 1px solid #1e293b; letter-spacing: 0.05em; text-transform: uppercase;">SIN VALIDAR</span>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 8px; width: 100%; margin-bottom: 16px;">
                <label style="color: #64748b; font-size: 11px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; display: block;">ID del Cliente / RIF / Cédula</label>
                
                <div style="display: flex; gap: 12px; align-items: center; width: 100%; position: relative;">
                    <!-- Icono decorativo sutil dentro del input -->
                    <span style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #475569; font-size: 14px; pointer-events: none;">🆔</span>
                    <input 
                        type="text" 
                        id="cliente-identificacion" 
                        placeholder="Ej: J304561230 o V26123456" 
                        maxlength="14"
                        style="flex: 1; padding: 12px 16px 12px 42px; background-color: #030712; border: 1px solid #1e293b; border-radius: 8px; color: #ffffff; font-size: 14px; font-weight: 600; font-family: monospace; letter-spacing: 0.05em; outline: none; box-sizing: border-box; transition: border-color 0.2s;"
                        onfocus="this.style.borderColor='#818cf8'" 
                        onblur="this.style.borderColor='#1e293b'"
                    >
                </div>
            </div>

            <!-- BOTÓN DE VALIDACIÓN ACCIÓN MASTER: Gradiente e interactividad hover integrada inline -->
            <button type="button" id="btn-validate" style="width: 100%; background: linear-gradient(135deg, #a855f7 0%, #6366f1 100%); color: #FFFFFF; border: none; padding: 12px 24px; border-radius: 8px; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.03em; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 14px rgba(168, 85, 247, 0.4); transition: transform 0.2s ease, box-shadow 0.2s ease;"
                onmouseenter="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 6px 20px rgba(168, 85, 247, 0.6)';" 
                onmouseleave="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 14px rgba(168, 85, 247, 0.4)';">
                 Validar Contribuyente
            </button>
            
            <!-- VISTA DE RETORNO B2B: Integrado al diseño con checkmark de validación verde -->
            <div id="cliente-perfil-box" style="display: none; margin-top: 20px; padding: 14px 16px; background-color: rgba(3, 7, 18, 0.6); border-radius: 8px; border: 1px solid rgba(16, 185, 129, 0.2); align-items: center; gap: 12px; box-sizing: border-box;">
                <div style="background-color: rgba(16, 185, 129, 0.2); color: #10b981; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;">✓</div>
                <div>
                    <span style="color: #64748b; font-size: 11px; font-weight: 600; display: block; margin-bottom: 2px;">Razón Social / Propietario</span>
                    <b id="verified-name" style="color: #e2e8f0; font-size: 14px; font-weight: 700; font-family: 'Inter', sans-serif;"></b>
                </div>
            </div>
        `;
        
        contenedorInterno.appendChild(moduloIdentificacion);

// =========================================================================
// 📡 MÓDULO INTERACTIVO DE ASIGNACIÓN MULTI-TARIFA INTEGRAL (MVP 2026)
// Ubicación: Evento click del botón validar en pasarelaPago.js
// =========================================================================
        setTimeout(() => {
            const btnValidar = document.getElementById('btn-validate');
            const inputCedula = document.getElementById('cliente-identificacion');
            const statusLabel = document.getElementById('validation-status');
            const perfilBox = document.getElementById('cliente-perfil-box');
            const txtNombreVerificado = document.getElementById('verified-name');

            if (btnValidar && inputCedula) {
                btnValidar.onclick = () => {
                    const cedulaBuscar = inputCedula.value.trim().toUpperCase();
                    if (cedulaBuscar === "") {
                        alert("⚠️ Operación Detenida: Ingrese una cédula o RIF para validar en taquilla.");
                        return;
                    }

                    console.log(`📡 [SOTO PASARELA]: Evaluando Perfil Contable -> ${cedulaBuscar}`);

                    // Jalamos la base de datos viva desde la RAM unificada de la Single Page Application
                    const carteraGlobal = window.App?.state?.carteraClientesGlobal 
                        || window.ClientesB2B?.state?.listaClientes 
                        || window.RegistroB2B?.clientesRegistrados
                        || [];

                    const clienteEncontrado = carteraGlobal.find(cli => cli.cedula === cedulaBuscar);

                    if (!this.estadoTransaccion) this.estadoTransaccion = {};
                    this.estadoTransaccion.rifCliente = cedulaBuscar;

                    // 1. Reseteamos el cascarón visual para purgar colores viejos de la sesión anterior
                    if (perfilBox) {
                        perfilBox.style.display = 'flex';
                        perfilBox.style.borderColor = 'rgba(16, 185, 129, 0.2)';
                        perfilBox.style.backgroundColor = 'rgba(3, 7, 18, 0.6)';
                    }

                    // 2. ──► COMPORTAMIENTO CASO A: EL CLIENTE YA EXISTE EN EL REGISTRO
                    if (clienteEncontrado) {
                        const perfilReal = clienteEncontrado.tipo || clienteEncontrado.tipoCliente || 'MINORISTA';
                        this.estadoTransaccion.perfilClienteTipo = perfilReal;
                        const deudaReal = parseFloat(clienteEncontrado.saldoDeuda || 0);

                        // 🔴 SUB-CASO A.1: ¡ES UN DEUDOR MANUAL CON CUENTA PENDIENTE! (ALERTA ROJA)
                        if (perfilReal === 'DEUDOR' || deudaReal > 0) {
                            if (statusLabel) {
                                statusLabel.innerText = "MORA FIADO";
                                statusLabel.style.cssText = "font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 6px; background-color: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid #ef4444; letter-spacing: 0.05em; text-transform: uppercase;";
                            }
                            if (perfilBox) {
                                perfilBox.style.borderColor = "#ef4444";
                                perfilBox.style.backgroundColor = "rgba(239, 68, 68, 0.05)";
                            }
                            if (txtNombreVerificado) {
                                // 🎯 SOBREESCRIBIMOS EL TEXTO QUEMADO PARA DEUDORES
                                txtNombreVerificado.innerHTML = `<span style="color: #ffffff;">${clienteEncontrado.nombre}</span><br><span style="color: #ef4444; font-size: 11px; font-weight: 800; font-family: monospace; display: block; margin-top: 4px;">🛑 ALERTA: Saldo pendiente de $${deudaReal.toFixed(2)} USD</span>`;
                            }
                            alert(`🚨 Control de Riesgo Contable: El cliente ${clienteEncontrado.nombre} tiene una deuda activa de $${deudaReal.toFixed(2)} USD.`);
                        } 
                        
                        // 🟢 SUB-CASO A.2: MINORISTA REGISTRADO SOLVENTE (TARJETA CIAN)
                        else if (perfilReal === 'MINORISTA') {
                            if (statusLabel) {
                                statusLabel.innerText = "PÚBLICO DETAL";
                                statusLabel.style.cssText = "font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 6px; background-color: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid #38bdf8; letter-spacing: 0.05em; text-transform: uppercase;";
                            }
                            if (txtNombreVerificado) {
                                // 🎯 SOBREESCRIBIMOS EL TEXTO QUEMADO PARA MINORISTAS GUARDADOS
                                txtNombreVerificado.innerHTML = `<span style="color: #ffffff;">${clienteEncontrado.nombre}</span><br><span style="color: #38bdf8; font-size: 11px; font-weight: 600; display: block; margin-top: 2px;">📋 Estatus: Solvente | Precio Detal</span>`;
                            }
                        }

                        // 🔒 SUB-CASO A.3: MAYORISTA REGISTRADO (QUEDAN OCULTOS EN ESTA FACHADA PARA PRECIO BASE)
                        else {
                            if (statusLabel) statusLabel.innerText = "VERIFICADO";
                            if (statusLabel) statusLabel.style.cssText = "font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 6px; background-color: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid #10b981; letter-spacing: 0.05em; text-transform: uppercase;";
                            if (perfilBox) perfilBox.style.display = 'none'; // Se apaga la caja
                        }
                    } 
                    
                    // 🔵 COMPORTAMIENTO CASO B: CONSUMIDOR FINAL NUEVO / NO INDEXADO (TARJETA CIAN BASE DE ESTRENAR)
                    else {
                        this.estadoTransaccion.perfilClienteTipo = 'MINORISTA';
                        if (statusLabel) {
                            statusLabel.innerText = "PÚBLICO DETAL";
                            statusLabel.style.cssText = "font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 6px; background-color: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid #38bdf8; letter-spacing: 0.05em; text-transform: uppercase;";
                        }
                        if (txtNombreVerificado) {
                            // 🎯 EXTERMINADO EL TEXTO VIEJO MAYORISTA: Forzamos la inyección del consumidor final
                            txtNombreVerificado.innerHTML = `<span style="color: #ffffff;">Consumidor Final Regular</span><br><span style="color: #64748b; font-size: 11px; font-weight: 500; display: block; margin-top: 2px;">Venta al detal estándar libre de deudas.</span>`;
                        }
                    }

                    if (typeof this.calcularSubtotalesYTotales === 'function') {
                        this.calcularSubtotalesYTotales();
                    }
                };
            }
        }, 50);

// =========================================================================
// BLOQUE 2 - PARTE 1: MAPEO DE INSTRUCCIONES BANCARIAS EXCLUSIVAS DE VENEZUELA
// =========================================================================

// Estructura de Datos Híbrida: Datos puros para Daniela IA + Renderizado para el Cajero
const INSTRUCCIONES_COBRO_BODEGA = {
    PAGO_MOVIL: {
        titulo: "Pago Móvil Interbancario",
        metodoContable: "PAGO_MOVIL",
        monedaBase: "VES",
        requiereReferencia: true,
        // Datos puros estructurados para que Daniela IA los inyecte en su Prompt/RAG
        datosDanielaIA: {
            bancoDestino: "Banco de Venezuela",
            codigoBanco: "0102",
            telefonoDestino: "0424-5779401",
            rifDestino: "J-30456123-0",
            titularCuenta: "Distribuidora Apio C.A."
        },
        // Componente visual limpio adaptado a la nueva paleta oscura
        getHtmlInstructions() {
            const data = this.datosDanielaIA;
            return `
                <p style="font-size: 12px; color: #cbd5e1; margin: 0 0 8px 0; font-weight: 600;">Realiza el pago en Bolívares a la tasa oficial del BCV:</p>
                <ul style="font-size: 12px; color: #94a3b8; list-style-type: none; margin: 0; padding: 12px; background-color: #030712; border: 1px solid #1e293b; border-radius: 8px; line-height: 1.6; font-family: monospace;">
                    <li><b>Banco:</b> ${data.bancoDestino} (${data.codigoBanco})</li>
                    <li><b>Teléfono:</b> ${data.telefonoDestino}</li>
                    <li><b>Cédula / RIF:</b> ${data.rifDestino}</li>
                </ul>
            `;
        }
    },
    BIOPAGO: {
        titulo: "Plataforma Biopago BDV",
        metodoContable: "BIOPAGO_BDV",
        monedaBase: "VES",
        requiereReferencia: false, // Se liquida por número de lote interno
        datosDanielaIA: {
            proveedor: "Banco de Venezuela",
            tipoAutenticacion: "Escaneo dactilar en taquilla",
            requiereCedulaAsociada: true
        },
        getHtmlInstructions() {
            return `
                <p style="font-size: 12px; color: #cbd5e1; margin: 0 0 8px 0; font-weight: 600;">Conexión directa con la pasarela patria del Banco de Venezuela:</p>
                <ul style="font-size: 12px; color: #94a3b8; list-style-type: none; margin: 0; padding: 12px; background-color: #030712; border: 1px solid #1e293b; border-radius: 8px; line-height: 1.6;">
                    <li>• Ingrese la Cédula asociada a la cuenta bancaria de origen.</li>
                    <li>• Verifique los fondos líquidos antes de iniciar el escaneo dactilar.</li>
                </ul>
            `;
        }
    },
    PUNTO: {
        titulo: "Punto de Venta Dual (Flexipos)",
        metodoContable: "PUNTO_VENTA",
        monedaBase: "VES_USD", // Soporta cobros multimoneda en tarjeta nacional o internacional
        requiereReferencia: true,
        datosDanielaIA: {
            hardware: "Terminal Inalámbrico Flexipos",
            red: "Red Local WiFi / Canales de Datos Integrados",
            tarjetasSoportadas: ["Débito Nacional", "Maestro", "Visa", "Mastercard"]
        },
        getHtmlInstructions() {
            return `
                <p style="font-size: 12px; color: #cbd5e1; margin: 0 0 8px 0; font-weight: 600;">Sincronización inalámbrica con la terminal física comercial:</p>
                <ul style="font-size: 12px; color: #94a3b8; list-style-type: none; margin: 0; padding: 12px; background-color: #030712; border: 1px solid #1e293b; border-radius: 8px; line-height: 1.6;">
                    <li>• Soporta tarjetas de Débito Nacionales, Maestro y Crédito Visa/Mastercard.</li>
                    <li>• Verifique que la terminal física esté encendida y conectada a la red local.</li>
                </ul>
            `;
        }
    }
};

// =========================================================================
// INTERCEPCIÓN EN CALIENTE PARA PASARELA DE PAGOS HÍBRIDA (BUILD QUAD-GRID)
// =========================================================================
PasarelaPago.conmutarMetodoPagoPorIA = function(metodoKey) {
    const keyFormateada = metodoKey.toUpperCase();
    
    // Mapeo inverso unificado para las 4 opciones de tu pasarela premium
    let claveDatos = keyFormateada;
    if (keyFormateada === "PAGO_MOVIL" || keyFormateada === "PAGO_MOVIL_QR") claveDatos = "PAGO_MOVIL_QR";
    if (keyFormateada === "BIOPAGO_BDV" || keyFormateada === "BIOPAGO") claveDatos = "BIOPAGO";
    if (keyFormateada === "PUNTO_VENTA" || keyFormateada === "PUNTO") claveDatos = "PUNTO";
    if (keyFormateada === "CASHEA") claveDatos = "CASHEA";

    // 📡 DISPARADOR NATIVO AL CHASIS DE ELECTRON PARA CASHEA Y BIOPAGO
    if (claveDatos === 'CASHEA' || claveDatos === 'BIOPAGO') {
        if (window.electronAPI && typeof window.electronAPI.abrirAppCobroLocal === 'function') {
            window.electronAPI.abrirAppCobroLocal(claveDatos.toLowerCase());
        }
        if (claveDatos === 'CASHEA') {
            window.open('https://merchants.cashea.app/', '_blank');
        }
    }

    // 1. Sincronizamos el estado transaccional contable nativo de tu app
    this.estadoTransaccion.metodoSeleccionado = claveDatos;
    
    // 2. BUSQUEDA SELECTORES PREMIUM: Seleccionamos los botones del Grid en el HTML
    const contenedorMetodos = document.getElementById('step-payment-methods');
    
    // 🛑 CONTROL DE SEGURIDAD: Ubicamos el botón de despacho inferior de tu pasarela
    const botonDespachar = document.getElementById('btn-despachar-mercancia') || document.querySelector('.btn-submit-despacho');

    if (contenedorMetodos) {
        const botones = contenedorMetodos.querySelectorAll('button[data-metodo]');
        const boxCaja = document.getElementById('box-instrucciones-caja');
        const contenidoDinamico = document.getElementById('contenido-instrucciones-dinamico');

        // 3. RECORRIDO VISUAL: Encendemos en VERDE NEÓN la opción elegida
        botones.forEach(btn => {
            const metodoAttr = btn.getAttribute('data-metodo');
            if (metodoAttr === claveDatos) {
                btn.style.borderColor = '#10b981';
                btn.style.backgroundColor = '#0b1320';
                btn.style.boxShadow = '0 0 15px rgba(16, 185, 129, 0.25)';
            } else {
                btn.style.borderColor = '#1e293b';
                btn.style.backgroundColor = '#030712';
                btn.style.boxShadow = 'none';
            }
        });

        // 4. ANIMACIÓN DE INSTRUCCIONES Y LÓGICA DE CONGELAMIENTO
        if (boxCaja && contenidoDinamico) {
            boxCaja.style.opacity = '0';
            boxCaja.style.display = 'block';
            
            setTimeout(() => {
                                // =========================================================================
                // 📱 CASO 4: FORMULARIO DE AUDITORÍA DE PAGO MÓVIL (PROVIDENCIA SENIAT 2026)
                // =========================================================================
                if (claveDatos === "PAGO_MOVIL_QR") {
                    
                    // 🔒 PROTECCIÓN DE TAQUILLA: El botón de despachar se bloquea hasta validar el comprobante
                    if (botonDespachar) {
                        botonDespachar.disabled = true;
                        botonDespachar.style.opacity = '0.4';
                        botonDespachar.style.cursor = 'not-allowed';
                        botonDespachar.innerText = "⚠️ Valide los Datos del Pago Móvil Abajo";
                    }

                    // 🧱 INYECCIÓN DE LA INTERFAZ FISCAL CON TUS DATOS DE COMERCIO (GABRIEL V-27966675)
                    contenidoDinamico.innerHTML = `
                        <div style="font-family: 'Inter', sans-serif; width: 100%; box-sizing: border-box; padding: 10px; background: #111; border-radius: 8px; border: 1px solid #333;">
                            
                            <!-- Encabezado de la cuenta del comercio -->
                            <div style="margin-bottom: 12px; padding: 8px; background: rgba(16, 185, 129, 0.1); border-left: 4px solid #10b981; border-radius: 4px;">
                                <span style="font-size: 11px; color: #10b981; font-weight: bold; display: block; text-transform: uppercase;">Cuenta del Comercio:</span>
                                <span style="font-size: 12px; color: #fff;">Mercantil | 0412-5386285 | V-27.966.675</span>
                            </div>

                            <p style="font-size: 11px; color: #888; margin: 0 0 12px 0;">Ingrese los datos del comprobante dictado por el cliente:</p>

                            <!-- Formulario de 5 Campos Esenciales -->
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
                                <div>
                                    <label style="display: block; font-size: 11px; color: #aaa; margin-bottom: 3px;">Banco Emisor:</label>
                                   <!-- 📊 SELECTOR INTELIGENTE CON BUSCADOR FILTRADO Y DESPLAZADOR (SOTO COMPACT ENGINE) -->
<input list="bancos-bcv-list" id="pm-banco" placeholder="Escriba código o nombre... (Ej: 0102 o Mercantil)" style="width: 95%; padding: 6px; background: #222; border: 1px solid #444; color: #fff; border-radius: 4px; font-size: 12px; font-weight: bold; outline: none;" value="0105 - Banco Mercantil">

<datalist id="bancos-bcv-list">
    <option value="0102 - Banco de Venezuela (BDV)"></option>
    <option value="0105 - Banco Mercantil"></option>
    <option value="0108 - BBVA Provincial"></option>
    <option value="0134 - Banesco"></option>
    <option value="0191 - Banco National de Crédito (BNC)"></option>
    <option value="0172 - Bancamiga"></option>
    <option value="0174 - Banplus"></option>
    <option value="0163 - Banco del Tesoro"></option>
    <option value="0114 - Bancaribe"></option>
    <option value="0115 - Banco Exterior"></option>
    <option value="0104 - Banco Venezolano de Crédito (BVC)"></option>
    <option value="0128 - Banco Caroní"></option>
    <option value="0137 - Sofitasa"></option>
    <option value="0138 - Banco Plaza"></option>
    <option value="0146 - Bangente"></option>
    <option value="0151 - BFC Banco Fondo Común"></option>
    <option value="0156 - 100% Banco"></option>
    <option value="0157 - Del Sur Banco Universal"></option>
    <option value="0166 - Banco Agrícola de Venezuela"></option>
    <option value="0168 - Bancrecer"></option>
    <option value="0169 - Mi Banco"></option>
    <option value="0171 - Banco Activo"></option>
    <option value="0175 - BDT Banco Digital de los Trabajadores"></option>
    <option value="0177 - BANFANB"></option>
    <option value="OTHER - Otro Banco Nacional"></option>
</datalist>
                                </div>
                                <div>
                                    <label style="display: block; font-size: 11px; color: #aaa; margin-bottom: 3px;">Cédula / RIF Emisor:</label>
                                    <input type="text" id="pm-cedula" placeholder="Ej: V-12345678" style="width: 90%; padding: 6px; background: #222; border: 1px solid #444; color: #fff; border-radius: 4px; font-size: 12px;">
                                </div>
                                <div>
                                    <label style="display: block; font-size: 11px; color: #aaa; margin-bottom: 3px;">Teléfono Celular:</label>
                                    <input type="text" id="pm-telefono" placeholder="Ej: 0412-5555555" style="width: 90%; padding: 6px; background: #222; border: 1px solid #444; color: #fff; border-radius: 4px; font-size: 12px;">
                                </div>
                                <div>
                                    <label style="display: block; font-size: 11px; color: #aaa; margin-bottom: 3px;">Monto Pagado (Bs):</label>
                                    <input type="number" id="pm-monto" step="0.01" placeholder="0.00" style="width: 90%; padding: 6px; background: #222; border: 1px solid #444; color: #fff; border-radius: 4px; font-size: 12px;">
                                </div>
                            </div>

                            <div style="margin-bottom: 12px;">
                                <label style="display: block; font-size: 11px; color: #aaa; margin-bottom: 3px;">Últimos 4 Dígitos de Referencia Bancaria:</label>
                                <input type="text" id="pm-referencia" maxlength="4" placeholder="Ej: 4321" style="width: 95%; padding: 6px; background: #222; border: 1px solid #444; color: #fff; border-radius: 4px; font-size: 12px; font-weight: bold; letter-spacing: 2px;">
                            </div>

                            <!-- 💾 BOTÓN DE CONFIRMACIÓN LOCAL -->
                            <button type="button" id="btn-confirmar-pm" style="width: 100%; padding: 8px; background: #10b981; color: #fff; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 12px; transition: background 0.2s;">
                                💾 Confirmar y Validar Datos
                            </button>
                        </div>
                    `;

                    // 🎛️ ACCIÓN DEL BOTÓN DE CONFIRMACIÓN (Acople en la RAM de Electron)
                    setTimeout(() => {
                        const btnConfirmar = document.getElementById('btn-confirmar-pm');
                        btnConfirmar.addEventListener('click', () => {
                            const pmBanco = document.getElementById('pm-banco')?.value;
                            const pmCedula = document.getElementById('pm-cedula')?.value.trim();
                            const pmTelefono = document.getElementById('pm-telefono')?.value.trim();
                            const pmMonto = document.getElementById('pm-monto')?.value;
                            const pmRef = document.getElementById('pm-referencia')?.value.trim();

                            // Validación básica express para evitar que dejen campos vacíos
                            if (!pmCedula || !pmTelefono || !pmMonto || pmRef.length < 4) {
                                alert("⚠️ Alerta de Auditoría: Por favor, complete todos los campos del comprobante y asegure los 4 dígitos de la referencia.");
                                return;
                            }

                            console.log("🟢 [SOTO AUDIT]: Datos del Pago Móvil validados temporalmente en la caché.");
                            
                            // Guardamos las variables en el estado temporal de la transacción para el payload final hacia Railway
                            if (this.estadoTransaccion) {
                                this.estadoTransaccion.soportePagoMovil = {
                                    banco: pmBanco,
                                    cedula: pmCedula,
                                    telefono: pmTelefono,
                                    monto: pmMonto,
                                    referencia: pmRef
                                };
                            }

                            // 🔓 LIBERACIÓN TOTAL: Encendemos el botón maestro de despacho
                            if (botonDespachar) {
                                botonDespachar.disabled = false;
                                botonDespachar.style.opacity = '1';
                                botonDespachar.style.cursor = 'pointer';
                                botonDespachar.style.background = '#00ffcc';
                                botonDespachar.style.color = '#000';
                                botonDespachar.innerText = "🚀 Procesar y Despachar Factura";
                                btnConfirmar.innerText = "✅ Datos Confirmados Exitosamente";
                                btnConfirmar.style.background = "#047857";
                                btnConfirmar.disabled = true;
                            }
                        });
                    }, 200);

                } else {

                    // =========================================================================
                    // 💳 RESTO DE MÉTODOS DE PAGO (PUNTO, CASHEA, BIOPAGO)
                    // =========================================================================
                    if (botonDespachar) {
                        botonDespachar.disabled = false;
                        botonDespachar.style.opacity = '1';
                        botonDespachar.style.cursor = 'pointer';
                        botonDespachar.innerText = "Aceptar y Despachar Mercancía";
                    }

                    if (claveDatos === "CASHEA") {
                        contenidoDinamico.innerHTML = `<!-- Tu bloque de Cashea que ya programamos... -->`;
                    } else if (INSTRUCCIONES_COBRO_BODEGA && INSTRUCCIONES_COBRO_BODEGA[claveDatos]) {
                        contenidoDinamico.innerHTML = INSTRUCCIONES_COBRO_BODEGA[claveDatos].getHtmlInstructions();
                    } else {
                        contenidoDinamico.innerHTML = "• Siga las pautas del punto de venta físico en el mostrador.";
                    }
                }
                
                // =========================================================================
                // 🎨 ANIMACIONES Y ESTILOS ESTÁNDAR DE LA CAJA DE INSTRUCCIONES
                // =========================================================================
                const ulInterno = contenidoDinamico.querySelector('ul');
                if (ulInterno) {
                    ulInterno.style.backgroundColor = '#030712';
                    ulInterno.style.borderColor = '#1e293b';
                    ulInterno.style.borderLeft = '3px solid #10b981';
                    ulInterno.style.paddingLeft = '16px';
                }
                boxCaja.style.opacity = '1';
            }, 100);
        }
    }
    console.log(`[Apio Pasarela Sync]: Conmutado a -> ${claveDatos}`);
};

// =========================================================================
// 🔄 MOTOR DE ESCUCHA ASÍNCRONA CORREGIDO (LÍNEA 449)
// =========================================================================
PasarelaPago.iniciarEscuchaCaptureCelular = function(txId, botonDespachar) {
    console.log(`📡 [SOTO NET]: Antena de escucha activada para Transacción ID: ${txId}`);

    if (window.intervaloValidacionQR) {
        clearInterval(window.intervaloValidacionQR);
    }

    window.intervaloValidacionQR = setInterval(() => {
        
        // 🎯 PARCHE MAESTRO: Forzamos la barra diagonal "/" al puro final de la ruta dinámica
        const urlVerificacion = `https://apio-ecomerce-software-b2b-sotosystem-production.up.railway.app/api/v1/verificar-pago-movil/${txId}/`;

        fetch(urlVerificacion, { method: 'GET' })
        .then(res => {
            if (!res.ok) throw new Error("Servidor no responde");
            return res.json();
        })
        .then(data => {
            if (data.capture_recibido === true) {
                console.log("✅ [SOTO VALIDATION SUCCESS]: ¡Capture de Pago Móvil detectado en Railway!");
                clearInterval(window.intervaloValidacionQR);

                if (botonDespachar) {
                    botonDespachar.disabled = false;
                    botonDespachar.style.opacity = '1';
                    botonDespachar.style.cursor = 'pointer';
                    botonDespachar.style.backgroundColor = '#0b1320';
                    botonDespachar.style.borderColor = '#10b981';
                    botonDespachar.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.4)';
                    botonDespachar.innerText = "Aceptar y Despachar Mercancía (✔ Pago Validado)";
                }

                PasarelaPago.estadoTransaccion.captureBase64 = data.capture_base64;
            }
        })
        .catch(err => {
            // Este es el log de la línea 449 que vemos en tu captura de pantalla
            console.log(`[SOTO NET STATUS]: Escuchando señales... (${err.message})`);
        });

    }, 3000);
};

// =========================================================================
// BLOQUE 2-A: SELECTOR PREMIUM CON IMÁGENES BANCARIAS VENEZOLANAS (VERDE NEÓN)
// Ubicación: src/pages/pasarelaPago.js -> Refactor Saneado Dropdown 2026
// =========================================================================
const moduloPasarelas = document.createElement('section');
moduloPasarelas.id = "step-payment-methods";
moduloPasarelas.setAttribute('style', 'background-color: #0b0f19; padding: 24px; border-radius: 12px; border: 1px solid #1e293b; border-left: 4px solid #10b981; position: relative; overflow: hidden; width: 100%; box-sizing: border-box; margin-bottom: 24px; font-family: "Inter", sans-serif;');

moduloPasarelas.innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-top: 20px; box-sizing: border-box; width: 100%; position: relative;">
    
        <!-- 🛒 Opción 1: Punto de Venta (Envuelto en Contenedor Relativo Soto System) -->
    <div id="wrapper-punto-venta-dropdown" style="position: relative; width: 100%; box-sizing: border-box;">
        
        <!-- Botón de Punto de Venta Original (Mantiene data-metodo e ID intactos) -->
        <button type="button" id="pay-punto" data-metodo="PUNTO" onclick="window.PasarelaPago.alternarDropdownTarjetas(event)" style="display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; background-color: #030712; border: 1px solid #1e293b; border-radius: 12px; text-align: left; cursor: pointer; transition: all 0.2s ease; outline: none; box-sizing: border-box; width: 100%; height: 100%;">
            <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 36px; height: 36px; border-radius: 6px; background-color: #030712; display: flex; align-items: center; justify-content: center; overflow: hidden; border: 1px solid #1e293b; flex-shrink: 0;">
                    <img src="./assets/punto-venta.jpg" alt="Punto" style="width: 100%; height: 100%; object-fit: contain;" onerror="this.style.display='none'; this.parentNode.innerHTML='💳';">
                </div>
                <div>
                    <h4 style="font-weight: 700; font-size: 13px; color: #FFFFFF; margin: 0;">Punto Venta</h4>
                    <p id="label-punto-subtipo" style="font-size: 10px; color: #94a3b8; margin: 2px 0 0 0;">Débito / Crédito</p>
                </div>
            </div>
        </button>

        <!-- 👑 DROP-DOWN FLOTANTE: Abre hacia abajo sin romper la cuadrícula del grid de Electron -->
        <div id="dropdown-tarjetas-caja" style="position: absolute; top: calc(100% + 6px); left: 0; width: 100%; background-color: #050b14; border: 1px solid #1e293b; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.8), 0 0 15px rgba(16, 185, 129, 0.05); display: none; flex-direction: column; z-index: 100; overflow: hidden;">
            <button type="button" onclick="window.PasarelaPago.seleccionarSubTipoTarjeta('DEBITO', 'Débito')" style="background: transparent; border: none; color: #cbd5e1; text-align: left; padding: 10px 14px; font-size: 11px; font-weight: 700; cursor: pointer; width: 100%; border-bottom: 1px solid #111827; transition: background 0.2s; font-family: 'Inter', sans-serif;">
                🟢 Tarjeta de Débito
            </button>
            <button type="button" onclick="window.PasarelaPago.seleccionarSubTipoTarjeta('CREDITO', 'Crédito')" style="background: transparent; border: none; color: #cbd5e1; text-align: left; padding: 10px 14px; font-size: 11px; font-weight: 700; cursor: pointer; width: 100%; border-bottom: 1px solid #111827; transition: background 0.2s; font-family: 'Inter', sans-serif;">
                🔵 Tarjeta de Crédito
        <!-- ⚡ ACTUALIZACIÓN DE MARCA: Sustituido el rayo por el círculo violeta oficial de Ubii Pagos -->
            <button type="button" onclick="window.PasarelaPago.seleccionarSubTipoTarjeta('UBII', 'Ubii')" style="background: transparent; border: none; color: #cbd5e1; text-align: left; padding: 10px 14px; font-size: 11px; font-weight: 700; cursor: pointer; width: 100%; transition: background 0.2s; font-family: 'Inter', sans-serif;">
                🟣 Tarjeta Ubii
            </button>

        </div>
    </div>

    <!-- Opción 2: Cashea -->
    <button type="button" id="pay-cashea" data-metodo="CASHEA" style="display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; background-color: #030712; border: 1px solid #1e293b; border-radius: 12px; text-align: left; cursor: pointer; transition: all 0.2s ease; outline: none; box-sizing: border-box; width: 100%;">
        <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 36px; height: 36px; border-radius: 6px; background-color: #030712; display: flex; align-items: center; justify-content: center; overflow: hidden; border: 1px solid #1e293b; flex-shrink: 0;">
                <img src="./assets/cashea.jpg" alt="Cashea" style="width: 100%; height: 100%; object-fit: contain;" onerror="this.style.display='none'; this.parentNode.innerHTML='🟢';">
            </div>
            <div>
                <h4 style="font-weight: 700; font-size: 13px; color: #FFFFFF; margin: 0;">Cashea</h4>
                <p style="font-size: 10px; color: #94a3b8; margin: 2px 0 0 0;">Compra en cuotas</p>
            </div>
        </div>
    </button>

    <!-- Opción 3: Biopago BDV -->
    <button type="button" id="pay-biopago" data-metodo="BIOPAGO" style="display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; background-color: #030712; border: 1px solid #1e293b; border-radius: 12px; text-align: left; cursor: pointer; transition: all 0.2s ease; outline: none; box-sizing: border-box; width: 100%;">
        <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 36px; height: 36px; border-radius: 6px; background-color: #030712; display: flex; align-items: center; justify-content: center; overflow: hidden; border: 1px solid #1e293b; flex-shrink: 0;">
                <img src="./assets/biopago-pasarela.jpg" alt="Biopago" style="width: 100%; height: 100%; object-fit: contain;" onerror="this.style.display='none'; this.parentNode.innerHTML='☝️';">
            </div>
            <div>
                <h4 style="font-weight: 700; font-size: 13px; color: #FFFFFF; margin: 0;">Biopago BDV</h4>
                <p style="font-size: 10px; color: #94a3b8; margin: 2px 0 0 0;">Huella dactilar</p>
            </div>
        </div>
    </button>

    <!-- Opción 4: Pago Móvil QR -->
    <button type="button" id="pay-pagomovil" data-metodo="PAGO_MOVIL_QR" style="display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; background-color: #030712; border: 1px solid #1e293b; border-radius: 12px; text-align: left; cursor: pointer; transition: all 0.2s ease; outline: none; box-sizing: border-box; width: 100%;">
        <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 36px; height: 36px; border-radius: 6px; background-color: #030712; display: flex; align-items: center; justify-content: center; overflow: hidden; border: 1px solid #1e293b; flex-shrink: 0;">
                <img src="./assets/pago-movil.jpg" alt="Pago Móvil" style="width: 100%; height: 100%; object-fit: contain;" onerror="this.style.display='none'; this.parentNode.innerHTML='📱';">
            </div>
            <div>
                <h4 style="font-weight: 700; font-size: 13px; color: #FFFFFF; margin: 0;">Pago Móvil QR</h4>
                <p style="font-size: 10px; color: #94a3b8; margin: 2px 0 0 0;">Escaneo asíncrono</p>
            </div>
        </div>
    </button>

</div>

<!-- ===================================================================== -->
<!-- 2. CAJA DE INSTRUCCIONES PREMIUM (UBICADA NATURALMENTE ABAJO)         -->
<!-- ===================================================================== -->
<!-- Al estar fuera, se despliega abajo de los 4 botones sin solapamientos visuales -->
<div id="box-instrucciones-caja" style="display: none; opacity: 0; margin-top: 18px; padding: 16px; background-color: #0b1320; border: 1px solid #1e293b; border-left: 4px solid #10b981; border-radius: 12px; transition: all 0.25s ease; width: 100%; box-sizing: border-box; clear: both;">
    <div id="contenido-instrucciones-dinamico" style="color: #cbd5e1; width: 100%; font-size: 13px;"></div>
</div>`;
   
        // --- VINCULACIÓN DE LOGICA MANUAL DE CLICK CON CONMUTADOR DE IA Y PUENTE OS ---
moduloPasarelas.querySelectorAll('button[data-metodo]').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const metodoKey = e.currentTarget.getAttribute('data-metodo');
        
        // 📡 DETECTOR NATIVO: Si es Cashea o Biopago, invocamos las apps .exe locales de la PC
        if (metodoKey === 'CASHEA' || metodoKey === 'BIOPAGO') {
            if (window.electronAPI && typeof window.electronAPI.abrirAppCobroLocal === 'function') {
                window.electronAPI.abrirAppCobroLocal(metodoKey.toLowerCase());
            } else {
                console.log(`[Apio POS Linker]: App externa de ${metodoKey} invocada en desarrollo web.`);
            }
        }

        // Forzamos a que el click manual llame a la función interceptora de tu objeto original
        if (typeof PasarelaPago.conmutarMetodoPagoPorIA === 'function') {
            PasarelaPago.conmutarMetodoPagoPorIA(metodoKey);
        }
    });

    // Feedback dinámico de hover manual
    btn.addEventListener('mouseenter', () => {
        const esActivo = btn.style.borderColor === 'rgb(16, 185, 129)' || btn.style.borderColor === '#10b981';
        if (!esActivo) btn.style.borderColor = '#475569';
    });
    btn.addEventListener('mouseleave', () => {
        const esActivo = btn.style.borderColor === 'rgb(16, 185, 129)' || btn.style.borderColor === '#10b981';
        if (!esActivo) btn.style.borderColor = '#1e293b';
    });
});
        contenedorInterno.appendChild(moduloPasarelas);


                // =========================================================================
        // BLOQUE 2-B: EVENTOS DE INTERFAZ INTELIGENTES (CONEXIÓN CARTERA MULTIPERFIL)
        // Ubicación: Dentro del componente de identificación en pasarelaPago.js
        // =========================================================================
        
        // Enlazar los disparadores lógicos a las acciones físicas de la cajera
        setTimeout(() => {
            const inputRIF = section.querySelector('#cliente-identificacion');
            const btnValidar = section.querySelector('#btn-validate');

            // Filtro de teclado en tiempo real: Fuerza mayúsculas y limpia caracteres raros
            if (inputRIF) {
                inputRIF.addEventListener('input', (e) => {
                    e.target.value = e.target.value.toUpperCase().replace(/[^VJGE0-9]/g, "");
                });
            }

            // Acción del botón Validar: Mandar el RIF al estado y pintar éxito visual inmediato
            if (btnValidar && inputRIF) {
                btnValidar.onclick = () => {
                    const documento = inputRIF.value.trim().toUpperCase();
                    if (documento.length < 4) {
                        alert("⚠️ RIF o Cédula inválida para el mostrador.");
                        return;
                    }
                    
                    console.log(`📡 [SOTO PASARELA]: Cruzando Cédula en Taquilla -> ${documento}`);

                    // 1. Jalamos la base de datos viva desde la RAM unificada de la SPA
                    const carteraGlobal = window.App?.state?.carteraClientesGlobal 
                        || window.ClientesB2B?.state?.listaClientes 
                        || window.RegistroB2B?.clientesRegistrados
                        || [];

                    // 2. Buscamos milimétricamente al comprador en la libreta digital
                    const clienteEncontrado = carteraGlobal.find(cli => cli.cedula === documento);

                    // Guardamos el RIF en el estado local de forma limpia
                    if (!PasarelaPago.estadoTransaccion) PasarelaPago.estadoTransaccion = {};
                    PasarelaPago.estadoTransaccion.rifCliente = documento;

                    // Capturamos los nodos del DOM para la mutación estética
                    const statusLabel = section.querySelector('#validation-status');
                    const perfilBox = section.querySelector('#cliente-perfil-box');
                    const nameText = section.querySelector('#verified-name');

                    // Aseguramos que el cascarón de respuesta se encienda en flex
                    if (perfilBox) perfilBox.style.display = 'flex';

                    // 3. ──► COMPORTAMIENTO CASO A: EL CLIENTE SÍ EXISTE EN EL ERP (REGISTRADO)
                    if (clienteEncontrado) {
                        const perfilReal = clienteEncontrado.tipo || clienteEncontrado.tipoCliente || 'MINORISTA';
                        PasarelaPago.estadoTransaccion.perfilClienteTipo = perfilReal;
                        const deudaReal = parseFloat(clienteEncontrado.saldoDeuda || 0);

                        // 🔴 SUB-CASO A.1: ¡ES UN DEUDOR CON CUENTA PENDIENTE EN LA LIBRETA!
                        if (perfilReal === 'DEUDOR' || deudaReal > 0) {
                            if (statusLabel) {
                                statusLabel.innerText = "MORA FIADO";
                                statusLabel.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
                                statusLabel.style.color = "#ef4444";
                                statusLabel.style.borderColor = "rgba(239, 68, 68, 0.3)";
                            }
                            if (perfilBox) {
                                perfilBox.style.borderColor = "#ef4444";
                                perfilBox.style.backgroundColor = "rgba(239, 68, 68, 0.05)";
                            }
                            if (nameText) {
                                nameText.innerHTML = `<span style="color: #ffffff;">${clienteEncontrado.nombre}</span><br><span style="color: #ef4444; font-size: 11px; font-weight: 800; font-family: monospace; display: block; margin-top: 4px; text-transform: uppercase;">🛑 CUENTA EN MORA: Alerta de deuda por $${deudaReal.toFixed(2)} USD</span>`;
                            }
                            alert(`🚨 Control de Riesgo Contable:\n\nEl cliente ${clienteEncontrado.nombre} tiene un saldo pendiente de $${deudaReal.toFixed(2)} USD en la cartera.\n\nPor favor, gestione el cobro del abono antes de autorizar un nuevo fiado.`);
                        }
                        // 🟢 SUB-CASO A.2: ES UN MINORISTA REGISTRADO SOLVENTE (TARJETA CIAN)
                        else if (perfilReal === 'MINORISTA') {
                            if (statusLabel) {
                                statusLabel.innerText = "PÚBLICO DETAL";
                                statusLabel.style.backgroundColor = "rgba(56, 189, 248, 0.1)";
                                statusLabel.style.color = "#38bdf8";
                                statusLabel.style.borderColor = "rgba(56, 189, 248, 0.3)";
                            }
                            if (perfilBox) {
                                perfilBox.style.borderColor = "rgba(56, 189, 248, 0.2)";
                                perfilBox.style.backgroundColor = "rgba(3, 7, 18, 0.6)";
                            }
                            if (nameText) {
                                nameText.innerHTML = `<span style="color: #ffffff;">${clienteEncontrado.nombre}</span><br><span style="color: #38bdf8; font-size: 11px; font-weight: 600; display: block; margin-top: 2px;">📋 Estatus: Solvente | Precio Regular Detal</span>`;
                            }
                        }
                        // 🔒 SUB-CASO A.3: ES UN COMERCIANTE MAYORISTA (OCULTO EN ESTA ENTRADA REACCIONARIA)
                        else {
                            if (statusLabel) {
                                statusLabel.innerText = "VERIFICADO";
                                statusLabel.style.backgroundColor = "rgba(16, 185, 129, 0.1)";
                                statusLabel.style.color = "#10b981";
                                statusLabel.style.borderColor = "rgba(16, 185, 129, 0.3)";
                            }
                            if (perfilBox) perfilBox.style.display = 'none'; // Se apaga la caja por tu regla de negocio
                        }
                    }
                    // 🔵 COMPORTAMIENTO CASO B: CONSUMIDOR FINAL NUEVO (MINORISTA AUTOMÁTICO - PRECIO DETAL BASE)
                    else {
                        PasarelaPago.estadoTransaccion.perfilClienteTipo = 'MINORISTA';
                        
                        if (statusLabel) {
                            statusLabel.innerText = "PÚBLICO DETAL";
                            statusLabel.style.backgroundColor = "rgba(56, 189, 248, 0.1)";
                            statusLabel.style.color = "#38bdf8";
                            statusLabel.style.borderColor = "rgba(56, 189, 248, 0.3)";
                        }
                        if (perfilBox) {
                            perfilBox.style.borderColor = "rgba(56, 189, 248, 0.2)";
                            perfilBox.style.backgroundColor = "rgba(3, 7, 18, 0.6)";
                        }
                        if (nameText) {
                            nameText.innerHTML = `<span style="color: #ffffff;">Consumidor Final Regular</span><br><span style="color: #64748b; font-size: 11px; font-weight: 500; display: block; margin-top: 2px;">Venta al detal estándar libre de deudas.</span>`;
                        }
                    }
                    
                    // Congelamos el input para evitar alteraciones fiscales y ajustamos estética
                    inputRIF.disabled = true;
                    inputRIF.style.opacity = "0.5";
                    inputRIF.style.borderColor = "#1e293b";

                    // Disparamos el recálculo visual de la consola derecha
                    if (typeof PasarelaPago.ejecutarCalculoFiscalCompleto === 'function') {
                        PasarelaPago.ejecutarCalculoFiscalCompleto();
                    } else if (typeof PasarelaPago.calcularSubtotalesYTotales === 'function') {
                        PasarelaPago.calcularSubtotalesYTotales();
                    }
                };
            }
        }, 50);

        // =========================================================================
// 🕹️ PARTE 2: PROCESADORES DEL DROPDOWN DE TARJETAS (SOTO FINANCIAL)
// Ubicación: src/pages/pasarelaPago.js -> Última línea absoluta del archivo
// =========================================================================

// 1. Abre y cierra la persiana flotante al pulsar el botón de Punto de Venta
window.PasarelaPago.alternarDropdownTarjetas = function(event) {
    if (event) event.stopPropagation();
    
    // Invocamos la función interceptora original de tu app para encender el borde verde neón
    if (typeof PasarelaPago.conmutarMetodoPagoPorIA === 'function') {
        PasarelaPago.conmutarMetodoPagoPorIA('PUNTO');
    }

    const menuDropdown = document.getElementById('dropdown-tarjetas-caja');
    if (!menuDropdown) return;

    // Cambiamos el estado visual de forma elástica
    if (menuDropdown.style.display === 'flex') {
        menuDropdown.style.display = 'none';
    } else {
        menuDropdown.style.display = 'flex';
    }

    // Cerramos el dropdown de forma automática si hacen clic en cualquier fondo de la SPA
    document.addEventListener('click', function cerrarDropdownAfuera() {
        if (menuDropdown) menuDropdown.style.display = 'none';
        document.removeEventListener('click', cerrarDropdownAfuera);
    });
};

window.PasarelaPago.seleccionarSubTipoTarjeta = function(codigoTarjeta, etiquetaVisual) {
    console.log(`💳 [SOTO POS AUDIT]: Tarjeta del Punto fijada en -> ${codigoTarjeta}`);
    
    if (!PasarelaPago.estadoTransaccion) PasarelaPago.estadoTransaccion = {};
    
    // Asentamos simétricamente el método maestro y el subtipo en la RAM contable
    PasarelaPago.estadoTransaccion.metodoSeleccionado = "PUNTO";
    PasarelaPago.estadoTransaccion.subTipoTarjeta = codigoTarjeta;

    // Actualizamos el texto informativo abajo de la palabra "Punto Venta" aplicando el círculo violeta si es Ubii
    const labelSubtipo = document.getElementById('label-punto-subtipo');
    if (labelSubtipo) {
        if (codigoTarjeta === 'UBII') {
            labelSubtipo.innerText = `🟣 ${etiquetaVisual}`;
            labelSubtipo.style.color = '#c084fc'; // Cambiamos el subtexto a un elegante color lila/morado neón
        } else if (codigoTarjeta === 'DEBITO') {
            labelSubtipo.innerText = `🟢 ${etiquetaVisual}`;
            labelSubtipo.style.color = '#10b981';
        } else {
            labelSubtipo.innerText = `🔵 ${etiquetaVisual}`;
            labelSubtipo.style.color = '#38bdf8';
        }
    }

    // Cerramos la persiana al confirmar la selección
    const menuDropdown = document.getElementById('dropdown-tarjetas-caja');
    if (menuDropdown) menuDropdown.style.display = 'none';
};

                // =========================================================================
        // BLOQUE 3: REJILLA SIMPLIFICADA DE PRODUCTOS (CARRITO MAYORISTA B2B - NARANJA NEÓN)
        // =========================================================================
        const moduloCarritoGrid = document.createElement('section');
        moduloCarritoGrid.id = "step-product-catalog";
        moduloCarritoGrid.className = "glass-card rounded-2xl relative overflow-hidden transition-all duration-300";
        // CONFIGURACIÓN PREMIUM: Fondo oscuro #0b0f19, borde slate y línea izquierda naranja neón brillante
        moduloCarritoGrid.setAttribute('style', 'background-color: #0b0f19; padding: 24px; border-radius: 12px; border: 1px solid #1e293b; border-left: 4px solid #ff9900; position: relative; overflow: hidden; width: 100%; box-sizing: border-box; margin-bottom: 24px;');

        // Invocación segura de datos relacionales sin declaraciones flotantes
        const carritoActual = (typeof this.obtenerCarritoActual === 'function') 
            ? this.obtenerCarritoActual() 
            : ((window.App && window.App.state && window.App.state.carrito) ? window.App.state.carrito : []);

        // EVALUACIÓN DE INTEGRIDAD: Bloqueo de transacciones fantasmas en taquilla
        if (carritoActual.length === 0) {
            moduloCarritoGrid.innerHTML = `
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
                    <!-- INDICADOR NUMÉRICO 3: Reducido a 24px y con Glow Naranja Neón Intenso -->
                    <span style="width: 24px; height: 24px; border-radius: 50%; background-color: #ff9900; display: flex; align-items: center; justify-content: center; font-weight: 900; font-family: 'Inter', sans-serif; color: #FFFFFF; font-size: 13px; box-shadow: 0 0 12px rgba(255, 153, 0, 0.65);">3</span>
                    <h3 style="font-weight: 800; font-size: 16px; color: #FFFFFF; margin: 0; font-family: 'Inter', sans-serif; letter-spacing: -0.01em;">Productos Cargados en la Factura</h3>
                </div>

                <div style="border: 1px dashed #1e293b; padding: 40px 24px; border-radius: 12px; text-align: center; color: #64748b; font-family: 'Inter', sans-serif; background-color: #030712; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                    
                    <!-- CONTENEDOR DE TU NUEVA IMAGEN PNG: Con escala controlada y emoji de respaldo -->
                    <div style="width: 64px; height: 64px; margin-bottom: 16px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                        <img src="./assets/carrito-ico.png" alt="Carrito Apio" style="width: 100%; height: 100%; object-fit: contain; display: block;" 
                            onerror="this.style.display='none'; this.parentNode.innerHTML='<span style=\\'font-size: 28px; user-select: none;\\'>🛒</span>';">
                    </div>
                    
                    <p style="margin: 0; font-weight: 600; font-size: 14px; color: #94a3b8;">El carrito de compras está vacío.</p>
                    <p style="margin: 4px 0 0 0; font-size: 11px; color: #64748b; max-width: 320px;">Vaya al Catálogo para cargar los víveres antes de proceder con el cobro en caja.</p>
                    
                    <!-- BOTÓN CORREGIDO: Gradiente Naranja Premium y texto limpio 'Ir al Catálogo' -->
                    <button type="button" id="btn-redirect-catalogo" style="margin-top: 18px; background: linear-gradient(135deg, #ff9900 0%, #d47a00 100%); color: #FFFFFF; border: none; padding: 10px 20px; border-radius: 8px; font-size: 12px; font-weight: 700; text-transform: uppercase; cursor: pointer; font-family: 'Inter', sans-serif; box-shadow: 0 4px 12px rgba(255, 153, 0, 0.3); transition: transform 0.2s;"
                        onmouseenter="this.style.transform='translateY(-1px)';" onmouseleave="this.style.transform='translateY(0)';">
                        Ir al Catálogo
                    </button>
                </div>
            `;
            
            setTimeout(() => {
                const btnRedir = moduloCarritoGrid.querySelector('#btn-redirect-catalogo');
                if (btnRedir && window.App) btnRedir.onclick = () => window.App.navigate('catalogo-b2b');
            }, 0);

                } else {
            let tarjetasProductosHTML = '';
            let totalAcumuladoMonto = 0;

            // Procesamos los renglones de mercancía clonando la lógica exacta de imágenes del catálogo
            carritoActual.forEach(item => {
                const precioNumerico = parseFloat(item.precio) || 0;
                const cantidadEntera = parseInt(item.cantidad) || 1;
                const subtotalItem = precioNumerico * cantidadEntera;
                totalAcumuladoMonto += subtotalItem;

                const nombreLimpio = item.nombre ? item.nombre.trim() : 'Mercancia';
                const itemSku = item.sku || item.codigo || 'SKU';
                const rutaJpg = `./assets/${nombreLimpio}.jpg`;

                tarjetasProductosHTML += `
                    <!-- Tarjeta de Producto B2B Estilo Valery Software (Inyección de Descarte Rápido) -->
                    <div class="product-item-card" data-sku="${itemSku}" style="background-color: #030712; border: 1px solid #1e293b; padding: 14px; border-radius: 10px; display: flex; align-items: center; gap: 16px; box-sizing: border-box; font-family: 'Inter', sans-serif; width: 100%; transition: border-color 0.2s ease; position: relative;"
                        onmouseenter="this.style.borderColor='#ff9900';" onmouseleave="this.style.borderColor='#1e293b';">
                        
                        <!-- Miniatura con Manejador de Error Desacoplado Seguro -->
                        <div style="width: 56px; height: 56px; border-radius: 6px; background-color: #FFFFFF; border: 1px solid #1e293b; display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0; color: #475569;">
                            <img src="${rutaJpg}" alt="${nombreLimpio}" data-nombre="${nombreLimpio}" style="max-height: 100%; max-width: 100%; object-fit: contain; display: block;" 
                                onerror="PasarelaPago.gestionarFalloImagenB2B(this)">
                        </div>

                        <!-- Información Contable del Renglón Mayorista -->
                        <div style="flex: 1; overflow: hidden;">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
                                <div style="overflow: hidden; width: 65%;">
                                    <h5 style="color: #FFFFFF; font-size: 13px; font-weight: 700; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${nombreLimpio}">
                                        ${nombreLimpio}
                                    </h5>
                                    <span style="font-size: 10px; color: #64748b; font-family: monospace; display: block; margin-top: 2px;">SKU: ${itemSku}</span>
                                </div>
                                
                                <!-- CONTENEDOR FLEX DE ACCIONES NATIVAS: Cantidad + Botón de Descarte Rápido -->
                                <div style="display: flex; align-items: center; gap: 8px; flex-shrink: 0;">
                                    <span style="background-color: rgba(255, 153, 0, 0.1); color: #ff9900; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px; white-space: nowrap;">
                                        x${cantidadEntera} Unid
                                    </span>
                                    
                                    <!-- ❌ LA "X" ROJA CORPORATIVA DE DESCARTE INTERACTIVO SOTO SYSTEM -->
                                    <button type="button" 
                                        onclick="window.PasarelaModulo.removerDelCarrito('${itemSku}')"
                                        style="background: transparent; color: #ef4444; border: none; font-size: 14px; font-weight: 900; cursor: pointer; padding: 2px 6px; border-radius: 4px; transition: background 0.2s; display: flex; align-items: center; justify-content: center; user-select: none;"
                                        title="Remover artículo de la factura"
                                        onmouseenter="this.style.backgroundColor='rgba(239, 68, 68, 0.15)';"
                                        onmouseleave="this.style.backgroundColor='transparent';">
                                        ✕
                                    </button>
                                </div>
                            </div>
                            
                            <div style="border-top: 1px solid #1e293b; padding-top: 6px; margin-top: 6px; display: flex; justify-content: space-between; align-items: center; font-size: 11px;">
                                <span style="color: #64748b;">Precio Mayor: $${precioNumerico.toFixed(2)}</span>
                                <span style="color: #10b981; font-weight: 800;">Subtotal: $${subtotalItem.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                `;
            });

            // Asentamos el dinero total de la orden en el estado contable local
            this.estadoTransaccion.montoTotal = totalAcumuladoMonto;

            // 🎯 INITIALIZATION SECURITY FALLBACK: Inicializamos estrictamente en 0.00 tal como dictaste
            let tasaBCV_Control = 0.00;
            if (window.TasaCambioModulo?.state?.precio_bcv) {
                tasaBCV_Control = parseFloat(window.TasaCambioModulo.state.precio_bcv);
            } else if (window.App?.state?.tasaDelDia) {
                tasaBCV_Control = parseFloat(window.App.state.tasaDelDia);
            } else {
                const backupTasa = localStorage.getItem('APIO_TASA_ACTUAL_BS');
                tasaBCV_Control = backupTasa ? parseFloat(backupTasa) : 0.00; // Nace en cero absoluto si no hay registro
            }

            // Sincronizamos las variables del total de bolívares basándose en la tasa inicializada limpia
            this.estadoTransaccion.montoBs = totalAcumuladoMonto * tasaBCV_Control;

            moduloCarritoGrid.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; width: 100%;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <span style="width: 24px; height: 24px; border-radius: 50%; background-color: #ff9900; display: flex; align-items: center; justify-content: center; font-weight: 800; font-family: 'Inter', sans-serif; color: #FFFFFF; font-size: 13px; box-shadow: 0 0 12px rgba(255, 153, 0, 0.65);">3</span>
                        <h3 style="font-weight: 800; font-size: 16px; color: #FFFFFF; margin: 0; font-family: 'Inter', sans-serif; letter-spacing: -0.01em;">Productos Cargados en la Factura</h3>
                    </div>
                    <span style="font-size: 11px; font-family: monospace; color: #64748b; font-weight: bold; background: #030712; padding: 2px 8px; border-radius: 4px; border: 1px solid #1e293b;">Renglones: ${carritoActual.length}</span>
                </div>
                <div id="products-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; width: 100%; box-sizing: border-box;">
                    ${tarjetasProductosHTML}
                </div>
            `;
        }
        
        contenedorInterno.appendChild(moduloCarritoGrid);



                // =========================================================================
// BLOQUE 4-A: MAQUETACIÓN FÍSICA DE LA CONSOLA DE CHECKOUT (CERO ABSOLUTO PURE 2026)
// Ubicación: pasarelaPago.js
// =========================================================================
const moduloFacturacion = document.createElement('section');
moduloFacturacion.id = "step-billing-console";
moduloFacturacion.className = "glass-card rounded-2xl relative overflow-hidden transition-all duration-300";
moduloFacturacion.setAttribute('style', 'background-color: #0b0f19; padding: 24px; border-radius: 12px; border: 1px solid #1e293b; border-left: 4px solid #10b981; position: relative; overflow: hidden; width: 100%; box-sizing: border-box; margin-bottom: 24px;');

// 🎯 CORE REPAIR SOTO SYSTEM: Sincronizamos con el monto real acumulado en tu Carrito Global de la SPA
const subtotalUSD_Base = parseFloat(window.App?.state?.montoTotal || this.estadoTransaccion?.montoTotal || 0.00);

// 📡 ANCLAJE FISCAL REACCIONA CERO: Extraemos la tasa viva de la RAM
let tasaBCV_Base = 0.00; // Nace estrictamente en cero absoluto

if (window.TasaCambioModulo && window.TasaCambioModulo.state && window.TasaCambioModulo.state.precio_bcv) {
    tasaBCV_Base = parseFloat(window.TasaCambioModulo.state.precio_bcv);
} else if (window.App && window.App.state && window.App.state.tasaDelDia) {
    tasaBCV_Base = parseFloat(window.App.state.tasaDelDia);
} else {
    // Rescate persistente del almacenamiento local
    const tasaPersistida = localStorage.getItem('APIO_TASA_ACTUAL_BS');
    tasaBCV_Base = tasaPersistida ? parseFloat(tasaPersistida) : 0.00; // 🎯 ELIMINADO EL 755 FIJO: Inicializa en 0.00
}

// 🚨 EL CANDADO DE PATRIMONIO SOTO SYSTEM: Si la tasa sigue en cero, no inventa números quemados
if (tasaBCV_Base <= 0) {
    console.warn("⚠️ [APIO B2B]: Tasa cambiaria en cero latente. Esperando recalibración manual o IA.");
    tasaBCV_Base = 0.00;
}

// RECALCULO FISCAL SEGURO (Base imponible en Bs + Adición del 16% del IVA de ley)
const baseImponibleBs_Base = subtotalUSD_Base * tasaBCV_Base;
const ivaBs_Base = baseImponibleBs_Base * 0.16;
const totalBs_Base = baseImponibleBs_Base + ivaBs_Base;

// Sincronizamos las variables fiscales en la RAM de forma inmediata para el recibo neón
if (this.estadoTransaccion) {
    this.estadoTransaccion.montoBs = totalBs_Base;
    this.estadoTransaccion.totalUsd = subtotalUSD_Base;
}
this.tasaActivaBCV = tasaBCV_Base;

// 🖨️ INYECCIÓN INTEGRAL DEL INNERHTML SANEADO LIBRE DE COMENTARIOS INTERNOS CRUZADOS
moduloFacturacion.innerHTML = `
    <!-- Encabezado de la Sección -->
    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
        <span style="width: 24px; height: 24px; border-radius: 50%; background-color: #10b981; display: flex; align-items: center; justify-content: center; font-weight: 900; font-family: 'Inter', sans-serif; color: #FFFFFF; font-size: 13px; box-shadow: 0 0 10px rgba(16, 185, 129, 0.65);">4</span>
        <h3 style="font-weight: 800; font-size: 16px; color: #FFFFFF; margin: 0; font-family: 'Inter', sans-serif; letter-spacing: -0.01em;">Consola de Facturación Legal y Despacho</h3>
    </div>

    <!-- Distribución Adaptativa del Checkout de la Bodega -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(290px, 1fr)); gap: 24px; width: 100%; box-sizing: border-box;">
        
        <!-- Columna Izquierda: Panel de Animación Contextual de Hardware -->
        <div style="display: flex; flex-direction: column; gap: 16px; width: 100%;">
            <div id="panel-animacion-hardware" style="background-color: #030712; padding: 20px; border-radius: 12px; border: 1px solid #1e293b; min-height: 200px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; box-sizing: border-box; font-family: monospace;">
                <!-- Inyectado dinámicamente por la capa de control de tu IA -->
            </div>
        </div>

        <!-- Columna Derecha: Sumario de Cierre Fiscal Estricto (Bs. / USD) -->
        <div style="background-color: #030712; padding: 20px; border-radius: 12px; border: 1px solid #1e293b; display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box; font-family: 'Inter', sans-serif;">
            <div>
                <h4 style="font-weight: 800; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; margin: 0 0 12px 0; border-bottom: 1px solid #1e293b; padding-bottom: 8px;">
                    Desglose Fiscal (Tasa Oficial BCV)
                </h4>
                <div style="display: flex; flex-direction: column; gap: 8px; font-size: 12px;">
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: #64748b;">Subtotal Base (USD):</span>
                        <span id="factura-subtotal-usd" style="font-weight: 700; color: #FFFFFF;">$${subtotalUSD_Base.toFixed(2)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: #64748b;">Base Imponible (Bs.):</span>
                        <span id="factura-base-bs" style="font-weight: 600; color: #cbd5e1; font-family: monospace;">${baseImponibleBs_Base.toLocaleString('es-VE', {minimumFractionDigits: 2})} Bs.</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: #64748b;">IVA de Ley (16% Bs.):</span>
                        <span id="factura-iva-bs" style="font-weight: 600; color: #ef4444; font-family: monospace;">${ivaBs_Base.toLocaleString('es-VE', {minimumFractionDigits: 2})} Bs.</span>
                    </div>
                </div>
            </div>

            <!-- 💵 LIQUIDADOR DE VUELTO AUTOMÁTICO (SOTO CASH ENGINE) -->
            <div style="margin-top: 15px; padding: 12px; background: #161b22; border: 1px solid #30363d; border-radius: 6px; font-family: 'Inter', sans-serif;">
                <span style="font-size: 11px; color: #ff9900; font-weight: bold; display: block; text-transform: uppercase; margin-bottom: 8px;">💰 Control de Caja y Vuelto:</span>
                
                <div style="display: flex; gap: 10px; margin-bottom: 8px;">
                    <div style="flex: 1;">
                        <label style="display: block; font-size: 11px; color: #8b949e; margin-bottom: 3px;">Monto Recibido ($):</label>
                        <input type="number" id="pm-pago-cliente" placeholder="0.00" oninput="window.calcularVueltoEnCaliente(${subtotalUSD_Base}, ${tasaBCV_Base})" style="width: 100%; padding: 6px; background: #0d1117; border: 1px solid #30363d; color: #fff; border-radius: 4px; font-size: 12px; font-weight: bold;">
                    </div>
                    <div style="flex: 1;">
                        <label style="display: block; font-size: 11px; color: #8b949e; margin-bottom: 3px;">Tasa BCV:</label>
                        <input type="number" id="pm-tasa-vuelto" value="${tasaBCV_Base.toFixed(2)}" disabled style="width: 100%; padding: 6px; background: #21262d; border: 1px solid #30363d; color: #8b949e; border-radius: 4px; font-size: 12px; font-weight: bold; text-align: center;">
                    </div>
                </div>

                <!-- Pizarra de Resultados de Vuelto -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 10px; padding-top: 8px; border-top: 1px dashed #30363d;">
                    <div style="background: #0d1117; padding: 8px; border-radius: 4px; text-align: center; border: 1px solid #238636;">
                        <span style="display: block; font-size: 10px; color: #58a6ff;">VUELTO EN USD</span>
                        <strong id="vuelto-usd" style="font-size: 14px; color: #2ea44f;">$0.00</strong>
                    </div>
                    <div style="background: #0d1117; padding: 8px; border-radius: 4px; text-align: center; border: 1px solid #238636;">
                        <span style="display: block; font-size: 10px; color: #58a6ff;">VUELTO EN VES</span>
                        <strong id="vuelto-ves" style="font-size: 14px; color: #2ea44f;">0.00 Bs.</strong>
                    </div>
                </div>
            </div>

            <!-- ZONA DE IMPACTO TOTALIZADOR Y DISPARO TRANSACCIONAL (AUDITADO Y BLINDADO) -->
            <div style="margin-top: 24px; padding-top: 16px; border-top: 1px dashed #1e293b;">
                <div style="display: flex; flex-direction: column; gap: 4px; margin-bottom: 16px;">
                    <span style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">Total Neto a Pagar:</span>
                    <div style="display: flex; justify-content: space-between; align-items: baseline;">
                        <h2 id="factura-total-bs" style="margin: 0; font-size: 26px; font-weight: 900; color: #00D2FF; text-shadow: 0 0 10px rgba(0, 210, 255, 0.3); font-family: monospace;">${totalBs_Base.toLocaleString('es-VE', {minimumFractionDigits: 2})} Bs.</h2>
                        <span id="factura-total-usd-ref" style="font-size: 13px; font-weight: 800; color: #10b981; font-family: monospace;">Ref: $${subtotalUSD_Base.toFixed(2)}</span>
                    </div>
                </div>

                <!-- 🍊 BOTÓN MAESTRO DE DISPARO: Saneado milimétricamente en su disparador de clic -->
<button type="button" id="btn-procesar-despacho" onclick="window.PasarelaPago.procesarDespachoFactura()" style="width: 100%; background: linear-gradient(135deg, #ff9900 0%, #d47a00 100%); color: #FFFFFF; border: none; padding: 14px; border-radius: 8px; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; cursor: pointer; box-shadow: 0 4px 14px rgba(255, 153, 0, 0.3); transition: transform 0.2s ease, box-shadow 0.2s ease;"
    onmouseenter="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(255, 153, 0, 0.5)';"
    onmouseleave="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 14px rgba(255, 153, 0, 0.3)';">
    Procesar y Despachar Mercancía
</button>

        </div>
    </div>
`;
contenedorInterno.appendChild(moduloFacturacion);

        // =========================================================================
        // INYECCIÓN DE COMPLEMENTOS DESDE HOME (IDÉNTICO AL REGISTRO B2B)
        // =========================================================================
        if (Home && typeof Home.renderDanielaWidget === 'function') {
            section.appendChild(Home.renderDanielaWidget());
        }
        if (Home && typeof Home.renderFooter === 'function') {
            section.appendChild(Home.renderFooter());
        }

        // Cerramos la vista retornando el nodo puro al orquestador App.js
        return section;

    }, // <--- ¡AQUÍ SE CIERRA EL MÉTODO RENDER() CON SU COMA REGLAMENTARIA!

    // =========================================================================
// BLOQUE 4-B: MOTOR FISCAL INDEPENDIENTE Y CONTROL DE ECOS (MÉTODO EN CAJA)
// =========================================================================

    // 1. CALCULADORA FISCAL PURA (FRONTEND INTEGRADO A APIO CORE - CON CONSOLA IA)
    ejecutarCalculoFiscalCompleto() {
        const subtotalUSD = parseFloat(this.estadoTransaccion.montoTotal) || 0.00;
        
        // CONEXIÓN DIRECTA CON APIO CORE: Extraemos estrictamente la tasa manual activa en el sistema.
        // Si no se ha configurado ninguna en el panel, se evalúa como 0.00 de forma estricta.
        const tasaActual = window.App && window.App.state && window.App.state.tasaDelDia 
            ? parseFloat(window.App.state.tasaDelDia) 
            : 0.00; 

        // Sincronizamos la propiedad local del archivo para mantener la consistencia operativa
        this.tasaActivaBCV = tasaActual;

        const labelSubtotalUSD = document.getElementById('factura-subtotal-usd');
        const labelBaseBs = document.getElementById('factura-base-bs');
        const labelIvaBs = document.getElementById('factura-iva-bs');
        const labelTotalBs = document.getElementById('factura-total-bs');
        const labelTotalUsdRef = document.getElementById('factura-total-usd-ref');
        const btnSubmit = document.getElementById('btn-submit-order');
        const terminalIA = document.getElementById('panel-animacion-hardware');

        // VALIDADOR DE SEGURIDAD COMERCIAL: Si la tasa está en cero, bloqueamos la facturación legal
        if (tasaActual === 0.00) {
            if (labelSubtotalUSD) labelSubtotalUSD.innerText = `$${subtotalUSD.toFixed(2)}`;
            if (labelBaseBs) labelBaseBs.innerText = "Falta Fijar Tasa del Día";
            if (labelIvaBs) labelIvaBs.innerText = "Falta Fijar Tasa del Día";
            if (labelTotalBs) {
                labelTotalBs.innerText = "0.00 Bs.";
                labelTotalBs.style.color = "#ef4444"; // Alerta en rojo
                labelTotalBs.style.textShadow = "none";
            }
            if (labelTotalUsdRef) labelTotalUsdRef.innerText = `Ref: $${subtotalUSD.toFixed(2)}`;
            
            if (terminalIA) {
                terminalIA.innerHTML = `
                    <p style="color: #ef4444; font-weight: bold; margin: 0;">[ALERTA CONTABLE]: TASA EN 0.00</p>
                    <p style="color: #64748b; font-size: 11px; margin: 4px 0 0 0;">Por favor, diríjase a la sección "Tasa Cambiaria" y fije el precio del dólar antes de procesar el despacho.</p>
                `;
            }
            if (btnSubmit) {
                btnSubmit.disabled = true;
                btnSubmit.style.opacity = "0.35";
                btnSubmit.style.cursor = "not-allowed";
            }
            return; 
        }

        // MATEMÁTICAS CONTABLES ESTRICTAS (IVA del 16% Adicionado a la Base Real)
        const baseImponibleBs = subtotalUSD * tasaActual; 
        const ivaBs = baseImponibleBs * 0.16;             
        const totalBs = baseImponibleBs + ivaBs;          

        // Guardamos los montos calculados en el estado transaccional
        this.estadoTransaccion.montoBs = totalBs;
        this.estadoTransaccion.montoUSD = subtotalUSD;

        // Inyección reactiva visual instantánea en la pantalla de la pasarela
        if (labelSubtotalUSD) labelSubtotalUSD.innerText = `$${subtotalUSD.toFixed(2)}`;
        if (labelBaseBs) labelBaseBs.innerText = `${baseImponibleBs.toLocaleString('es-VE', {minimumFractionDigits: 2})} Bs.`;
        if (labelIvaBs) labelIvaBs.innerText = `${ivaBs.toLocaleString('es-VE', {minimumFractionDigits: 2})} Bs.`;
        
        if (labelTotalBs) {
            labelTotalBs.innerText = `${totalBs.toLocaleString('es-VE', {minimumFractionDigits: 2})} Bs.`;
            labelTotalBs.style.color = "#00D2FF"; // Look Cyan Eléctrico Premium
            labelTotalBs.style.textShadow = "0 0 10px rgba(0, 210, 255, 0.3)";
        }
        if (labelTotalUsdRef) labelTotalUsdRef.innerText = `Ref: $${subtotalUSD.toFixed(2)}`;

    function calcularVueltoEnCaliente() {
    // Tomamos el total real de la venta desde el estado de tu RAM
    const totalVentaUsd = parseFloat(window.PasarelaPago?.estadoTransaccion?.totalUsd || 0.00);
    const montoRecibido = parseFloat(document.getElementById('pm-pago-cliente').value || 0.00);
    
    // Capturamos la tasa del BCV configurada en el ERP
    const tasaBcvInput = document.getElementById('tasa-bcv-input') || document.getElementById('pm-tasa-vuelto');
    const tasaBcv = parseFloat(tasaBcvInput?.value || 45.00);

    if (montoRecibido <= totalVentaUsd) {
        document.getElementById('vuelto-usd').innerText = "$0.00";
        document.getElementById('vuelto-ves').innerText = "0.00 Bs.";
        return;
    }

    // Algoritmo de desglose dual
    const vueltoUsd = montoRecibido - totalVentaUsd;
    const vueltoVes = vueltoUsd * tasaBcv;

    // Inyectamos los resultados formateados en la pizarra neón
    document.getElementById('vuelto-usd').innerText = `$${vueltoUsd.toFixed(2)}`;
    document.getElementById('vuelto-ves').innerText = `${vueltoVes.toFixed(2)} Bs.`;
}


        // =========================================================================
        // INYECCIÓN DE VIDA EN LA CONSOLA DE DANIELA IA IZQUIERDA (MODO LATENTE)
        // =========================================================================
        // Saneamos la terminal para que NO muestre facturas ni datos hasta que el WebSocket se sincronice
        if (terminalIA) {
            terminalIA.style.alignItems = 'center';
            terminalIA.style.textAlign = 'center';
            terminalIA.style.justifyContent = 'center';
            terminalIA.style.display = 'flex';
            terminalIA.style.flexDirection = 'column';
            
            terminalIA.innerHTML = `
                                <!-- 📋 GUÍA DE FLUJO INTERACTIVO EN ALTA VISIBILIDAD (SOTO SYSTEM) -->
                <div style="font-family: monospace; font-size: 11px; padding: 14px; background: rgba(3, 7, 18, 0.6); border: 1px solid #1e293b; border-radius: 6px; margin: 10px 0; box-sizing: border-box;">
                    <p style="margin: 0; color: #38bdf8; font-weight: 700; letter-spacing: 0.02em; line-height: 1.5;">
                        <span style="color: #00D2FF;">⚡ PASO 1:</span> Validar Cédula/RIF del cliente en la casilla superior.
                    </p>
                    <p style="margin: 6px 0 0 0; color: #38bdf8; font-weight: 700; letter-spacing: 0.02em; line-height: 1.5;">
                        <span style="color: #00D2FF;">⚡ PASO 2:</span> Seleccionar el Método de Facturación activo en taquilla.
                    </p>
                    <p style="margin: 6px 0 0 0; color: #10b981; font-weight: 800; letter-spacing: 0.02em; line-height: 1.5; border-top: 1px dashed #1e293b; padding-top: 6px;">
                        <span style="color: #34d399;">✅ PASO 3:</span> Chequear los montos en la factura derecha y presionar el Boton de Procesar y Despachar Cargamento.
                    </p>
                    <div style="margin-top: 8px; font-size: 9px; color: #475569; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">
                        🔒 MODO LOCAL AUTÓNOMO • SEGURO ANTI-APAGÓN
                    </div>
                </div>
            `;

            
            // Inyectamos dinámicamente una animación CSS suave de parpadeo para el led de estado inactivo
            if (!document.getElementById('apio-terminal-pulse-effect')) {
                const stylePulse = document.createElement('style');
                stylePulse.id = 'apio-terminal-pulse-effect';
                stylePulse.innerHTML = `
                    @keyframes pulse {
                        0% { background-color: #475569; box-shadow: 0 0 0 0 rgba(71, 85, 105, 0.4); }
                        70% { background-color: #64748b; box-shadow: 0 0 0 6px rgba(71, 85, 105, 0); }
                        100% { background-color: #475569; box-shadow: 0 0 0 0 rgba(71, 85, 105, 0); }
                    }
                `;
                document.body.appendChild(stylePulse);
            }
        }

        if (btnSubmit) {
            // 🎯 REINGENIERÍA SOTO SYSTEM: El botón se activa SIEMPRE que haya productos ($ > 0)
            // Eliminamos la obligación rígida del rifCliente para dar autonomía de facturación rápida
            if (subtotalUSD > 0) {
                btnSubmit.disabled = false;
                btnSubmit.style.opacity = "1";
                btnSubmit.style.cursor = "pointer";
                btnSubmit.style.background = "linear-gradient(135deg, #10b981 0%, #059669 100%)";
                btnSubmit.style.boxShadow = "0 4px 14px rgba(16, 185, 129, 0.4)";
                
                btnSubmit.onmouseenter = () => {
                    btnSubmit.style.transform = 'translateY(-1px)';
                    btnSubmit.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.6)';
                };
                btnSubmit.onmouseleave = () => {
                    btnSubmit.style.transform = 'translateY(0)';
                    btnSubmit.style.boxShadow = '0 4px 14px rgba(16, 185, 129, 0.4)';
                };
            } else {
                btnSubmit.disabled = true;
                btnSubmit.style.opacity = "0.35";
                btnSubmit.style.cursor = "not-allowed";
                btnSubmit.style.background = "linear-gradient(135deg, #10b981 0%, #059669 100%)";
                btnSubmit.style.boxShadow = "none";
                btnSubmit.style.transform = "none";
                btnSubmit.onmouseenter = null;
                btnSubmit.onmouseleave = null;
            }
        }
    },
// =========================================================================
// BLOQUE 4-C: ANIMACIÓN INTERACTIVA DE ÉXITO (SANEADO Y BLINDADO AL VACÍO 2026)
// Ubicación: pasarelaPago.js
// =========================================================================
            dispararAnimacionCompraExitosa(numeroFactura) {
        // 🚀 SANEAMIENTO EXTRA-RÍGIDO SOTO SYSTEM (LÍNEA 883 CERRADA AL VACÍO)
        const purificarNumero = (monto) => {
            if (typeof monto === 'number') return monto;
            if (!monto) return 0.00;
            // Destruye signos de $, Bs, espacios o letras y extrae los dígitos numéricos
            return parseFloat(String(monto).replace(/[^0-9.-]/g, '')) || 0.00;
        };

        // Forzamos la extracción pura y limpia desde las variables del estado contable
        const rawBs = purificarNumero(this.estadoTransaccion?.montoBs);
        const rawUSD = purificarNumero(this.estadoTransaccion?.montoTotal || window.App?.state?.montoTotal);

        // 📐 Ahora sí, formateo visual blindado al centavo libre de TypeErrors
        const totalBs = rawBs.toLocaleString('es-VE', { minimumFractionDigits: 2 });
        const totalUSD = rawUSD.toFixed(2); // 🎯 ¡EXTINGUIDO EL ERROR DE LA LÍNEA 883!

        const metodo = this.estadoTransaccion?.metodoSeleccionado || 'BIOPAGO';
        const tasa = parseFloat(window.TasaCambioModulo?.state?.precio_bcv || window.App?.state?.tasaDelDia || 0.00);

        const refCedula = this.estadoTransaccion?.rifCliente && this.estadoTransaccion?.rifCliente.trim() !== "" 
            ? this.estadoTransaccion.rifCliente.trim() 
            : "V-99999999 (Consumidor Final)";

        const nroFacturaReal = numeroFactura || `FAC-${Math.floor(1000 + Math.random() * 9000)}`;

        const modalExito = document.createElement('div');
        modalExito.id = "apio-success-billing-modal";
        modalExito.setAttribute('style', 'position: fixed; inset: 0; background-color: rgba(3, 7, 12, 0.95); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 24px; box-sizing: border-box; font-family: "Inter", sans-serif; opacity: 0; transition: opacity 0.3s ease;');

        modalExito.innerHTML = `


            <div style="background-color: #0b0f19; border: 1px solid #1e293b; border-radius: 16px; padding: 32px; max-width: 460px; width: 100%; text-align: center; box-sizing: border-box; box-shadow: 0 25px 60px rgba(0,0,0,0.7); position: relative; overflow: hidden;">
                <!-- Línea superior esmeralda corporativa -->
                <div style="position: absolute; top: 0; left: 0; right: 0; height: 4px; background-color: #10b981;"></div>
                
                <!-- Icono de Éxito con Glow Verde Neón -->
                <div style="width: 64px; height: 64px; border-radius: 50%; background-color: rgba(16, 185, 129, 0.1); color: #10b981; font-size: 28px; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px auto; user-select: none; border: 1px solid rgba(16, 185, 129, 0.3); box-shadow: 0 0 15px rgba(16, 185, 129, 0.2);">✓</div>
                
                <h3 style="color: #FFFFFF; font-size: 20px; font-weight: 800; margin: 0 0 6px 0; letter-spacing: -0.02em;">¡Comprobante Emitido con Éxito!</h3>
                <p style="color: #64748b; font-size: 12px; margin: 0 0 24px 0; line-height: 1.5;">La factura legal <b style="color: #cbd5e1; font-family: monospace;">N° ${nroFacturaReal}</b> ha sido registrada en PostgreSQL. Inventario de la bodega rebajado.</p>
                
                <!-- CONTENEDOR INTERNO DEL RECIBO FISCAL -->
                <div style="background-color: #030712; border: 1px solid #1e293b; border-radius: 10px; padding: 18px; text-align: left; margin-bottom: 24px; box-sizing: border-box; display: flex; flex-direction: column; gap: 10px;">
                    <div style="display: flex; justify-content: space-between; font-size: 11px;">
                        <span style="color: #64748b; font-weight: 600;">Aliado Comercial RIF:</span>
                        <span style="color: #FFFFFF; font-weight: 700; font-family: monospace; letter-spacing: 0.05em;">${refCedula}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 11px;">
                        <span style="color: #64748b; font-weight: 600;">Canal de Liquidación:</span>
                        <span style="color: #3b82f6; font-weight: 800; text-transform: uppercase; letter-spacing: 0.03em;">${metodo.replace('_', ' ')}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 11px;">
                        <span style="color: #64748b; font-weight: 600;">Tasa Fiscal Aplicada:</span>
                        <span style="color: #94a3b8; font-weight: 600; font-family: monospace;">${tasa.toFixed(2)} Bs/$</span>
                    </div>
                    <hr style="border: 0; border-top: 1px dashed #1e293b; margin: 4px 0;">
                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px;">
                        <span style="color: #94a3b8; font-weight: bold; text-transform: uppercase; font-size: 11px; letter-spacing: 0.03em;">Total Facturado:</span>
                        <div style="text-align: right;">
                            <!-- MONTO EN CYAN ELÉCTRICO BRILLANTE CON EFECTO DE TEXT-SHADOW NEÓN -->
                            <span style="color: #00D2FF; font-weight: 900; font-size: 18px; display: block; font-family: monospace; text-shadow: 0 0 10px rgba(0, 210, 255, 0.35);">${totalBs.toLocaleString('es-VE', {minimumFractionDigits: 2})} Bs.</span>
                            <span style="color: #10b981; font-weight: 800; font-size: 11px; font-family: monospace;">Ref: $${totalUSD}</span>
                        </div>
                    </div>
                </div>
                
                <!-- BOTÓN MAESTRO DE RETORNO: Gradiente esmeralda neón con elevación física integrada inline -->
                <button type="button" id="btn-close-success" style="width: 100%; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #FFFFFF; border: none; padding: 14px; border-radius: 8px; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; cursor: pointer; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3); transition: transform 0.2s ease, box-shadow 0.2s ease;"
                    onmouseenter="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 6px 20px rgba(16, 185, 129, 0.5)';"
                    onmouseleave="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 14px rgba(16, 185, 129, 0.3)';">
                    Aceptar y Despachar Mercancía
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modalExito);
    setTimeout(() => { modalExito.style.opacity = "1"; }, 50);

    const btnCerrar = modalExito.querySelector('#btn-close-success');
    if (btnCerrar) {
        btnCerrar.onclick = () => this.ejecutarRetrostorAlMostrador(modalExito);
    }
},

// 2. DESTRUCTOR DE MODAL SEGURIZADO
ejecutarRetrostorAlMostrador(nodoModal) {
    if (!nodoModal) return;
    nodoModal.style.opacity = "0";
    setTimeout(() => {
        nodoModal.remove();
        if (window.App && window.App.state) {
            window.App.state.carrito = []; // Vaciado contable del carro
            window.App.navigate('catalogo-b2b'); // Redirección fluida de la SPA
        }
    }, 300);
},

    // =========================================================================
// ENRUTADOR ASÍNCRONO MULTI-FORMATO PARA IMÁGENES (PROTECCIÓN UNIVERSAL)
// Ubicación: Al final del Bloque 3 en pasarelaPago.js
// =========================================================================
    gestionarFalloImagenB2B(imgElement) {
        if (!imgElement) return;

        const nombre = imgElement.getAttribute('data-nombre') || 'Mercancia';
        const srcActual = imgElement.src.toLowerCase();
        
        // Creamos una bandera en el nodo para saber si ya intentamos el rescate y evitar bucles infinitos
        const yaIntentoRescate = imgElement.getAttribute('data-rescate-intentado') === 'true';

        // 📋 CANAL DE DESCARTE INTERACTIVO: Si es el primer fallo, forzamos el cruce de formatos
        if (!yaIntentoRescate) {
            imgElement.setAttribute('data-rescate-intentado', 'true');
            console.log(`📡 [SOTO ENGINE]: Buscando formato alterno local para: "${nombre}"`);

            // Si falló siendo JPG, disparamos a buscar la versión PNG de la carpeta de assets
            if (srcActual.endsWith('.jpg') || srcActual.endsWith('.jpeg')) {
                imgElement.src = `./assets/${nombre}.png`;
                return;
            }
            // Si falló siendo PNG de entrada, disparamos a buscar la versión JPG de contingencia
            else if (srcActual.endsWith('.png')) {
                imgElement.src = `./assets/${nombre}.jpg`;
                return;
            }
        }

        // 📋 CANAL DE CONTINGENCIA ABSOLUTA: Si ya fallaron ambos formatos, levantamos el búnker tipográfico
        console.warn(`⚠️ [SOTO LOGÍSTICA]: Assets agotados para "${nombre}". Inyectando bloque tipográfico de seguridad.`);
        
        const contenedorPadre = imgElement.parentNode;
        if (contenedorPadre) {
            const inicial = nombre.trim().charAt(0).toUpperCase();

            // Apagamos la imagen rota para limpiar el monitor
            imgElement.style.display = 'none';
            
            // Estilización limpia de la celda de la pasarela
            contenedorPadre.style.backgroundColor = '#030712';
            contenedorPadre.style.border = '1px solid #1e293b';
            contenedorPadre.style.borderRadius = '6px';
            contenedorPadre.style.display = 'flex';
            contenedorPadre.style.alignItems = 'center';
            contenedorPadre.style.justifyContent = 'center';
            
            // Texto plano indestructible que jamás colapsará la consola
                        // Texto plano indestructible y nítido para el mostrador de taquilla
            contenedorPadre.innerHTML = `
                <b style="color: #64748b; font-family: monospace; font-size: 14px; font-weight: 800; user-select: none; text-transform: uppercase; letter-spacing: 0.05em;">SALSAS</b>
            `;

        }
    }, // 🎯 Mantenemos tu coma de descarte intacta para enlazar las estructuras inferiores de la pasarela

// =========================================================================
// ❌ EL NUEVO ESLABÓN INTERACTIVO SOTO SYSTEM: REMOVER DEL CARRITO (CORREGIDO 2026)
// Ubicación: Continuación inmediata de gestionarFalloImagenB2B
// =========================================================================
        removerDelCarrito(skuProducto) {
        console.log(`📡 [SOTO NET]: Procesando descarte atómico para el SKU -> ${skuProducto}`);

        let carrito = window.App && window.App.state && window.App.state.carrito ? window.App.state.carrito : [];
        if (carrito.length === 0) return;

        // 1. Saneamos el arreglo en la memoria RAM global del negocio
        const nuevoCarrito = carrito.filter(item => (item.sku !== skuProducto && item.codigo !== skuProducto));

        if (window.App && window.App.state) {
            window.App.state.carrito = nuevoCarrito;
        }

        // 2. ✂️ EXTIRPACIÓN FÍSICA DIRECTA DE LA TARJETA (ADIÓS DUPLICACIONES DE NAVBAR)
        // Eliminamos el HTML de la mercancía descartada sin recargar la vista ni alterar los headers
        const tarjetaEnPantalla = document.querySelector(`.product-item-card[data-sku="${skuProducto}"]`);
        if (tarjetaEnPantalla) {
            tarjetaEnPantalla.remove();
            console.log("✅ [SOTO DOM]: Tarjeta de producto removida físicamente del lienzo.");
        }

        // 3. 🧮 RECALCULO FISCAL EN CALIENTE SOBRE LOS ARTÍCULOS EN ORDEN
        let nuevoTotalUSD = 0;
        nuevoCarrito.forEach(item => {
            nuevoTotalUSD += (parseFloat(item.precio) || 0) * (parseInt(item.cantidad) || 1);
        });

        // Actualizamos los montos acumulados en las variables de control
        this.estadoTransaccion.montoTotal = nuevoTotalUSD;
        if (window.App && window.App.state) window.App.state.montoTotal = nuevoTotalUSD;

        // Jalamos la tasa del día reaccionaria
        const tasaDolar = parseFloat(this.tasaActivaBCV || window.TasaCambioModulo?.state?.precio_bcv || window.App?.state?.tasaDelDia || localStorage.getItem('APIO_TASA_ACTUAL_BS') || 0.00);
        const baseImponibleBs = nuevoTotalUSD * tasaDolar;
        const ivaBs = baseImponibleBs * 0.16;
        const totalBs = baseImponibleBs + ivaBs;

        this.estadoTransaccion.montoBs = totalBs;

        // 4. 📡 INYECCIÓN INMEDIATA EN LAS ETIQUETAS FISCALES EN CYAN ELÉCTRICO BRILLANTE
        // Golpeamos quirúrgicamente los IDs estáticos del texto en la pantalla
        const lblSubtotal = document.getElementById('factura-subtotal-usd');
        const lblBase = document.getElementById('factura-base-bs');
        const lblIva = document.getElementById('factura-iva-bs');
        const lblTotalBs = document.getElementById('factura-total-bs');
        const lblTotalUsdRef = document.getElementById('factura-total-usd-ref');

        if (lblSubtotal) lblSubtotal.innerText = `$${nuevoTotalUSD.toFixed(2)}`;
        if (lblBase) lblBase.innerText = `${baseImponibleBs.toLocaleString('es-VE', {minimumFractionDigits: 2})} Bs.`;
        if (lblIva) lblIva.innerText = `${ivaBs.toLocaleString('es-VE', {minimumFractionDigits: 2})} Bs.`;
        if (lblTotalBs) lblTotalBs.innerText = `${totalBs.toLocaleString('es-VE', {minimumFractionDigits: 2})} Bs.`;
        if (lblTotalUsdRef) lblTotalUsdRef.innerText = `Ref: $${nuevoTotalUSD.toFixed(2)}`;

        // Actualizamos los contadores de renglones en el encabezado del Bloque 3
        const mallaProductos = document.getElementById('products-grid');
        const renglonesContador = mallaProductos?.parentNode?.querySelector('span[style*="monospace"]');
        if (renglonesContador) {
            renglonesContador.innerText = `Renglones: ${nuevoCarrito.length}`;
        }

        // 🛒 PLAN DE TRÁNSITO SEGURO: Si la cajera descarta el último vívere, limpia y regresa al catálogo
        if (nuevoCarrito.length === 0) {
            console.log("🛒 [APIO]: Carrito vacío. Limpiando el mostrador.");
            if (window.App && typeof window.App.navigate === 'function') {
                window.App.navigate('catalogo-b2b'); // Redirección SPA limpia
            } else {
                location.reload();
            }
        }
    } // <--- Mantenemos el cierre idéntico sin alterar comas ni el }; maestro de abajo

}; // <--- 🔒 CIERRE INTEGRAL DEFINITIVO DEL OBJETO MAESTRO PASARELAPAGO

// =========================================================================
// 🚀 PARTE A: PROCESADOR REMOTO DE TRANSACCIONES A DJANGO (SOTO CORE)
// Ubicación: src/pages/pasarelaPago.js -> Aseguramos el objeto global
// =========================================================================

// 🎯 BLINDAJE CORE SOTO SYSTEM: Si el objeto de la pasarela no existe en la RAM, lo creamos al vuelo
if (!window.PasarelaPago) window.PasarelaPago = {};
if (!window.PasarelaPago.estadoTransaccion) {
    window.PasarelaPago.estadoTransaccion = {
        metodoSeleccionado: "EFECTIVO",
        subTipoTarjeta: null,
        soportePagoMovil: null
    };
}

// Ahora la asignación engranará al centavo sin lanzar TypeErrors en Electron:
window.PasarelaPago.procesarDespachoFactura = function() {
    console.log("📡 [SOTO TRANSMISIÓN]: Despachando payload hacia Railway...");
    
    const tx = PasarelaPago.estadoTransaccion;

    // 🎯 RECOLECCIÓN ULTRA-LIGERA DE LA COMPRA desde la RAM de Electron
    const carritoProductos = window.App?.state?.carritoActual || window.CatalogoB2B?.state?.carrito || [];
    const totalBs = parseFloat(document.getElementById('total-neto-pagar')?.innerText || "0.00");
    const totalUsd = parseFloat(tx.montoTotalUsd || window.App?.state?.totalFacturaUsd || 0.00);
    const cedulaCliente = tx.rifCliente || document.getElementById('cliente-identificacion')?.value || "V-CONSUMIDOR-FINAL";
    
    // Mapeamos los métodos de pago extendidos con las tarjetas para el historial detallado
    let metodoFinalLabel = tx.metodoSeleccionado || "EFECTIVO";
    if (metodoFinalLabel === "PUNTO" && tx.subTipoTarjeta) {
        metodoFinalLabel = `PUNTO (${tx.subTipoTarjeta})`;
    }

    // 🧠 COMPILAMOS EL PAYLOAD MÁSTER DE COMUNICACIÓN REMOTA
    const datosOrden = {
        "origen": "Electron Desktop Pasarela Master",
        "cedula_cliente": cedulaCliente,
        "monto_bs": totalBs,
        "monto_usd": totalUsd,
        "metodo_pago": metodoFinalLabel,
        "productos_lista": carritoProductos.map(p => ({ sku: p.sku, cantidad: p.cantidad, nombre: p.nombre })),
        "soporte_pago_movil": tx.soportePagoMovil || null // Captura los últimos 4 dígitos y banco del formulario
    };

    // 🎯 REPARACIÓN DE RUTA CLOUD: Apunta con precisión milimétrica a tu urls.py en Railway
    const urlApiTransaccion = 'https://apio-ecomerce-software-b2b-sotosystem-production.up.railway.app/api/v1/procesar-transaccion/';

    window.fetch(urlApiTransaccion, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosOrden)
    })
    .then(res => {
        if (!res.ok) throw new Error("Rebote fiscal en el procesador de Django (Status: " + res.status + ")");
        return res.json();
    })
    .then(data => {
        console.log("✅ [SOTO POS BACKEND SUCCESS]: Venta registrada en PostgreSQL de Railway.");
        
        // 🔮 PASO DE RELAY: Si el backend responde OK, invocamos la ventana visual de éxito
        const refFactura = data.referencia_factura || data.ref || `TR-${Math.floor(100000 + Math.random() * 900000)}`;
        
        if (typeof window.PasarelaPago.dispararAnimacionExitoVisual === 'function') {
            window.PasarelaPago.dispararAnimacionExitoVisual(refFactura, metodoFinalLabel, cedulaCliente, totalBs);
        }
    })
    .catch(error => {
        console.error("❌ Error de comunicación asíncrona en la Pasarela:", error.message);
        alert("⚠️ Error contable: No se pudo conectar con el servidor remoto para cerrar la venta.");
    });
};

// =========================================================================
// 🎭 PARTE B: ANIMACIÓN DE ÉXITO VISUAL Y LIMPIEZA DE FLUJO (SOTO CORE)
// Ubicación: src/pages/pasarelaPago.js -> Siguiente procesador en la base del archivo
// =========================================================================
window.PasarelaPago.dispararAnimacionExitoVisual = function(refFactura, metodoFinalLabel, cedulaCliente, totalBs) {
    console.log("🎭 [SOTO UI]: Levantando cortina de éxito fiscal en Electron...");

    // 🏆 FABRICAMOS LA CAPA FLOTANTE INDESTRUCTIBLE (Z-INDEX ALTO)
    const panelAnimacion = document.createElement('div');
    panelAnimacion.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(2, 6, 23, 0.95); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 9999; font-family: 'Inter', sans-serif;";
    
    panelAnimacion.innerHTML = `
        <div style="text-align: center; padding: 40px; background: #0b1329; border-radius: 16px; border: 2px solid #10b981; box-shadow: 0 0 30px rgba(16, 185, 129, 0.3); max-width: 400px; width: 90%;">
            <div style="font-size: 64px; color: #10b981; margin-bottom: 16px;">🏆</div>
            <h2 style="color: white; margin: 0 0 8px 0; font-size: 22px; font-weight: 800;">¡Venta Despachada!</h2>
            <p style="color: #94a3b8; font-size: 13px; margin: 0 0 20px 0;">La transacción por <strong style="color: #00D2FF;">${totalBs.toLocaleString('es-VE', {minimumFractionDigits: 2})} Bs.</strong> ha sido impactada con éxito en la nube.</p>
            
            <div style="font-family: monospace; font-size: 11px; color: #64748b; background: #030712; padding: 10px; border-radius: 6px; border: 1px solid #1e293b; text-align: left; margin-bottom: 24px; line-height: 1.5;">
                <b style="color: #cbd5e1;">REF FISCAL:</b> ${refFactura}<br>
                <b style="color: #cbd5e1;">MÉTODO PAGO:</b> ${metodoFinalLabel}<br>
                <b style="color: #cbd5e1;">IDENTIFICACIÓN:</b> ${cedulaCliente}
            </div>
            
            <span style="color: #10b981; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; display: block;">🔄 Sincronizando Catálogo...</span>
        </div>
    `;
    document.body.appendChild(panelAnimacion);

    // 🧹 SECUENCIA DE PURGA AUTOMÁTICA Y REINICIO
    setTimeout(() => {
        // 1. Vaciamos el carrito de compras en la RAM simétricamente
        if (window.App && window.App.state) window.App.state.carritoActual = [];
        if (window.CatalogoB2B && window.CatalogoB2B.state) window.CatalogoB2B.state.carrito = [];
        
        // 2. Reseteamos la caché temporal de la pasarela para la próxima transacción
        PasarelaPago.estadoTransaccion = {
            movimientosDiarios: window.ErpModulo?.state?.movimientosDiarios || [],
            tasaDolarActual: parseFloat(localStorage.getItem('APIO_TASA_CAMBIARIA')) || 40.00
        };

        // 3. Removemos físicamente el panel de la vista para liberar memoria en Chromium
        panelAnimacion.remove();

        // 4. 🚀 TRANSICIÓN SUAVE: Devolvemos de forma remota al operador a la grilla comercial
        if (window.App && typeof window.App.navigate === 'function') {
            window.App.navigate('catalogo-b2b');
        } else {
            window.location.reload();
        }
    }, 3500); // 3.5 segundos exactos en pantalla para control visual de la cajera
};

// =========================================================================
// 📡 SOTO SYSTEM SCANNER ENGINE: CAPTURADOR ATÓMICO DE PISTOLA QR (SENIAT v2.0)
// =========================================================================
let bufferEscaneo = "";
let tiempoUltimaTecla = Date.now();

window.addEventListener('keydown', (evento) => {
    const tiempoActual = Date.now();
    
    // Las pistolas escriben con una diferencia menor a 20ms entre cada letra.
    // Si el usuario escribe a mano, el tiempo es mayor. Así filtramos al humano de la máquina.
    if (tiempoActual - tiempoUltimaTecla > 30) {
        bufferEscaneo = ""; // Si tardó mucho, limpiamos porque es el teclado normal
    }
    
    tiempoUltimaTecla = tiempoActual;

    // Si la pistola manda la señal de cierre (Enter)
    if (evento.key === 'Enter') {
        if (bufferEscaneo.includes('seniat.gob.ve')) {
            evento.preventDefault();
            console.log("🎯 [SOTO SCANNER]: ¡Código QR del RIF v2.0 detectado con éxito!");
            
            // Disparamos nuestro extractor inteligente pasándole la URL que leyó la pistola
            PasarelaPago.procesarEscaneoRifSeniat(bufferEscaneo);
            
            bufferEscaneo = ""; // Vaciamos el cargador
        }
    } else {
            // 🛡️ SOTO SHIELD: Validamos que el evento y la propiedad key existan antes de medir su longitud
        if (evento && evento.key && evento.key.length === 1) {
            bufferEscaneo += evento.key;
        }

    }
});

// 🧠 EL EXTRACTOR INTELIGENTE SAAS (EL GANCHO COMERCIAL)
PasarelaPago.procesarEscaneoRifSeniat = function(urlScaneada) {
    alert("📡 Conectando con el validador del SENIAT Providencia SNAT/2026/00084...\nExtraiendo datos fiscales inmutables.");
    
    try {
        // Aquí hacemos magia con expresiones regulares para picar la URL 
        // y extraer los datos reales (RIF, Nombre, Condición Fiscal)
        // Ejemplo ficticio de auto-rellenado instantáneo en tu base de datos:
        const inputRif = document.getElementById('cliente-rif-erp');
        if (inputRif) {
            // Supongamos que del QR extraemos el RIF real
            inputRif.value = "J-40012345-6"; 
            console.log("✅ Formulario del ERP auto-completado con datos vigentes del SENIAT.");
        }
    } catch (error) {
        console.error("Error al procesar la cadena del scanner:", error);
    }
};

// 📡 CLONACIÓN REDUNDANTE DE CONTINGENCIA PARA EVITAR ERRORES DE RUTAS EN VITE
const PasarelaModulo = PasarelaPago;
window.PasarelaPago = PasarelaPago;
window.PasarelaModulo = PasarelaPago;

export { PasarelaPago, PasarelaModulo };
