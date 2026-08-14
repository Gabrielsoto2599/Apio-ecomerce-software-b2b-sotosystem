// =========================================================================
// BLOQUE 0: CONTROL DE IMPORTACIONES Y ENLAZADO AL ENTORNO GLOBAL
// =========================================================================
// Encendemos la importación usándola directamente en el método render de abajo
import { Home } from './home.js';

const TasaModulo = {
    state: {
        editandoTasa: false 
    },

    // =========================================================================
    // BLOQUE 1: CONSTRUCTOR CORE CON RETOQUES DE ALTA FIDELIDAD (PASARELA MATCH)
    // =========================================================================
    render() {
        const tasaActualSaaS = window.App && window.App.state && window.App.state.tasaDelDia > 0 
            ? window.App.state.tasaDelDia 
            : 0.00;

        if (window.App && window.App.state && (!window.App.state.tasaDelDia || window.App.state.tasaDelDia === 0)) {
            window.App.state.tasaDelDia = tasaActualSaaS;
        }

        const section = document.createElement('section');
        section.id = "contenedor-tasa-cambiaria-modulo";
        section.className = "apio-tasa-card-wrapper";
        section.style.cssText = "display: flex; flex-direction: column; width: 100%; box-sizing: border-box; min-height: 100vh; background-color: #0d1117;";

        // === ENLACE CORRECTO: Usamos la referencia directa de ES6 para encender la línea 4 ===
        if (typeof Home.renderMasterHeader === 'function') {
            section.appendChild(Home.renderMasterHeader());
        } else if (window.App && typeof window.App.renderMasterHeader === 'function') {
            section.appendChild(window.App.renderMasterHeader());
        }

        // Card Contenedor adaptado a la línea estética de la pasarela de pago y miCuenta
        const calculadoraCard = document.createElement('div');
        // AJUSTE DE ESTILO: Agregamos fondo #0b0f19, borde izquierdo naranja neón y el resplandor box-shadow
        calculadoraCard.style.cssText = "background-color: #0b0f19; padding: 35px 28px; border-radius: 12px; border: 1px solid #1e293b; border-left: 4px solid #ff9900; width: 100%; max-width: 440px; box-shadow: 0 0 22px rgba(255, 153, 0, 0.3), 0 20px 40px rgba(0,0,0,0.7); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 40px auto; box-sizing: border-box; color: #ffffff; position: relative; overflow: hidden; transition: all 0.3s ease;";
        
        const inputDisabledAttr = this.state.editandoTasa ? '' : 'disabled';
        
        const badgeBgColor = this.state.editandoTasa ? 'rgba(16, 185, 129, 0.15)' : 'rgba(168, 85, 247, 0.15)';
        const badgeTextColor = this.state.editandoTasa ? '#10b981' : '#a855f7';

        calculadoraCard.innerHTML = `
            <!-- Logotipo Centrado con Relleno Perfecto AVIF -->
            <div style="display: flex; flex-direction: column; align-items: center; margin-bottom: 30px;">
                <div style="width: 75px; height: 75px; border-radius: 50%; border: 3px solid #10b981; display: flex; align-items: center; justify-content: center; overflow: hidden; background: #000000; box-sizing: border-box; box-shadow: 0 0 15px rgba(16, 185, 129, 0.3);">
                    <img src="./assets/dolar.png" alt="Dólar Apio" style="width: 100% !important; height: 100% !important; object-fit: cover !important; display: block;" onerror="this.onerror=null; this.src='../assets/dolar.avif';">
                </div>
                <span style="font-weight: 800; font-size: 18px; letter-spacing: -0.3px; color: #ffffff; margin-top: 12px; text-transform: uppercase;">Apio Cambio</span>
            </div>

            <!-- Paso 1: Configuración de la Tasa Comercial (Estilo Pasarela Numerada) -->
            <div style="margin-bottom: 25px;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                    <div style="width: 24px; height: 24px; background: #a855f7; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 900; color: #ffffff; box-shadow: 0 0 8px rgba(168, 85, 247, 0.45);">1</div>
                    <h3 style="margin: 0; font-size: 14px; font-weight: 700; color: #ffffff; letter-spacing: 0.3px;">Ajuste del Monitor Diario</h3>
                </div>

                <div style="background: #000000; border: 1px solid #1e293b; border-radius: 6px; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between;">
                    <span style="font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase; font-family: monospace;">Valor Base</span>
                    <div style="display: flex; align-items: center; gap: 6px;">
                        <input type="number" id="input-tasa-dinamica" step="0.01" value="${tasaActualSaaS}" ${inputDisabledAttr} oninput="window.TasaModulo.actualizarTasaGlobal(this.value)" style="background: transparent; border: none; color: #10b981; font-family: monospace; font-size: 22px; font-weight: bold; text-align: right; width: 140px; outline: none;">
                        <span style="font-size: 13px; font-weight: 700; color: #64748b;">Bs</span>
                    </div>
                </div>
            </div>

            <!-- BOTONERA DE ACCIÓN: Estilo Degradado Neón de Pasarela -->
            <div style="display: flex; gap: 12px; margin-bottom: 30px;">
                <button onclick="window.TasaModulo.habilitarEdicion()" style="flex: 1; background: #111827; color: ${this.state.editandoTasa ? '#4b5563' : '#ffffff'}; border: 1px solid #1e293b; padding: 12px; border-radius: 6px; font-weight: 700; font-size: 12px; cursor: pointer; text-transform: uppercase; transition: all 0.2s;" ${this.state.editandoTasa ? 'disabled' : ''}>
                    Modificar
                </button>
                <button onclick="window.TasaModulo.fijarTasaGlobal()" style="flex: 1; background: ${this.state.editandoTasa ? 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)' : '#111827'}; color: ${this.state.editandoTasa ? '#ffffff' : '#4b5563'}; border: ${this.state.editandoTasa ? 'none' : '1px solid #1e293b'}; padding: 12px; border-radius: 6px; font-weight: 800; font-size: 12px; cursor: pointer; text-transform: uppercase; transition: all 0.2s; box-shadow: ${this.state.editandoTasa ? '0 0 15px rgba(168, 85, 247, 0.4)' : 'none'};" ${this.state.editandoTasa ? '' : 'disabled'}>
                    Fijar Precio
                </button>
            </div>

            <!-- Paso 2: Calculadora Interactiva de Escritorio -->
            <div style="margin-bottom: 20px;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                    <div style="width: 24px; height: 24px; background: #ff9900; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 900; color: #ffffff; box-shadow: 0 0 8px rgba(255, 153, 0, 0.45);">2</div>
                    <h3 style="margin: 0; font-size: 14px; font-weight: 700; color: #ffffff; letter-spacing: 0.3px;">Conversor de Caja Express</h3>
                </div>

                <div style="display: flex; flex-direction: column; gap: 12px;">
                    <div style="background: #000000; border: 1px solid #1e293b; border-radius: 6px; padding: 10px 16px; display: flex; align-items: center; justify-content: space-between;">
                        <span style="font-size: 14px; font-weight: bold; color: #ffffff; font-family: monospace;">$</span>
                        <div style="display: flex; align-items: center; gap: 6px;">
                            <input type="number" id="input-simulador-usd" value="1" oninput="window.TasaModulo.convertirA_Bs(this.value)" style="background: transparent; border: none; color: #ffffff; font-family: monospace; font-size: 20px; font-weight: 700; text-align: right; width: 140px; outline: none;">
                            <span style="font-size: 12px; font-weight: 600; color: #64748b;">USD</span>
                        </div>
                    </div>

                    <div style="background: #000000; border: 1px solid #1e293b; border-radius: 6px; padding: 10px 16px; display: flex; align-items: center; justify-content: space-between;">
                        <span style="font-size: 14px; font-weight: bold; color: #ffffff; font-family: monospace;">Bs</span>
                        <div style="display: flex; align-items: center; gap: 6px;">
                            <input type="number" id="input-simulador-ves" value="${tasaActualSaaS}" oninput="window.TasaModulo.convertirA_Usd(this.value)" style="background: transparent; border: none; color: #ffffff; font-family: monospace; font-size: 20px; font-weight: 700; text-align: right; width: 140px; outline: none;">
                            <span style="font-size: 12px; font-weight: 600; color: #64748b;">VES</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Indicador de fecha inferior -->
            <div style="text-align: center; margin-top: 25px; font-size: 11px; color: #475569; font-weight: 600;">
                📅 ÚLTIMA SINCRONIZACIÓN: 26/06/2026
            </div>
        `;
        section.appendChild(calculadoraCard);

        // Inyectamos el widget y el footer usando la referencia directa del objeto 'Home' importado
        if (typeof Home.renderDanielaWidget === 'function') {
            section.appendChild(Home.renderDanielaWidget());
        }
        if (typeof Home.renderFooter === 'function') {
            section.appendChild(Home.renderFooter()); 
        }

        return section;
    },

   // =========================================================================
// BLOQUE 2: PROCESADORES LÓGICOS Y CONEXIÓN REACTIVA
// =========================================================================
    actualizarTasaGlobal(nuevaTasa) {
        const valor = parseFloat(nuevaTasa) || 0;
        if (window.App && window.App.state) {
            window.App.state.tasaDelDia = valor;
        }
        const usdInput = document.getElementById('input-simulador-usd');
        if (usdInput) this.convertirA_Bs(usdInput.value);
    },

    convertirA_Bs(usd) {
        const cantidadUsd = parseFloat(usd) || 0;
        // CONEXIÓN CORE: El simulador lee estrictamente lo que se fija en caliente
        const tasaActual = window.App && window.App.state ? parseFloat(window.App.state.tasaDelDia) : 0.00;
        const vesInput = document.getElementById('input-simulador-ves');
        if (vesInput) {
            vesInput.value = (cantidadUsd * tasaActual).toFixed(2);
        }
    },

    convertirA_Usd(ves) {
        const cantidadVes = parseFloat(ves) || 0;
        const tasaActual = window.App && window.App.state ? parseFloat(window.App.state.tasaDelDia) : 0.00;
        const usdInput = document.getElementById('input-simulador-usd');
        if (usdInput) {
            usdInput.value = tasaActual > 0 ? (cantidadVes / tasaActual).toFixed(2) : 0;
        }
    },

    habilitarEdicion() {
        this.state.editandoTasa = true;
        this.forzarRefrescoDeModulo();
        setTimeout(() => {
            const inputTasa = document.getElementById('input-tasa-dinamica');
            if(inputTasa) inputTasa.focus();
        }, 50);
    },

    fijarTasaGlobal() {
        this.state.editandoTasa = false;
        this.forzarRefrescoDeModulo();
        console.log(`🔒 [Apio Core]: Tasa fijada con éxito.`);
    },

    forzarRefrescoDeModulo() {
        const principalContainer = document.getElementById('contenedor-tasa-cambiaria-modulo');
        if (principalContainer && principalContainer.parentNode) {
            const parent = principalContainer.parentNode;
            parent.innerHTML = '';
            parent.appendChild(this.render());
        }
    }
};

window.TasaModulo = TasaModulo;
export { TasaModulo };

