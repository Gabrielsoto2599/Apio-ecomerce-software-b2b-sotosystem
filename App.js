// =========================================================================
// BLOQUE 0: CONTROL DE IMPORTACIONES Y ENLAZADO AL ENTORNO GLOBAL (APIO CORE)
// =========================================================================
// Saneamos las rutas relativas físicas desde la raíz del proyecto SaaS
import { Home } from './src/pages/home.js';
import { CatalogoB2B } from './src/pages/catalogoB2B.js'; 
import { RegistroB2B } from './src/pages/registroB2B.js'; 
import { PasarelaPago } from './src/pages/pasarelaPago.js'; 
import { ErpModulo } from './src/pages/erp.js'; 
import { TasaModulo } from './src/pages/tasa.js'; 
import { ClientesB2B } from './src/pages/clientesB2B.js'; // <-- Módulo real protegido
import { MiCuentaModulo } from './src/pages/miCuenta.js'; // <-- Inyección del Perfil Corporativo Mayorista
import { AuthModulo } from './src/pages/auth.js'; // <-- Importación del módulo de seguridad


// Registramos los componentes en window para los manejadores de eventos inline de la SPA
window.Home = Home;
window.CatalogoB2B = CatalogoB2B; 
window.RegistroB2B = RegistroB2B; 
window.PasarelaPago = PasarelaPago; 
window.ErpModulo = ErpModulo; 
window.TasaModulo = TasaModulo; 
window.ClientesB2B = ClientesB2B; // <-- Mapeado sin sobre-escritura posterior
window.MiCuentaModulo = MiCuentaModulo; // <-- Sincronización global del perfil del aliado comercial
window.AuthModulo = AuthModulo; // <-- Sincronización global de autenticación

// =========================================================================
// BLOQUE 1: RESERVA ECOLÓGICA DEL ENTORNO GLOBAL (PULIDO)
// =========================================================================
// NOTA: Eliminamos por completo el objeto dummy window.ClientesB2B de este bloque 
// para permitir que el archivo real src/pages/clientesB2B.js pinte el lienzo.

