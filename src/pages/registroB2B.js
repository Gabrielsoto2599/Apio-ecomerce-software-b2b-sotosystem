// =========================================================================
// BLOQUE 0: INICIALIZACIÓN Y CONFIGURACIÓN DEL ENTORNO DE REGISTRO B2B (REPARADO)
// =========================================================================
import { Home } from './home.js'; // Importamos el Home para heredar a Daniela y el Footer

const RegistroB2B = {
    clientesRegistrados: JSON.parse(localStorage.getItem('APIO_CARTERA_CLIENTES_MANUAL')) || [],
    // Estados locales del formulario para el mostrador de la bodega
    datosFormulario: {
        rif: '',
        razonSocial: '',
        telefono: '',
        direccion: ''
    },

    // Cartera temporal en memoria para listar en este turno
    clientesRegistrados: [],

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
            <!-- Encabezado de la Sección Homologado para Todo Tipo de Vínculo Comercial -->
            <div style="width: 100%; max-width: 900px; margin: 0 auto 24px auto; box-sizing: border-box; text-align: left;">
                <p style="color: #64748b; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin: 0; font-family: 'Inter', sans-serif;">Onboarding de Comercios y Personas SaaS</p>
                <h1 style="color: #ffffff; font-size: 26px; font-weight: 800; margin: 4px 0 0 0; letter-spacing: -0.02em; font-family: 'Inter', sans-serif;">Registro General de Clientes</h1>
            </div>
            
            <!-- Zona de Inyección Máxima Acotada a 900px -->
            <div id="contenedor-registro-b2b" style="width: 100%; max-width: 900px; margin: 0 auto; box-sizing: border-box;"></div>
        `;

        section.appendChild(mainContent);

        const contenedorInterno = mainContent.querySelector('#contenedor-registro-b2b');

        // =========================================================================
        // BLOQUE 1: CONSTRUCCIÓN E INYECCIÓN DE LA TARJETA DEL FORMULARIO (MVP)
        // =========================================================================
        const formularioBox = document.createElement('div');
        formularioBox.id = "soto-form-card-container";
        formularioBox.style.backgroundColor = "#131921"; 
        formularioBox.style.padding = "24px";
        formularioBox.style.borderRadius = "8px";
        formularioBox.style.border = "1px solid #232F3E";
        formularioBox.style.marginBottom = "32px";
        formularioBox.style.boxSizing = "border-box";

        formularioBox.innerHTML = `
            <form id="form-registro-bodega" style="display: grid; grid-template-columns: repeat(1, minmax(0, 1fr)); gap: 16px;">
                
                <!-- Fila 1: ID Cédula y Nombre Completo -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; width: 100%;">
                    <div style="display: flex; flex-direction: column; gap: 4px;">
                        <label style="color: #94a3b8; font-size: 11px; font-weight: 700; text-transform: uppercase; font-family: 'Inter', sans-serif; letter-spacing: 0.05em;">Cédula / ID Único</label>
                        <input type="text" id="reg-cedula" placeholder="Ej. V-12345678" required
                            style="padding: 12px; border-radius: 6px; border: 1px solid #232F3E; background: #0B0E14; color: #FFFFFF; font-size: 13px; font-weight: 600; outline: none; font-family: 'Inter', sans-serif; transition: border-color 0.2s;"
                            onfocus="this.style.borderColor='#2563EB'" onblur="this.style.borderColor='#232F3E'">
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 4px;">
                        <label style="color: #94a3b8; font-size: 11px; font-weight: 700; text-transform: uppercase; font-family: 'Inter', sans-serif; letter-spacing: 0.05em;">Nombre / Razón Social</label>
                        <input type="text" id="reg-nombre" placeholder="Ej. Juan Pérez / Bodega La Bendición" required
                            style="padding: 12px; border-radius: 6px; border: 1px solid #232F3E; background: #0B0E14; color: #FFFFFF; font-size: 13px; font-weight: 600; outline: none; font-family: 'Inter', sans-serif; transition: border-color 0.2s;"
                            onfocus="this.style.borderColor='#2563EB'" onblur="this.style.borderColor='#232F3E'">
                    </div>
                </div>

                <!-- Fila 2: Teléfono y Clasificación de Vínculo Comercial -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; width: 100%;">
                    <div style="display: flex; flex-direction: column; gap: 4px;">
                        <label style="color: #94a3b8; font-size: 11px; font-weight: 700; text-transform: uppercase; font-family: 'Inter', sans-serif; letter-spacing: 0.05em;">Teléfono (Pago Móvil)</label>
                        <input type="tel" id="reg-telefono" placeholder="Ej. 04141234567" required
                            style="padding: 12px; border-radius: 6px; border: 1px solid #232F3E; background: #0B0E14; color: #FFFFFF; font-size: 13px; font-weight: 600; outline: none; font-family: 'Inter', sans-serif; transition: border-color 0.2s;"
                            onfocus="this.style.borderColor='#2563EB'" onblur="this.style.borderColor='#232F3E'">
                    </div>
                                        <!-- CONTENEDOR DE PERFILES HOMOLOGADO SOTO SYSTEM (REGISTRO UNIVERSAL 2026) -->
                    <div style="display: flex; flex-direction: column; gap: 4px;">
                        <label style="color: #94a3b8; font-size: 11px; font-weight: 700; text-transform: uppercase; font-family: 'Inter', sans-serif; letter-spacing: 0.05em;">Tipo de Cliente / Vínculo</label>
                        <select id="reg-tipo" 
                            style="padding: 12px; border-radius: 6px; border: 1px solid #232F3E; background: #0B0E14; color: #FFFFFF; font-size: 13px; font-weight: 600; outline: none; cursor: pointer; font-family: 'Inter', sans-serif; transition: border-color 0.2s;"
                            onfocus="this.style.borderColor='#2563EB'" onblur="this.style.borderColor='#232F3E'">
                            <option value="MINORISTA">Cliente Minorista (Precio Detal)</option>
                            
                            <!-- 🎯 CORE ALINEADO: Cambiado de "FIADO" a "DEUDOR" para hacer match perfecto con la Cartera -->
                            <option value="DEUDOR">Cuenta por Cobrar (Deudor / Fiado)</option>
                            
                            <option value="MAYORISTA" selected>Comerciante Mayorista (Aliado B2B)</option>
                        </select>
                    </div>

                </div>

                                <!-- Botón de Envío Homologado para el Operador -->
                <div style="margin-top: 8px;">
                    <button type="submit" id="btn-submit-registro"
                        style="width: 100%; background: #2563EB; color: #FFFFFF; border: none; padding: 14px; border-radius: 6px; font-size: 13px; font-weight: 700; text-transform: uppercase; cursor: pointer; transition: background 0.2s; font-family: 'Inter', sans-serif; letter-spacing: 0.05em;"
                        onmouseenter="this.style.background='#1d4ed8'" onmouseleave="this.style.background='#2563EB'">
                        Registrar Cliente
                    </button>
                </div>

        `;
        contenedorInterno.appendChild(formularioBox);

        // Contenedor para el listado de control en vivo que dibujará la tabla
        const tablaClientesBox = document.createElement('div');
        tablaClientesBox.id = "soto-clientes-listado-container";
        contenedorInterno.appendChild(tablaClientesBox);

        // === INYECCIÓN PROTEGIDA DE ENTORNO EN EL NODO MAESTRO (DANIELA IA) ===
        if (Home && typeof Home.renderDanielaWidget === 'function') {
            section.appendChild(Home.renderDanielaWidget());
        } else if (window.Home && typeof window.Home.renderDanielaWidget === 'function') {
            section.appendChild(window.Home.renderDanielaWidget());
        }

        // === INYECCIÓN PROTEGIDA DE ENTORNO EN EL NODO MAESTRO (FOOTER SOTO SYSTEM) ===
        if (Home && typeof Home.renderFooter === 'function') {
            section.appendChild(Home.renderFooter());
        } else if (window.Home && typeof window.Home.renderFooter === 'function') {
            section.appendChild(window.Home.renderFooter());
        }

                // Cola asíncrona segura para ejecutar los amarres lógicos post-renderizado
        setTimeout(() => {
            // 1. REPARACIÓN EXACTA: Apunta al ID real del dropdown en el HTML del registro
            const btnTodoLocal = section.querySelector('#btn-master-todo');
            const dropdownLocal = section.querySelector('#dropdown-categories') || document.getElementById('dropdown-categories');
            
            if (btnTodoLocal && dropdownLocal) {
                btnTodoLocal.addEventListener('click', (e) => {
                    e.stopPropagation(); // Detiene la propagación para evitar cierres fantasmas
                    dropdownLocal.classList.toggle('active');
                });
            }

            // Evento global pasivo para cerrar el menú si el bodeguero hace clic en el fondo de la pantalla
            document.addEventListener('click', () => {
                if (dropdownLocal) dropdownLocal.classList.remove('active');
            });

            // 2. Amarre nativo para capturar los inputs y la persistencia temporal
            if (typeof this.vincularManejadoresEventos === 'function') {
                this.vincularManejadoresEventos(section);
            }
        }, 0);

        return section;
    },

    // =========================================================================
    // 🚀 BLOQUE 2: DISPARADOR ASÍNCRONO DIRECTO HACIA RAILWAY CLOUD (CONEXIÓN PURA)
    // Ubicación: Mapeo de entradas y evento Submit en tu archivo registroB2B.js
    // =========================================================================
    vincularManejadoresEventos(viewContainer) {
        const self = window.RegistroB2B || this;
        const form = viewContainer.querySelector('#form-registro-bodega');
        if (!form) return;

        // Mapa de sincronización interactiva para el mostrador de la bodega
        const inputsMap = [
            { id: '#reg-cedula', llave: 'rif' },           
            { id: '#reg-nombre', llave: 'razonSocial' },   
            { id: '#reg-telefono', llave: 'telefono' }
        ];

        inputsMap.forEach(item => {
            const inputNode = viewContainer.querySelector(item.id);
            if (inputNode) {
                inputNode.addEventListener('input', (e) => {
                    if (!self.datosFormulario) self.datosFormulario = {};
                    self.datosFormulario[item.llave] = e.target.value.trim();
                });
            }
        });

        // Escucha del selector de tipo de cliente comercial
        const selectNode = viewContainer.querySelector('#reg-tipo');
        if (selectNode) {
            if (!self.datosFormulario) self.datosFormulario = {};
            self.datosFormulario.direccion = selectNode.value; 

            selectNode.addEventListener('change', (e) => {
                self.datosFormulario.direccion = e.target.value; 
            });
        }

        // Intercepción del Submit contra dobles clics y disparo transaccional cloud
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btnSubmit = form.querySelector('#btn-submit-registro');
            if (btnSubmit) {
                btnSubmit.disabled = true;
                btnSubmit.innerText = "Transmitiendo a Railway Cloud...";
                btnSubmit.style.background = "#475569";
            }

            try {
                const cedulaCruda = (self.datosFormulario?.rif || '').trim().toUpperCase();
                const nombreCrudo = (self.datosFormulario?.razonSocial || '').trim();
                const tipoPerfil = self.datosFormulario?.direccion || 'MAYORISTA';

                if (cedulaCruda.length < 4 || nombreCrudo.length === 0) {
                    alert("⚠️ Alerta Formulario: Ingrese una Identificación y Cédula válida antes de proceder.");
                    if (btnSubmit) {
                        btnSubmit.disabled = false;
                        btnSubmit.innerText = "Registrar Cliente";
                        btnSubmit.style.background = "#2563EB";
                    }
                    return;
                }

                // 🎯 PAYLOAD MÁSTER DE INTERNET: Estructuramos el JSON nativo para tu backend en Python
                const payloadClienteCloud = {
                    "origen": "Electron Desktop Onboarding Master",
                    "cedula": cedulaCruda,
                    "nombre": nombreCrudo,
                    "telefono": self.datosFormulario.telefono || 'Sin Teléfono',
                    "tipo_vinculo": tipoPerfil,
                    "saldo_inicial": (tipoPerfil === 'DEUDOR') ? 15.00 : 0.00
                };

                // 🔌 EL PUENTE CLOUD: Extirpada la promesa falsa por un fetch real a Django en Railway
                const urlApiRegistro = 'https://apio-ecomerce-software-b2b-sotosystem-production.up.railway.app/api/v1/registrar-cliente/';

                const respuestaNet = await window.fetch(urlApiRegistro, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payloadClienteCloud)
                });

                if (!respuestaNet.ok) throw new Error("Rebote del servidor en Railway (Status: " + respuestaNet.status + ")");
                const dataCloud = await respuestaNet.json();

                // Estructuramos el expediente con la data real que retorna la nube
                const nuevoCliente = {
                    cedula: dataCloud.cedula || cedulaCruda,
                    nombre: dataCloud.nombre || nombreCrudo,
                    telefono: dataCloud.telefono || payloadClienteCloud.telefono,
                    tipo: dataCloud.tipo_vinculo || tipoPerfil, 
                    saldoDeuda: parseFloat(dataCloud.saldo_inicial || payloadClienteCloud.saldo_inicial),
                    fechaRegistro: dataCloud.fecha_registro || new Date().toLocaleDateString('es-VE')
                };

                // Insertamos en el buffer de la jornada actual
                if (!self.clientesRegistrados) self.clientesRegistrados = [];
                self.clientesRegistrados.unshift(nuevoCliente);

                // 📡 SINCRO INTERACTIVA: Suministramos el espejo en la RAM global para la Pasarela de Pago
                if (!window.App) window.App = {};
                if (!window.App.state) window.App.state = {};
                if (!window.App.state.carteraClientesGlobal) window.App.state.carteraClientesGlobal = [];
                window.App.state.carteraClientesGlobal.push(nuevoCliente);
                
                if (window.ClientesB2B && window.ClientesB2B.state) {
                    window.ClientesB2B.state.listaClientes = window.App.state.carteraClientesGlobal;
                }

                alert(`🎉 ¡Éxito Cloud!\n\nCliente [${nuevoCliente.nombre}] dado de alta correctamente en PostgreSQL de Railway como [${nuevoCliente.tipo}].`);

                form.reset();
                self.datosFormulario = { rif: '', razonSocial: '', telefono: '', direccion: selectNode ? selectNode.value : 'MAYORISTA' };

                if (typeof self.renderTablaClientes === 'function') {
                    self.renderTablaClientes(viewContainer);
                }

            } catch (error) {
                console.error("❌ Error en persistencia de Onboarding Cloud:", error.message);
                alert("⚠️ Error Cloud: No se pudo conectar con Railway. Los datos no se subieron a internet.");
            } finally {
                if (btnSubmit) {
                    btnSubmit.disabled = false;
                    btnSubmit.innerText = "Registrar Cliente";
                    btnSubmit.style.background = "#2563EB";
                }
            }
        });

        if (typeof self.renderTablaClientes === 'function') {
            self.renderTablaClientes(viewContainer);
        }
    }, // <-- Coma de separación obligatoria para enlazar de forma legal con el Bloque 3 de abajo

    // =========================================================================
// 🎨 BLOQUE 3: HISTORIAL EN TIEMPO REAL MULTIPERFIL (REPARADO AL VACÍO)
// Ubicación: Al puro final de tu archivo registroB2B.js
// =========================================================================
    renderTablaClientes(viewContainer) {
        // Buscamos el contenedor físico de la lista inyectado en el DOM
        const tablaContainer = viewContainer.querySelector('#soto-clientes-listado-container');
        if (!tablaContainer) return;

        const listaClientesTurno = this.clientesRegistrados || [];

        // 1. Si no hay registros en la sesión, pintamos la contingencia visual limpia
        if (listaClientesTurno.length === 0) {
            tablaContainer.innerHTML = `
                <div style="border: 1px dashed #232F3E; padding: 32px; border-radius: 8px; text-align: center; color: #64748b; font-family: 'Inter', sans-serif; width: 100%;">
                    📋 Ningún cliente registrado en el mostrador durante este turno.
                </div>
            `;
            return;
        }

        let tarjetasHTML = '';
        
        // 2. Recorremos los perfiles unificados usando la llave core 'tipo'
        listaClientesTurno.forEach(cliente => {
            let colorTag = '#3b82f6'; // Minorista /público base (Azul Oficial)
            let textoPerfilMostrar = cliente.tipo || 'MINORISTA';

            if (textoPerfilMostrar === 'DEUDOR') {
                colorTag = '#ef4444'; // Cuenta por Cobrar / Fiado (Rojo Alerta)
            } else if (textoPerfilMostrar === 'MAYORISTA') {
                colorTag = '#a855f7'; // Aliado Comercial B2B (Morado Neón)
            }

            tarjetasHTML += `
                <div style="background-color: #131921; border: 1px solid #232F3E; padding: 16px; border-radius: 8px; display: flex; flex-direction: column; gap: 8px; font-family: 'Inter', sans-serif; box-sizing: border-box;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
                        <div>
                            <h5 style="color: #FFFFFF; font-size: 14px; font-weight: 700; margin: 0; text-transform: capitalize; font-family: 'Inter', sans-serif;">${cliente.nombre || 'Nuevo Cliente'}</h5>
                            <span style="font-family: monospace; font-size: 11px; color: #94a3b8; font-weight: bold; display: block; margin-top: 2px;">${cliente.cedula || 'Sin ID'}</span>
                        </div>
                        <span style="background-color: ${colorTag}20; color: ${colorTag}; font-size: 9px; font-weight: 900; padding: 2px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px; border: 1px solid ${colorTag}30; font-family: monospace; white-space: nowrap;">
                            ${textoPerfilMostrar}
                        </span>
                    </div>
                    <div style="border-top: 1px solid #232F3E; padding-top: 8px; display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #64748b;">
                        <span>📞 ${cliente.telefono || 'Sin número'}</span>
                        <span style="font-size: 9px; font-family: monospace; color: #475569;">Turno Actual</span>
                    </div>
                </div>
            `;
        });

        // 3. Inyectamos la grilla limpia directamente en el contenedor del listado
        tablaContainer.innerHTML = `
            <h4 style="color: #cbd5e1; font-weight: 700; font-size: 13px; text-transform: uppercase; margin: 0 0 16px 0; font-family: 'Inter', sans-serif; letter-spacing: 0.05em;">
                Clientes de la Jornada (${listaClientesTurno.length})
            </h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; width: 100%; box-sizing: border-box;">
                ${tarjetasHTML}
            </div>
        `;
    } // 🎯 CORTADOS Y EXTIRPADOS LOS RESIDUOS DE DANIELA IA Y SECTION.APPENDCHILD DE ESTA ZONA
}; 

// Acoplamiento global unificado indestructible de Soto System
window.RegistroB2B = RegistroB2B;
export { RegistroB2B };





