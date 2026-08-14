// =========================================================================
// BLOQUE 0: CONTROL DE IMPORTACIONES Y CORE DE LA OFICINA MASTER (CLEAN)
// =========================================================================
// Encendemos de forma nativa la importación usándola en la línea 24 del render
import { Home } from './home.js';

const MiCuentaModulo = {
    state: {
        imagenPerfilBase64: "" 
    },

    // =========================================================================
    // BLOQUE 1: CONSTRUCTOR CORE Y MAQUETACIÓN VISUAL (ESTILO PASARELA DE PAGO)
    // =========================================================================
    render() {
        const section = document.createElement('section');
        section.id = "contenedor-mi-cuenta-modulo";
        section.className = "apio-mi-cuenta-wrapper";
        section.style.cssText = "display: flex; flex-direction: column; width: 100%; box-sizing: border-box; min-height: 100vh; background-color: #0d1117;";

        // === ENLACE CORRECTO: Usamos la referencia directa de ES6 para encender el bloque 0 ===
        if (typeof Home.renderMasterHeader === 'function') {
            section.appendChild(Home.renderMasterHeader());
        } else if (window.App && typeof window.App.renderMasterHeader === 'function') {
            section.appendChild(window.App.renderMasterHeader());
        }

        const nombreJefeSaaS = window.App && window.App.state && window.App.state.usuario ? window.App.state.usuario : "";

        // Contenedor principal de la Oficina (Estilo exacto a la pasarela con Glow Verde Neón)
        const oficinaPanel = document.createElement('div');
        // AJUSTE CYBERPUNK: Agregamos el aura envolvente verde esmeralda box-shadow a juego con tu barra izquierda
        oficinaPanel.style.cssText = "background-color: #0b0f19; padding: 32px 24px; border-radius: 12px; border: 1px solid #1e293b; border-left: 4px solid #10b981; max-width: 550px; width: 100%; box-shadow: 0 0 25px rgba(16, 185, 129, 0.3), 0 20px 40px rgba(0,0,0,0.7); font-family: 'Inter', sans-serif; margin: 40px auto; box-sizing: border-box; color: #ffffff;";

        const tieneAvatar = this.state.imagenPerfilBase64 !== "";
        const avatarVisualHtml = tieneAvatar 
            ? `<img src="${this.state.imagenPerfilBase64}" style="width: 100%; height: 100%; object-fit: cover; display: block;">`
            : `<span style="font-size: 24px; color: #10b981; font-weight: bold;">+</span>`;

        oficinaPanel.innerHTML = `
            <!-- Encabezado de la Sección Estilo Consola -->
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 25px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <span style="width: 24px; height: 24px; border-radius: 50%; background-color: #10b981; display: flex; align-items: center; justify-content: center; font-weight: 900; color: #FFFFFF; font-size: 13px; box-shadow: 0 0 10px rgba(16, 185, 129, 0.65);">M</span>
                    <h3 style="font-weight: 800; font-size: 18px; color: #FFFFFF; margin: 0; letter-spacing: -0.01em; text-transform: uppercase; font-family: monospace;">Ficha del Administrador Core</h3>
                </div>
                <span style="background: rgba(168, 85, 247, 0.15); color: #a855f7; border: 1px solid rgba(168, 85, 247, 0.3); padding: 4px 10px; border-radius: 4px; font-size: 10px; font-weight: 800; letter-spacing: 0.05em; font-family: monospace;">MODO CONFIGURACIÓN</span>
            </div>

            <!-- Ajuste del Círculo del Perfil Gamer Cyberpunk -->
            <div style="display: flex; flex-direction: column; align-items: center; margin-bottom: 30px; background-color: #030712; padding: 20px; border-radius: 8px; border: 1px solid #1e293b;">
                <input type="file" id="input-archivo-avatar-saas" accept="image/*" onchange="window.MiCuentaModulo.procesarCargaDeFoto(this)" style="display: none;">
                
                <div onclick="document.getElementById('input-archivo-avatar-saas').click()" style="width: 85px; height: 85px; border-radius: 50%; border: 3px solid #10b981; display: flex; align-items: center; justify-content: center; overflow: hidden; background: #000000; box-sizing: border-box; box-shadow: 0 0 20px rgba(16, 185, 129, 0.4); position: relative; cursor: pointer; transition: transform 0.2s;" onmouseenter="this.style.transform='scale(1.04)'" onmouseleave="this.style.transform='scale(1)'">
                    ${avatarVisualHtml}
                    <div style="position: absolute; bottom: 0; width: 100%; background: rgba(3, 7, 18, 0.8); text-align: center; font-size: 8px; padding: 2px 0; font-weight: 900; color: #10b981; letter-spacing: 0.05em; border-top: 1px solid rgba(16, 185, 129, 0.3);">CARGAR</div>
                </div>
                <span style="color: #64748b; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-top: 12px; letter-spacing: 0.05em;">Foto de Perfil del Sistema</span>
            </div>

            <!-- Campos Administrativos Estilo Pasarela (Letras Blancas en Bloque) -->
            <div style="background-color: #030712; padding: 20px; border-radius: 12px; border: 1px solid #1e293b; display: flex; flex-direction: column; gap: 20px; box-sizing: border-box;">
                
                <!-- Input 1: Nombre Master -->
                <div>
                    <h4 style="font-weight: 800; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; margin: 0 0 10px 0; border-bottom: 1px solid #1e293b; padding-bottom: 6px;">
                        Identificación del Operador Master
                    </h4>
                    <div style="background: #000000; border: 1px solid #1e293b; border-radius: 6px; padding: 12px; display: flex; align-items: center; justify-content: space-between;">
                        <span style="font-size: 13px; font-weight: 700; color: #ffffff; font-family: monospace;">Usuario:</span>
                        <input type="text" id="input-oficina-nombre" value="${nombreJefeSaaS}" placeholder="Falta Registrar en Login..." disabled style="background: transparent; border: none; color: #00D2FF; text-shadow: 0 0 10px rgba(0, 210, 255, 0.3); font-family: monospace; font-size: 15px; font-weight: bold; text-align: right; width: 220px; outline: none;">
                    </div>
                </div>

                <!-- Input 2: Password Master -->
                <div>
                    <h4 style="font-weight: 800; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; margin: 0 0 10px 0; border-bottom: 1px solid #1e293b; padding-bottom: 6px;">
                        Clave de Seguridad de la Empresa
                    </h4>
                    <div style="background: #000000; border: 1px solid #1e293b; border-radius: 6px; padding: 12px; display: flex; align-items: center; justify-content: space-between;">
                        <span style="font-size: 13px; font-weight: 700; color: #ffffff; font-family: monospace;">Password:</span>
                        <input type="password" id="input-oficina-password" placeholder="••••••••••••••••" disabled style="background: transparent; border: none; color: #a855f7; font-family: monospace; font-size: 15px; font-weight: bold; text-align: right; width: 220px; outline: none;">
                    </div>
                </div>

            </div>

            <!-- Botón Master Estilizado con Gradiente de Transición de Pasarela -->
            <div style="margin-top: 24px; padding-top: 16px; border-top: 1px dashed #1e293b;">
                <button onclick="window.MiCuentaModulo.guardarConfiguracionOficina()" type="button" style="width: 100%; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #FFFFFF; border: none; padding: 14px 20px; border-radius: 8px; font-size: 13px; font-weight: 800; text-transform: uppercase; cursor: pointer; transition: all 0.25s ease; font-family: 'Inter', sans-serif; letter-spacing: 0.05em; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);">
                    Inicializar Ecosistema del Negocio
                </button>
            </div>
        `;
        section.appendChild(oficinaPanel);

        // Inyección de Daniela IA Widget usando la referencia limpia de ES6
        if (typeof Home.renderDanielaWidget === 'function') {
            section.appendChild(Home.renderDanielaWidget());
        }
        if (typeof Home.renderFooter === 'function') {
            section.appendChild(Home.renderFooter()); 
        }

        return section;
    },

    // =========================================================================
// BLOQUE 2: PROCESADORES LÓGICOS Y ASISTENCIA INTERACTIVA EN CALIENTE
// =========================================================================
    procesarCargaDeFoto(inputElement) {
        const file = inputElement.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            this.state.imagenPerfilBase64 = e.target.result;
            console.log("📸 [Apio Oficina]: Foto de perfil en formato AVIF/Imagen guardada.");
            
            // Refresco local controlado: Pinta la foto al instante sin alterar el Header general
            const principalWrapper = document.getElementById('contenedor-mi-cuenta-modulo');
            if (principalWrapper && principalWrapper.parentNode) {
                const parent = principalWrapper.parentNode;
                parent.innerHTML = '';
                parent.appendChild(this.render());
            }
        };
        reader.readAsDataURL(file);
    },

    guardarConfiguracionOficina() {
        console.log("🔒 [Apio Core]: Sincronizando comandos master con el servidor...");
        alert("¡Ficha del Administrador guardada! Ecosistema inicializado para Daniela IA.");
    }
};

window.MiCuentaModulo = MiCuentaModulo;
export { MiCuentaModulo };
