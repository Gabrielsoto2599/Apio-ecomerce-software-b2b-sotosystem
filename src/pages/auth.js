// =========================================================================
// BLOQUE 0: CONTROL DE IMPORTACIONES Y ESTADO DE ACCESO MASTER (AUTH NATIVO - REPARADO)
// Build: 2026 Contable - Soto System ERP Dual SaaS - MVP MANUAL PERSISTENTE
// =========================================================================
import { Home } from './home.js';

// 📡 ANTENA DE RED EN DISPARO DIRECTO CORREGIDA AL VACÍO
const URL_API_SAAS = 'http://127.0.0.1:8000';

const AuthModulo = {
    state: {
        formularioActivo: 'login', // 'login' o 'registro' para conmutar las vistas
        
        // 📸 AVATAR PERSISTENTE: Intenta jalar la foto en Base64 guardada en el disco de Windows
        imagenPerfilBase64: localStorage.getItem('APIO_AUTH_AVATAR_CAJERO') || "",     
        
        // 🏢 COMPAÑÍA PERSISTENTE: Consume la libreta máster del disco rígido
        configNegocio: JSON.parse(localStorage.getItem('APIO_CONFIG_EMPRESA_MASTER')) || {
            nombreComercial: '',
            rif: '',
            ciudad: '',
            estado: ''
        },
        
        // 👤 SESIÓN ACTIVA: Almacena quién está cobrando en este turno en la bodega
        usuarioActivo: JSON.parse(localStorage.getItem('APIO_AUTH_SESION_ACTIVA')) || null
    },

    // 🔄 MÉTODO DE REFRESCO DE INTERFAZ EN CALIENTE (SIN VARIABLES FANTASMA)
    forzarRefrescoDeModalLocal() {
        const oldModal = document.getElementById('apio-auth-modal-screen');
        if (oldModal && oldModal.parentNode) {
            const parent = oldModal.parentNode;
            parent.replaceChild(this.render(), oldModal);
        }
    },

    // Conmuta las pestañas del modal (Login / Registro) de forma limpia
    conmutarFormulario(tipo) {
        this.state.formularioActivo = tipo;
        this.forzarRefrescoDeModalLocal();
    },

        // =========================================================================
    // 🧱 BLOQUE 1 (PARTE A): CONSTRUCTOR, CAPA DE CRISTAL Y LOGIN TRADICIONAL
    // =========================================================================
    render() {
        if (typeof Home !== 'undefined' && false) { console.log(Home); }

        const modalOverlay = document.createElement('div');
        modalOverlay.id = "apio-auth-modal-screen";
        modalOverlay.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(3, 7, 18, 0.75); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: center; z-index: 9999; font-family: 'Inter', sans-serif; box-sizing: border-box; padding: 20px;";

        const modalBody = document.createElement('div');
        modalBody.style.cssText = "background: #ffffff; width: 100%; max-width: 780px; min-height: 460px; border-radius: 16px; overflow: hidden; display: flex; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7); border: 1px solid rgba(255,255,255,0.05); transition: all 0.25s ease;";

        const esLogin = this.state.formularioActivo === 'login';
        let formularioDinamicoHtml = "";

        if (esLogin) {
            formularioDinamicoHtml = `
                <!-- 🔐 PESTAÑA A: ACCESO TRADICIONAL OPERACIONAL -->
                <h2 style="font-weight: 900; font-size: 24px; color: #0f172a; margin: 0 0 4px 0; text-transform: uppercase; letter-spacing: -0.02em;">Acceso B2B</h2>
                <p style="color: #64748b; font-size: 12px; margin: 0 0 24px 0; font-weight: 500;">Ingrese sus credenciales de terminal autorizadas.</p>

                <div style="display: flex; flex-direction: column; gap: 14px; width: 100%;">
                    <input type="text" id="auth-username-field" placeholder="Usuario / Alias" value="gabriel" style="width: 100%; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; color: #0f172a; font-size: 13px; outline: none; box-sizing: border-box; font-weight: 600;">
                    <input type="password" id="auth-password-field" placeholder="Clave de Seguridad" value="123456" style="width: 100%; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; color: #0f172a; font-size: 13px; outline: none; box-sizing: border-box; font-family: monospace;">
                    
                    <select id="auth-role-select" style="width: 100%; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 11px 12px; color: #0f172a; font-size: 13px; font-weight: 700; outline: none; box-sizing: border-box; cursor: pointer;">
                        <option value="Administrador">👑 Administrador Central</option>
                        <option value="Cajero">💼 Cajero Operador</option>
                    </select>

                    <button onclick="window.AuthModulo.ejecutarLoginMaster()" style="width: 100%; background: #000000; color: #ffffff; border: none; padding: 14px; border-radius: 8px; font-size: 13px; font-weight: 800; text-transform: uppercase; cursor: pointer; margin-top: 10px; transition: all 0.2s; letter-spacing: 0.05em;">
                        Entrar al Sistema
                    </button>
                </div>

                <p style="margin: 24px 0 0 0; font-size: 11px; color: #64748b; font-weight: 600; text-align: center;">
                    ¿Nuevo distribuidor? <span onclick="window.AuthModulo.conmutarFormulario('registro')" style="color: #ff9900; cursor: pointer; font-weight: 800; text-decoration: underline;">Regístrate aquí</span>
                </p>
            `;
        }

                else {
            formularioDinamicoHtml = `
                <!-- 🏢 PESTAÑA B: CONFIGURACIÓN INTEGRAL DE EMPRESA (LOCAL FRONTEND) -->
                <h2 style="font-weight: 900; font-size: 22px; color: #0f172a; margin: 0 0 2px 0; text-transform: uppercase; letter-spacing: -0.02em;">Crear Administrador</h2>
                <p style="color: #64748b; font-size: 11px; margin: 0 0 16px 0; font-weight: 500;">Configure el perfil del operador y las credenciales fiscales de la sucursal.</p>

                <div style="display: flex; justify-content: center; margin-bottom: 12px;">
                    <div onclick="document.getElementById('auth-foto-file-input').click()" style="width: 65px; height: 65px; border-radius: 50%; border: 2px dashed #00cc66; background: #f8fafc; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; position: relative; overflow: hidden;">
                        ${this.state.imagenPerfilBase64 ? 
                            `<img src="${this.state.imagenPerfilBase64}" style="width: 100%; height: 100%; object-fit: cover;">` : 
                            `<span style="font-size: 18px; color: #00cc66; font-weight: bold;">+</span><span style="font-size: 8px; color: #64748b; font-weight: 700; text-transform: uppercase;">Foto</span>`
                        }
                    </div>
                    <input type="file" id="auth-foto-file-input" onchange="window.AuthModulo.procesarFotoRegistro(this)" accept="image/*" style="display: none;">
                </div>

                <div style="display: flex; flex-direction: column; gap: 8px; width: 100%;">
                    <div style="display: flex; gap: 8px;">
                        <input type="text" id="reg-admin-name" placeholder="Nombre del Administrador" style="flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 14px; color: #0f172a; font-size: 12px; outline: none; box-sizing: border-box; font-weight: 600;">
                        <input type="text" id="reg-username" placeholder="Usuario / Alias" style="flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 14px; color: #0f172a; font-size: 12px; outline: none; box-sizing: border-box; font-weight: 600;">
                    </div>
                    
                    <input type="password" id="reg-password" placeholder="Asignar Clave Master" style="width: 100%; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 14px; color: #0f172a; font-size: 12px; outline: none; box-sizing: border-box; font-family: monospace;">

                    <div style="border-top: 1px dashed #e2e8f0; margin: 4px 0; padding-top: 4px;">
                        <span style="font-size: 10px; color: #64748b; font-weight: 800; text-transform: uppercase; display: block; margin-bottom: 6px;">Credenciales de la Empresa</span>
                    </div>

                    <div style="display: flex; gap: 8px;">
                        <input type="text" id="reg-empresa-nombre" placeholder="Nombre Comercial / Abasto" value="Abasto el Colombiano" style="flex: 1.2; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 12px; color: #0f172a; font-size: 12px; font-weight: 600; outline: none; box-sizing: border-box;">
                        <input type="text" id="reg-empresa-rif" placeholder="RIF Fiscal" value="J-12345678-0" style="flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 12px; color: #0f172a; font-size: 12px; font-weight: 600; outline: none; box-sizing: border-box;">
                    </div>

                    <div style="display: flex; gap: 8px;">
                        <input type="text" id="reg-empresa-telefono" placeholder="Número de Teléfono" value="0412-1234567" style="flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 12px; color: #0f172a; font-size: 12px; font-weight: 600; outline: none; box-sizing: border-box;">
                        <input type="text" id="reg-empresa-pais" placeholder="País" value="Venezuela" style="flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 12px; color: #0f172a; font-size: 12px; font-weight: 600; outline: none; box-sizing: border-box;">
                    </div>

                    <div style="display: flex; gap: 8px;">
                        <input type="text" id="reg-empresa-ciudad" placeholder="Ciudad" value="Barquisimeto" style="flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 12px; color: #0f172a; font-size: 12px; font-weight: 600; outline: none; box-sizing: border-box;">
                        <input type="text" id="reg-empresa-estado" placeholder="Estado" value="Lara" style="flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 12px; color: #0f172a; font-size: 12px; font-weight: 600; outline: none; box-sizing: border-box;">
                    </div>

                    <button onclick="window.AuthModulo.ejecutarRegistroSaaS()" style="width: 100%; background: #ff9900; color: #ffffff; border: none; padding: 12px; border-radius: 8px; font-size: 12px; font-weight: 800; text-transform: uppercase; cursor: pointer; margin-top: 4px; transition: all 0.2s; letter-spacing: 0.05em;">
                        Registrar Cuenta y Configurar Negocio
                    </button>
                </div>

                <p style="margin: 14px 0 0 0; font-size: 11px; color: #64748b; font-weight: 600; text-align: center;">
                    ¿Ya posee credenciales? <span onclick="window.AuthModulo.conmutarFormulario('login')" style="color: #000000; cursor: pointer; font-weight: 800; text-decoration: underline;">Inicie sesión aquí</span>
                </p>
            `;
        }

        modalBody.innerHTML = `
            <!-- COLUMNA IZQUIERDA: Bloque de Marca (Look Negro Puro de Apio) -->
            <div style="flex: 1; background-color: #0d1117; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; box-sizing: border-box; border-right: 1px solid #1e293b; position: relative;">
                <div style="text-align: center; line-height: 1;">
                    <h1 style="font-weight: 900; font-size: 3.2rem; font-style: italic; color: #FFFFFF; margin: 0; letter-spacing: -0.03em;">APIO</h1>
                    <span style="font-weight: 700; font-size: 0.75rem; color: #FFD700; text-transform: uppercase; letter-spacing: 0.08em; margin-top: -2px; display: block;">e-commerce Software</span>
                </div>
                <span style="position: absolute; bottom: 20px; font-size: 10px; color: #475569; font-weight: bold; font-family: monospace; letter-spacing: 0.05em; text-transform: uppercase;">Módulo de Seguridad SaaS</span>
            </div>

            <div style="flex: 1.2; background: #ffffff; padding: 30px 35px; display: flex; flex-direction: column; justify-content: center; box-sizing: border-box; position: relative;">
                ${formularioDinamicoHtml}
            </div>
        `;

        modalOverlay.appendChild(modalBody);
        return modalOverlay;
    },
    
            // =========================================================================
    // 🚀 BLOQUE 2: PROCESADORES LOGICOS Y SIMULACIÓN SAAS (CONTINGENCIA 100%)
    // =========================================================================

    // Procesa la foto de perfil en Base64 de forma síncrona
    procesarFotoRegistro(inputElement) {
        const file = inputElement.files;
        if (!file || file.length === 0) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            this.state.imagenPerfilBase64 = e.target.result;
            if (window.MiCuentaModulo && window.MiCuentaModulo.state) {
                window.MiCuentaModulo.state.imagenPerfilBase64 = e.target.result;
            }
            console.log("📸 [Apio Auth]: Foto capturada y enlazada de forma síncrona.");
            this.forzarRefrescoDeModalLocal();
        };
        reader.readAsDataURL(file[0]);
    },

    // 🚀 EL MOTOR DEL BOTÓN NARANJA: Autónomo, veloz y sin trabas de red
    ejecutarRegistroSaaS() {
        const adminName = document.getElementById('reg-admin-name')?.value.trim();
        const username = document.getElementById('reg-username')?.value.trim();
        const password = document.getElementById('reg-password')?.value.trim();
        
        const empresaNombre = document.getElementById('reg-empresa-nombre')?.value.trim();
        const empresaRif = document.getElementById('reg-empresa-rif')?.value.trim();
        const empresaCiudad = document.getElementById('reg-empresa-ciudad')?.value.trim();
        const empresaEstado = document.getElementById('reg-empresa-estado')?.value.trim();

        if (!adminName || !username || !password || !empresaNombre || !empresaRif) {
            alert("⚠️ Validación SaaS: Nombre, Usuario, Clave, Empresa y RIF son obligatorios.");
            return;
        }

        // 💾 PLAN DE CONTINGENCIA: Guardamos en LocalStorage para autonomía total del ERP
        const infoConfig = {
            nombre_comercial: empresaNombre,
            rif: empresaRif,
            ciudad: empresaCiudad,
            estado: empresaEstado,
            admin_operador: adminName
        };
        localStorage.setItem('APIO_SAAS_CONFIG', JSON.stringify(infoConfig));
        
        console.log("🏢 [SOTO CONTINGENCIA]: Credenciales fiscales sembradas en LocalStorage con éxito:", infoConfig);
        alert(`¡Felicidades Gabriel!\nLa empresa "${empresaNombre}" ha sido configurada localmente de forma exitosa.\nProceda a iniciar sesión.`);
        
        // Regresamos al login limpios
        this.state.formularioActivo = 'login';
        this.forzarRefrescoDeModalLocal();
    },

    // 👑 MOTOR DEL BOTÓN NEGRO: Acceso directo al mostrador
    ejecutarLoginMaster() {
        const userVal = document.getElementById('auth-username-field')?.value.trim();
        const passVal = document.getElementById('auth-password-field')?.value.trim();
        const roleVal = document.getElementById('auth-role-select')?.value;

        if (!userVal || !passVal) {
            alert("⚠️ Error de Acceso: Introduzca su usuario y clave operacional.");
            return;
        }

        // Recuperamos los datos dinámicos guardados en el registro (o usamos contingencia por defecto)
        const saasLocal = JSON.parse(localStorage.getItem('APIO_SAAS_CONFIG')) || {
            nombre_comercial: "Abasto el Colombiano",
            rif: "J-12345678-0",
            ciudad: "Barquisimeto",
            estado: "Lara",
            admin_operador: "Gabriel"
        };

        // Disparamos la carga segura al núcleo global pasándole el cargamento fiscal
        if (window.App && typeof window.App.ejecutarLoginSaaS === 'function') {
            window.App.ejecutarLoginSaaS(userVal, passVal, roleVal, saasLocal);
            
            const modalScreen = document.getElementById('apio-auth-modal-screen');
            if (modalScreen) modalScreen.remove();
        } else {
            console.error("🔒 [Apio Core Error]: No se encontró ejecutarLoginSaaS en App.js");
            // Desbloqueo de emergencia para no trabar al cajero
            const modalScreen = document.getElementById('apio-auth-modal-screen');
            if (modalScreen) modalScreen.remove();
        }
    }
};

// Vinculamos al entorno global window para la SPA
window.AuthModulo = AuthModulo;
export { AuthModulo };