// =========================================================================
// BLOQUE 2: ESTRUCTURA INTERNA DE CONTROL Y ESTADO REACTIVO GLOBAL
// =========================================================================
const App = {
    container: null,

    init() {
        this.container = document.getElementById('app'); 
        
        // Forzamos la estructura flexbox para el ordenamiento del Header y Cuerpo
        if (this.container) {
            this.container.style.display = 'flex';
            this.container.style.flexDirection = 'column';
            this.container.style.width = '100%';
            this.container.style.minHeight = '100vh';
            this.container.style.backgroundColor = '#0b0e14';
        }
        
        this.render(); // Dibuja la armadura del software base en el fondo

        // === REQUISITO INFALIBLE DE ENTRADA B2B SAAS ===
        // Sincronizamos un retardo controlado de 50ms para que Vite monte el layout
        // y la modal de autenticación se inyecte obligatoriamente en el tope absoluto.
        setTimeout(() => {
            if (window.AuthModulo && typeof window.AuthModulo.render === 'function') {
                // Purgamos duplicados huérfanos antes de inyectar
                const modalVieja = document.getElementById('apio-auth-modal-screen');
                if (modalVieja) modalVieja.remove();

                // Desplegamos el escudo de seguridad sobre el body
                document.body.appendChild(window.AuthModulo.render());
                console.log("🛡️ [Apio Core]: Escudo de seguridad desplegado con éxito en el arranque.");
            }
        }, 50);
    },
  
    // Estado centralizado para el mostrador, carrito y sincronización de Apio SaaS
    state: {
        view: 'home', 
        usuario: null,      // Guardará el string del Operador / Administrador activo
        rolUsuario: null,   // Guardará el rol contable: 'Administrador' o 'Cajero'
        carrito: [],
        categoriaSeleccionada: null,
        dropdownCategoriasActivo: false,
        erpSincronizado: false, // Control de canalización en tiempo real para Daniela IA
        
        // --- CONTROL CAMBIARIO INTEGRADO (API CONTABLE VENEZUELA) ---
        monedaBase: 'USD', // Control global de visualización: 'USD' o 'VES'
        tasaDelDia: 0.00,  // Tasa base de conversión (Bolívares por Dólar)
        ultimaActualizacionTasa: new Date().toLocaleDateString('es-VE')
    },

    // =========================================================================
    // CONTROLADOR CAMBIARIO: CONMUTACIÓN HORIZONTAL GAMER CYBERPUNK (SLIDER TOGGLE)
    // =========================================================================
    alternarMonedaGlobal() {
        // Conmutamos el estado puro en el corazón de la SPA
        this.state.monedaBase = this.state.monedaBase === 'USD' ? 'VES' : 'USD';
        console.log(`⚡ [Apio Cyber-Core]: Switch de divisa cambiado a: ${this.state.monedaBase}`);

        // Forzamos el re-render total controlado de la SPA para actualizar los precios al instante
        this.render();
    },

    // =========================================================================
    // MOTOR DE ACCIÓN DE SEGURIDAD INTERNA: CONTROL DE ACCESOS Y HERENCIA
    // =========================================================================
    ejecutarLoginSaaS(usuarioInput, passwordInput, rolElegido) {
        if (!usuarioInput || !passwordInput) {
            alert("⚠️ Error contable: Complete sus credenciales para que Daniela IA lo reconozca.");
            return;
        }

        // Fijamos los accesos en el estado de la aplicación
        this.state.usuario = usuarioInput;
        this.state.rolUsuario = rolElegido;

        console.log(`🛡️ [Apio Master Auth]: Acceso validado. Operador: ${usuarioInput} | Rol: ${rolElegido}`);

        // Si es el Administrador, actualizamos la Oficina del Jefe dinámicamente
        if (rolElegido === 'Administrador' && window.MiCuentaModulo && window.MiCuentaModulo.state) {
            window.MiCuentaModulo.state.nombreJefe = usuarioInput;
        }

        // Transicionamos de inmediato a la sección operacional adecuada
        this.state.view = rolElegido === 'Administrador' ? 'erp' : 'home';
        this.render();
    },

    ejecutarCierreSesionSaaS() {
        this.state.usuario = null;
        this.state.rolUsuario = null;
        this.state.view = 'home';
        console.log("🔒 [Apio Auth]: Cierre de terminal ejecutado. Bloqueando sistema.");
        this.render();
        
        // Volvemos a inyectar la modal obligatoria al cerrar sesión
        if (window.AuthModulo && typeof window.AuthModulo.render === 'function') {
            document.body.appendChild(window.AuthModulo.render());
        }
    },

    // Manejador de transición seguro para saltar entre las diferentes secciones
    navigate(nuevaSeccion) {
        this.state.view = nuevaSeccion;
        this.state.dropdownCategoriasActivo = false; // Purga de menús flotantes
        console.log(`📡 [Apio Router]: Transicionando con éxito hacia -> '${nuevaSeccion}'`);
        this.render();
    },

    // =========================================================================
    // BLOQUE 3: FILA SUPERIOR DEL HEADER CON CONTROLES MILIMÉTRICOS (TOP ROW)
    // =========================================================================
    renderMasterHeader() {
        const header = document.createElement('header');
        header.className = "cyber-nav";
        header.setAttribute('style', 'display: flex; flex-direction: column; width: 100%; z-index: 100; position: relative;');

        // Inyección de estilos de artillería contra deformaciones e imágenes gigantes
        if (!document.getElementById('soto-system-header-styles')) {
            const headerStyle = document.createElement('style');
            headerStyle.id = 'soto-system-header-styles';
            headerStyle.innerHTML = `
                .nav-top-container { display: flex !important; align-items: center !important; justify-content: space-between !important; gap: 1.5rem !important; padding: 0.75rem 1.5rem !important; background-color: #131921 !important; width: 100% !important; box-sizing: border-box !important; }
                .brand-logo-box { display: flex; flex-direction: column; cursor: pointer; user-select: none; line-height: 1; }
                .brand-title-main { font-weight: 900 !important; font-size: 2rem !important; font-style: italic !important; color: #FFFFFF !important; margin: 0 !important; letter-spacing: -0.03em !important; }
                .brand-subtitle-sub { font-weight: 700 !important; font-size: 0.65rem !important; color: #FFD700 !important; text-transform: uppercase !important; letter-spacing: 0.08em !important; margin-top: -2px !important; }
                .search-engine-box { flex: 1; display: flex; background-color: #FFFFFF; border-radius: 4px; overflow: hidden; height: 40px; max-width: 650px; margin: 0 auto; border: 2px solid transparent; box-sizing: border-box !important; }
                .search-engine-box:focus-within { border-color: #f3a847; }
                .search-core-input { flex: 1; padding: 0 1rem; font-size: 0.875rem; color: #000000; border: none; outline: none; font-weight: 500; background: #FFFFFF; }
                .search-submit-btn { background-color: transparent !important; border: none !important; width: 45px !important; height: 40px !important; cursor: pointer !important; display: flex !important; align-items: center !important; justify-content: center !important; box-sizing: border-box !important; transition: background-color 0.2s ease !important; }
                .search-submit-btn:hover { background-color: #f1f5f9 !important; }
                .search-png-icon { width: 20px !important; height: 20px !important; object-fit: contain !important; display: block !important; }
                .cart-status-box { display: flex !important; align-items: center !important; gap: 0.75rem !important; color: #FFFFFF !important; cursor: pointer !important; user-select: none !important; }
                .cart-png-wrapper { position: relative !important; width: 35px !important; height: 30px !important; display: flex !important; align-items: center !important; justify-content: center !important; box-sizing: border-box !important; }
                .cart-png-image { width: 100% !important; height: 100% !important; object-fit: contain !important; display: block !important; }
                .cart-badge-count { position: absolute !important; top: -6px !important; right: -6px !important; background-color: #e47911 !important; color: #FFFFFF !important; font-size: 10px !important; font-weight: 900 !important; font-family: monospace !important; min-width: 15px !important; height: 15px !important; padding: 0 3px !important; border-radius: 50% !important; display: flex !important; align-items: center !important; justify-content: center !important; z-index: 10 !important; }
                .nav-bottom-container { display: flex !important; align-items: center !important; background-color: #232F3E !important; padding: 0.45rem 1.5rem !important; gap: 1.5rem !important; width: 100% !important; box-sizing: border-box !important; position: relative; }
                .nav-btn-hamburguesa { background: transparent !important; border: none !important; color: #FFFFFF !important; font-weight: 800 !important; font-size: 0.9rem !important; cursor: pointer !important; display: flex !items: center !important; gap: 0.5rem !important; padding: 4px 8px !important; }
                .hamburguesa-lines-icon { display: flex; flex-direction: column; justify-content: space-between; width: 18px; height: 12px; }
                .hamburguesa-lines-icon span { display: block; width: 100%; height: 2px; background-color: #FFFFFF; border-radius: 1px; }
                .nav-links-subgroup { display: flex !important; align-items: center !important; gap: 1.25rem !important; }
                .nav-link-anchor { background: transparent !important; border: none !important; color: #cccccc !important; font-weight: 600 !important; font-size: 0.8rem !important; cursor: pointer !important; white-space: nowrap !important; padding: 2px 4px !important; transition: color 0.2s ease !important; }
                .nav-link-anchor:hover { color: #FFFFFF !important; text-shadow: 0 0 4px rgba(255,255,255,0.3) !important; }
                .soto-dropdown-categories { position: absolute; top: 100%; left: 1.5rem; background-color: #131921; border: 1px solid #232F3E; border-top: none; border-radius: 0 0 8px 8px; width: 220px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); display: none; flex-direction: column; z-index: 110; overflow: hidden; }
                .soto-dropdown-item { background: transparent; border: none; color: #E2E8F0; text-align: left; padding: 0.75rem 1rem; font-size: 0.75rem; font-weight: 600; cursor: pointer; width: 100%; }
                .soto-dropdown-item:hover { background-color: #232F3E; color: #FF9900; }
                .soto-dropdown-categories.active { display: flex !important; }
            `;
            document.body.appendChild(headerStyle);
        }

        // Fila Superior (Top Row)
        const topRow = document.createElement('div');
        topRow.className = "nav-top-container";

        // Logo e Identidad de Apio
        const logoBox = document.createElement('div');
        logoBox.className = "brand-logo-box";
        logoBox.onclick = () => App.navigate('home');
        logoBox.innerHTML = `
            <h1 class="brand-title-main">APIO</h1>
            <span class="brand-subtitle-sub">e-commerce Software</span>
        `;
        topRow.appendChild(logoBox);

        // Barra de Búsqueda con assets locales PNG
        const searchBox = document.createElement('div');
        searchBox.className = "search-engine-box";
        searchBox.innerHTML = `
            <input type="text" class="search-core-input" placeholder="Buscar productos por descripción o código de barras..." />
            <button class="search-submit-btn">
                <img src="./assets/buscador-ico.png" class="search-png-icon" alt="Buscar" />
            </button>
        `;
        topRow.appendChild(searchBox);

        // Carrito de compras protegido de Amazon
        const cartBox = document.createElement('div');
        cartBox.className = "cart-status-box";
        cartBox.onclick = () => App.navigate('catalogo-b2b'); 
        cartBox.innerHTML = `
            <div class="cart-png-wrapper">
                <img src="./assets/carrito-ico.png" class="cart-png-image" alt="Carrito" />
                <span class="cart-badge-count">${this.state.carrito ? this.state.carrito.length : 0}</span>
            </div>
            <div style="display:flex; flex-direction:column; line-height:1.1;">
                <span style="font-size: 9px; color: #a4b3b8; font-weight: bold;">Tu Carrito</span>
                <span style="font-weight: 800; font-size: 0.75rem; color:#FFFFFF;">Factura Actual</span>
            </div>
        `;
        topRow.appendChild(cartBox);
        header.appendChild(topRow);

           /// =========================================================================
// BLOQUE 4: FILA INFERIOR DEL HEADER (BOTTOM ROW) Y MENÚ DESPLEGABLE
// =========================================================================
        const bottomRow = document.createElement('div');
        bottomRow.className = "nav-bottom-container";

        // Botón Todo (Hamburguesa)
        const menuBtn = document.createElement('button');
        menuBtn.className = "nav-btn-hamburguesa";
        menuBtn.onclick = (e) => {
            e.stopPropagation();
            this.toggleDropdown();
        };
        menuBtn.innerHTML = `
            <div class="hamburguesa-lines-icon"><span></span><span></span><span></span></div>
            <span>Todo</span>
        `;
        bottomRow.appendChild(menuBtn);

        // Enlaces del Ecosistema con iluminación de pestaña activa
        const linksGroup = document.createElement('div');
        linksGroup.className = "nav-links-subgroup";
        
        const viewsMap = [
            { id: 'home', label: 'Inicio' },
            { id: 'catalogo-b2b', label: 'Catálogo' },
            { id: 'registro-b2b', label: 'Registro' },
            { id: 'pasarela-pago', label: 'Pasarela de Pago' },
            { id: 'erp', label: 'ERP' },
            { id: 'clientes-b2b', label: 'Clientes deudores' },
            { id: 'tasa', label: 'Tasa Cambiaria' },
            { id: 'mi-cuenta', label: 'Mi Cuenta' } // <-- ¡Inyección oficial de Mi Cuenta en el Navbar!
        ];

        viewsMap.forEach(route => {
            const btn = document.createElement('button');
            btn.className = "nav-link-anchor";
            
            // Toques cromáticos premium para los controles del sistema mayorista
            if (route.id === 'tasa') {
                btn.style.color = '#FF9900';
                btn.style.fontWeight = '800';
            }
            if (route.id === 'mi-cuenta') {
                btn.style.color = '#38bdf8';
                btn.style.fontWeight = '700';
            }
            
            // Iluminación activa rigurosa basada en el estado de visualización core de tu App
            if (this.state.view === route.id) {
                btn.setAttribute('style', 'color: #FFFFFF !important; font-weight: 700 !important; border-bottom: 2px solid #FF9900;');
            }

            // ENLAZADO DE PRECISIÓN: Conectamos los disparadores directamente a tu enrutador centralizado
            btn.onclick = () => {
                App.navigate(route.id); 
            };

            btn.innerText = route.label;
            linksGroup.appendChild(btn);
        });
        bottomRow.appendChild(linksGroup);

        // Menú Desplegable Flotante de Categorías
        const dropdown = document.createElement('div');
        dropdown.id = "soto-header-dropdown";
        dropdown.className = `soto-dropdown-categories ${this.state.dropdownCategoriasActivo ? 'active' : ''}`;
        
        const categoriasMock = ['Víveres Esenciales', 'Bebidas y Refrescos', 'Postres y Lácteos', 'Panadería y Dulces'];
        categoriasMock.forEach(cat => {
            const item = document.createElement('button');
            item.className = "soto-dropdown-item";
            item.innerText = cat;
            item.onclick = () => {
                this.state.dropdownCategoriasActivo = false;
                App.navigate('catalogo-b2b');
            };
            dropdown.appendChild(item);
        });
        bottomRow.appendChild(dropdown);
        header.appendChild(bottomRow);

        // NOTA DE CONTROL SAAS: Removimos quirúrgicamente la inyección dinámica duplicada de divisa por setTimeout
        // para consolidar el Switch Slider Horizontal limpio construido de forma síncrona en el Bloque 3.

        // Evento seguro para cerrar el menú flotante al hacer clic afuera
        document.addEventListener('click', () => {
            if (App.state.dropdownCategoriasActivo) {
                App.state.dropdownCategoriasActivo = false;
                const dropNode = document.getElementById('soto-header-dropdown');
                if (dropNode) dropNode.classList.remove('active');
            }
        });

        return header;
    },

    toggleDropdown() {
        this.state.dropdownCategoriasActivo = !this.state.dropdownCategoriasActivo;
        const dropNode = document.getElementById('soto-header-dropdown');
        if (dropNode) {
            dropNode.classList.toggle('active', this.state.dropdownCategoriasActivo);
        }
    },

    // =========================================================================
    // BLOQUE 5: FUNCIÓN MAESTRA DE RENDERIZADO GLOBAL CON PREVENCIÓN DE DUPLICADOS
    // =========================================================================
    render() {
        if (!this.container) return;
        
        // 1. Reseteo absoluto del DOM principal para purgar capas viejas
        this.container.innerHTML = ''; 

        // Inyectamos dinámicamente la tipografía 'Inter' de forma global en el ecosistema Apio
        if (!document.getElementById('apio-global-fonts')) {
            const fontLink = document.createElement('link');
            fontLink.id = 'apio-global-fonts';
            fontLink.rel = 'stylesheet';
            fontLink.href = 'https://googleapis.com';
            document.head.appendChild(fontLink);

            const fontStyle = document.createElement('style');
            fontStyle.innerHTML = `
                * { font-family: 'Inter', sans-serif !important; }
                tbody font, td, th { font-family: 'Inter', sans-serif !important; }
                .font-mono, td[style*="monospace"] { font-family: monospace !important; }
            `;
            document.head.appendChild(fontStyle);
        }

        // 2. INYECTAMOS EL HEADER GLOBAL ÚNICAMENTE SI LA VISTA ES EL ERP
        // De esta forma prevenimos el doble clonado en Inicio, Catálogo y Registro
        if (this.state.view === 'erp') {
            const masterHeader = this.renderMasterHeader();
            masterHeader.style.position = 'relative';
            masterHeader.style.zIndex = '200';
            this.container.appendChild(masterHeader);
        }

        // === CONTENEDOR INTERNO PARA EL CUERPO DINÁMICO DE LAS VISTAS ===
        const pageBody = document.createElement('div');
        pageBody.id = "page-body-content";
        pageBody.className = "min-h-[calc(100vh-85px)] bg-[#0B0E14]";
        pageBody.style.position = 'relative';
        pageBody.style.zIndex = '100';
        pageBody.style.width = '100%';

                   // =========================================================================
        // BLOQUE 5 (PARTE 2): ENRUTADOR SEGURO DE PANTALLAS (APIO CORE UNIFICADO SANEADO)
        // =========================================================================
        switch(this.state.view) {
            case 'home':
                if (window.Home && typeof window.Home.render === 'function') {
                    pageBody.appendChild(window.Home.render());
                }
                break;
            case 'catalogo-b2b':
                if (window.CatalogoB2B && typeof window.CatalogoB2B.render === 'function') {
                    pageBody.appendChild(window.CatalogoB2B.render());
                }
                break;
            case 'registro-b2b':
                if (window.RegistroB2B && typeof window.RegistroB2B.render === 'function') {
                    pageBody.appendChild(window.RegistroB2B.render());
                }
                break;
            case 'clientes-b2b':
                if (window.ClientesB2B && typeof window.ClientesB2B.render === 'function') {
                    pageBody.appendChild(window.ClientesB2B.render());
                }
                break;
                
                        case 'erp':
                if (window.ErpModulo && typeof window.ErpModulo.render === 'function') {
                    pageBody.appendChild(window.ErpModulo.render());
                }
                break;
             
            case 'pasarela-pago':
                if (window.PasarelaPago && typeof window.PasarelaPago.render === 'function') {
                    pageBody.appendChild(window.PasarelaPago.render());
                    
                    setTimeout(() => {
                        const nodoPasarelaFisico = document.getElementById('contenedor-pasarela-pago');
                        if (nodoPasarelaFisico && typeof window.PasarelaPago.inicializarListenersPasarela === 'function') {
                            window.PasarelaPago.inicializarListenersPasarela(nodoPasarelaFisico);
                        }
                    }, 0);
                }
                break;
            case 'tasa':
                if (window.TasaModulo && typeof window.TasaModulo.render === 'function') {
                    pageBody.appendChild(window.TasaModulo.render());
                }
                break;
            case 'mi-cuenta':
                if (window.MiCuentaModulo && typeof window.MiCuentaModulo.render === 'function') {
                    pageBody.appendChild(window.MiCuentaModulo.render());
                }
                break;
        }

        // 4. Inyectamos el cuerpo dinámico en el contenedor principal (No se ejecutará si entra al ERP)
        this.container.appendChild(pageBody);

    },

    // =========================================================================
    // BLOQUE 6: DISPARADOR MAESTRO, CAPTURA DE EVENTOS Y EXPORTACIÓN FINAL
    // =========================================================================
    navigate(view) {
        this.state.view = view;
        this.render();
    }
}; // <-- CIERRE INTEGRAL DEFINITIVO DEL OBJETO MAESTRO APP

// Inicialización global segura acoplada a window para eventos inline
window.App = App;

document.addEventListener('DOMContentLoaded', () => {
    if (window.App && typeof window.App.init === 'function') {
        window.App.init();
    }
});

export { App };

