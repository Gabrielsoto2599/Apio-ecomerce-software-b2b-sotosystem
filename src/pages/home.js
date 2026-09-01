import * as QRCode from 'qrcode'; // 🚀 LA SINTAXIS UNIVERSAL PARA VANILLA JS / VITE
// 🚀 INYECCIÓN MAESTRA: Importamos la configuración global de red al arranque
// 🚀 REPARACIÓN DE RUTA: Subimos un nivel en las carpetas usando dos puntos (../)

// src/pages/home.js - Estructura de Producción de Soto System VE Optimizado
const Home = {
    currentSlide: 0,
    carouselInterval: null,
    danielaConectada: false
};

// =========================================================================
// 1. MÉTOPDO DE RENDERIZADO PRINCIPAL (CORE UNIFICADO Y CORREGIDO)
// =========================================================================
Home.render = function() {
    const section = document.createElement('section');
    section.className = "home-container flex flex-col min-h-screen bg-[#0B0E14] overflow-x-hidden";

    // INYECCIÓN DE ESTILOS AL FINAL PARA CORREGIR LA DEFORMACIÓN DE TAILWIND Y BORDES BLANCOS
    if (!document.getElementById('soto-system-master-styles')) {
        const style = document.createElement('style');
        style.id = 'soto-system-master-styles';
        style.innerHTML = `
            /* Reset definitivo contra los bordes blancos intrusivos del navegador */
            html, body {
                margin: 0 !important;
                padding: 0 !important;
                background-color: #0B0E14 !important; /* Evita destellos blancos en la raíz */
                width: 100% !important;
                overflow-x: hidden !important;
            }

            /* Core de Respaldo contra deformaciones generales */
            .home-container { 
                background-color: #0B0E14 !important; 
                min-height: 100vh !important; 
                width: 100vw !important; /* Estira la sección de extremo a extremo */
                color: #FFFFFF !important; 
                font-family: 'Inter', sans-serif !important; 
                box-sizing: border-box !important;
                margin: 0 !important;
                padding: 0 !important;
            }
            .carousel-outer-wrapper { position: relative; width: 100%; height: 260px; z-index: 20; background-color: #090b0f; overflow: hidden; }
            @media (min-width: 768px) { .carousel-outer-wrapper { height: 340px; } }

            /* Grid Forzado de 4 Columnas (Evita que las tarjetas tomen el ancho completo de la pantalla) */
            .categories-amazon-grid-fallback {
                display: grid !important;
                grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
                gap: 1.5rem !important;
                width: 100% !important;
                box-sizing: border-box !important;
                padding: 24px !important; /* Separación interna elegante respecto al monitor */
                background-color: #0B0E14 !important;
            }
            @media (min-width: 640px) { .categories-amazon-grid-fallback { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; } }
            @media (min-width: 1024px) { .categories-amazon-grid-fallback { grid-template-columns: repeat(4, minmax(0, 1fr)) !important; } }

            /* Estilo Tarjeta Flotante Premium Solicitado */
            .amazon-card-fallback {
                background-color: #FFFFFF !important;
                color: #000000 !important;
                border-radius: 12px !important;
                padding: 1.25rem !important;
                display: flex !important;
                flex-direction: column !important;
                justify-content: space-between !important;
                min-height: 360px !important;
                box-shadow: 0 10px 25px -5px rgba(0,0,0,0.15) !important;
                transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s ease !important;
                cursor: pointer !important;
                border: 1px solid #e2e8f0 !important;
                box-sizing: border-box !important;
            }
            
            /* Efecto de mouse encima: Flota y genera sombreado azul */
            .amazon-card-fallback:hover {
                transform: translateY(-8px) !important;
                border-color: #2563EB !important;
                box-shadow: 0 20px 30px -5px rgba(37, 99, 235, 0.25), 
                            0 10px 15px -3px rgba(37, 99, 235, 0.15) !important;
            }
        `;
        // Inyectado al final del body para aplastar cualquier propiedad externa
        document.body.appendChild(style);
    }

    try {
        // Ensamblaje modular con validaciones estrictas de tipo Nodo
        if (typeof this.renderMasterHeader === 'function') {
            section.appendChild(this.renderMasterHeader());
        }
        
        // Contenedor seguro para el carrusel
        if (typeof this.renderCarousel === 'function') {
            const carouselBox = document.createElement('div');
            carouselBox.className = "carousel-outer-wrapper";
            
            const carouselContent = this.renderCarousel();
            if (carouselContent instanceof HTMLElement) {
                carouselBox.appendChild(carouselContent); 
                section.appendChild(carouselBox);
            } else {
                console.error("Soto System Error: 'renderCarousel' no retornó un HTMLElement válido.");
            }
        }
        
        // Inyección controlada de los bloques inferiores
        const safeAppend = (methodName) => {
            if (typeof this[methodName] === 'function') {
                const element = this[methodName]();
                if (element instanceof HTMLElement) {
                    section.appendChild(element);
                } else {
                    console.error(`Soto System Error: '${methodName}' debe retornar un HTMLElement.`);
                }
            }
        };

        safeAppend('renderDashboardBody'); 
        safeAppend('renderBrandsCarousel');
        safeAppend('renderFooter');
        safeAppend('renderDanielaWidget');

    } catch (error) {
        console.error("Critical rendering error in Soto System Home:", error);
        section.innerHTML = `<div class="p-6 text-red-500 text-center">Error en carga de Dashboard B2B. Revisa la consola.</div>`;
    }
    
    return section;
};


// =========================================================================
// HEADER MAESTRO CON INTEGRACIÓN DE ICONOS PNG Y BLINDAJE ANTI-COLAPSO
// =========================================================================
Home.renderMasterHeader = function() {
    const header = document.createElement('header');
    header.className = "cyber-nav";
    header.setAttribute('style', 'display: flex; flex-direction: column; width: 100%; z-index: 100; position: relative;');

    // INYECCIÓN DE ESTILOS DE ARTILLERÍA: Encoge los PNG gigantes de forma obligatoria
    if (!document.getElementById('soto-system-header-styles')) {
        const headerStyle = document.createElement('style');
        headerStyle.id = 'soto-system-header-styles';
        headerStyle.innerHTML = `
            /* Fila 1: Top Row */
            .nav-top-container {
                display: flex !important;
                align-items: center !important;
                justify-content: space-between !important;
                gap: 1.5rem !important;
                padding: 0.75rem 1.5rem !important;
                background-color: #131921 !important;
                width: 100% !important;
                box-sizing: border-box !important;
            }
            .brand-logo-box { display: flex; flex-direction: column; cursor: pointer; user-select: none; line-height: 1; }
            .brand-title-main { font-weight: 900 !important; font-size: 2rem !important; font-style: italic !important; color: #FFFFFF !important; margin: 0 !important; letter-spacing: -0.03em !important; }
            .brand-subtitle-sub { font-weight: 700 !important; font-size: 0.65rem !important; color: #FFD700 !important; text-transform: uppercase !important; letter-spacing: 0.08em !important; margin-top: -2px !important; }
            
                        /* Buscador Profesional */
            .search-engine-box { flex: 1; display: flex; background-color: #FFFFFF; border-radius: 4px; overflow: hidden; height: 40px; max-w: 650px; margin: 0 auto; border: 2px solid transparent; box-sizing: border-box !important; }
            .search-engine-box:focus-within { border-color: #f3a847; }
            .search-core-input { flex: 1; padding: 0 1rem; font-size: 0.875rem; color: #000000; border: none; outline: none; font-weight: 500; }
            
            /* Botón de la Lupa: Fondo transparente y acople limpio */
            .search-submit-btn { 
                background-color: transparent !important; /* Cuadro amarillo eliminado */
                border: none !important; 
                width: 45px !important; 
                height: 40px !important;
                cursor: pointer !important; 
                display: flex !important; 
                align-items: center !important; 
                justify-content: center !important;
                box-sizing: border-box !important;
                transition: background-color 0.2s ease !important;
            }
            .search-submit-btn:hover {
                background-color: #f1f5f9 !important; /* Micro-interacción limpia sobre el blanco */
            }
            .search-png-icon { 
                width: 20px !important; 
                height: 20px !important; 
                object-fit: contain !important; 
                display: block !important;
            }

            /* Contenedor del Carrito: Fuerza el tamaño rígido de la caja del PNG */
            .cart-status-box { display: flex !important; align-items: center !important; gap: 0.75rem !important; color: #FFFFFF !important; cursor: pointer !important; user-select: none !important; }
            
            .cart-png-wrapper {
                position: relative !important;
                width: 35px !important;   /* ANCHO MILIMÉTRICO RIGIDO */
                height: 30px !important;  /* ALTO MILIMÉTRICO RIGIDO */
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                box-sizing: border-box !important;
            }
            
            /* Somete a la imagen gigante del carrito para que se adapte a los 35px */
            .cart-png-image {
                width: 100% !important;
                height: 100% !important;
                object-fit: contain !important; /* Lo encoge proporcionalmente sin estirarlo */
                display: block !important;
            }
            
            /* Burbuja flotante del contador */
            .cart-badge-count {
                position: absolute !important;
                top: -6px !important;
                right: -6px !important;
                background-color: #e47911 !important;
                color: #FFFFFF !important;
                font-size: 10px !important;
                font-weight: 900 !important;
                font-family: monospace !important;
                min-width: 15px !important;
                height: 15px !important;
                padding: 0 3px !important;
                border-radius: 50% !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                z-index: 10 !important;
            }

            /* Fila 2: Bottom Row Enlaces */
            .nav-bottom-container { display: flex !important; align-items: center !important; background-color: #232F3E !important; padding: 0.45rem 1.5rem !important; gap: 1.5rem !important; width: 100% !important; box-sizing: border-box !important; position: relative; }
            .nav-btn-hamburguesa { background: transparent !important; border: none !important; color: #FFFFFF !important; font-weight: 800 !important; font-size: 0.9rem !important; cursor: pointer !important; display: flex !important; align-items: center !important; gap: 0.5rem !important; padding: 4px 8px !important; }
            .hamburguesa-lines-icon { display: flex; flex-direction: column; justify-content: space-between; width: 18px; height: 12px; }
            .hamburguesa-lines-icon span { display: block; width: 100%; height: 2px; background-color: #FFFFFF; border-radius: 1px; }
            .nav-links-subgroup { display: flex !important; align-items: center !important; gap: 1.25rem !important; }
            .nav-link-anchor { background: transparent !important; border: none !important; color: #cccccc !important; font-weight: 600 !important; font-size: 0.8rem !important; cursor: pointer !important; white-space: nowrap !important; padding: 2px 4px !important; transition: color 0.2s ease !important; }
            .nav-link-anchor:hover { color: #FFFFFF !important; text-shadow: 0 0 4px rgba(255,255,255,0.3) !important; }

            /* Dropdown Categorías */
            .soto-dropdown-categories { position: absolute; top: 100%; left: 1.5rem; background-color: #131921; border: 1px solid #232F3E; border-top: none; border-radius: 0 0 8px 8px; width: 220px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); display: none; flex-direction: column; z-index: 110; overflow: hidden; }
            .soto-dropdown-item { background: transparent; border: none; color: #E2E8F0; text-align: left; padding: 0.75rem 1rem; font-size: 0.75rem; font-weight: 600; cursor: pointer; width: 100%; }
            .soto-dropdown-item:hover { background-color: #232F3E; color: #FF9900; }
            .soto-dropdown-categories.active { display: flex !important; }
        `;
        document.body.appendChild(headerStyle);
    }

       // Estructuración del HTML (ACTUALIZADO CON MONITOR DE DIVISA, TASA Y NUEVOS BOTONES)
    // Extraemos las variables cambiarias desde el estado core del orquestador global de la app
    const tasaActual = (window.App && window.App.state) ? window.App.state.tasaDelDia : 0.00;
    const monedaActiva = (window.App && window.App.state) ? window.App.state.monedaBase : 'USD';
    const totalCarrito = (window.App && window.App.state && window.App.state.carrito) ? window.App.state.carrito.length : 0;

    header.innerHTML = `
        <!-- FILA SUPERIOR: Logo Corporativo Estilo Valery, Buscador con PNG y Carrito Protegido -->
        <div class="nav-top-container">
            <div id="nav-logo" class="brand-logo-box">
                <h1 class="brand-title-main">APIO</h1>
                <span class="brand-subtitle-sub">e-commerce Software</span>
            </div>
            
            <div class="search-engine-box">
                <input type="text" placeholder="Buscar productos por descripción o código de barras..." class="search-core-input">
                <button class="search-submit-btn">
                    <!-- Icono PNG del Buscador Sincronizado de assets -->
                    <img src="./assets/buscador-ico.png" alt="Buscar" class="search-png-icon">
                </button>
            </div>
    
            <div class="cart-status-box" id="btn-open-cart">
                <!-- Marco del Carrito con su burbuja flotante independiente anti-deformación -->
                <div class="cart-png-wrapper">
                    <img src="./assets/carrito-ico.png" alt="Carrito" class="cart-png-image">
                    <!-- Recibe dinámicamente las cargas del estado global de Apio -->
                    <span class="cart-badge-count" id="nav-cart-counter">${totalCarrito}</span>
                </div>
                <div style="display: flex; flex-direction: column; line-height: 1.1;">
                    <span style="font-size: 9px; color: #a4b3b8; font-weight: bold;">Tu Carrito</span>
                    <span style="font-weight: 800; font-size: 0.75rem;">Factura Actual</span>
                </div>
            </div>
        </div>
        
        <!-- FILA INFERIOR: Botón Todo con 3 líneas CSS + Enlaces de Texto Plano + Dropdown Flotante -->
        <div class="nav-bottom-container">
            <button class="nav-btn-hamburguesa" id="btn-master-todo">
                <div class="hamburguesa-lines-icon">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <span>Todo</span>
            </button>
        
            <!-- Menú Desplegable Flotante de Categorías -->
            <div class="soto-dropdown-categories" id="dropdown-categories">
                <button data-cat="cat-viveres" class="soto-dropdown-item">Víveres Esenciales</button>
                <button data-cat="cat-bebidas" class="soto-dropdown-item">Bebidas y Refrescos</button>
                <button data-cat="cat-postres" class="soto-dropdown-item">Postres y Lácteos</button>
                <button data-cat="cat-panaderia" class="soto-dropdown-item">Panadería y Dulces</button>
            </div>
            
                        <nav class="nav-links-subgroup" id="cyber-menu-links">
                <!-- Saneamos las rutas a minúsculas exactas para el switch de vistas -->
                <button data-view="home" class="nav-link-anchor">home</button>
                <button data-view="catalogo-b2b" class="nav-link-anchor">Catálogo</button>
                <button data-view="registro-b2b" class="nav-link-anchor">Registro</button>
                <button data-view="pasarela-pago" class="nav-link-anchor">Pasarela de Pago</button>
                <button data-view="erp" class="nav-link-anchor" style="color: #a855f7; font-weight: 700;">ERP</button>
                <button data-view="clientes-b2b" class="nav-link-anchor">Clientes deudores</button>
                <button data-view="tasa" class="nav-link-anchor" style="color: #FF9900; font-weight: 800;">Tasa Cambiaria</button>
                <!-- INYECCIÓN OFICIAL DE LA OFICINA EN EL HOME -->
                <button data-view="mi-cuenta" class="nav-link-anchor" style="color: #38bdf8; font-weight: 700;">Mi Cuenta</button>
            </nav>
        </div>
    `;


       // =========================================================================
    // 📡 ENRUTAMIENTOS Y EVENTOS SANEADOS - BARRA SUPERIOR (BUILD 2026)
    // =========================================================================
    const logoBox = header.querySelector('#nav-logo');
    if (logoBox) {
        logoBox.addEventListener('click', () => {
            if (window.App && typeof window.App.navigate === 'function') window.App.navigate('home');
        });
    }

    // 🚀 LOS LINKS DEL MENÚ CYBER: Navegan de forma fluida entre vistas
    header.querySelectorAll('#cyber-menu-links .nav-link-anchor').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const view = e.currentTarget.getAttribute('data-view');
            if (view && window.App && typeof window.App.navigate === 'function') window.App.navigate(view);
        });
    });

    // CONTROLLER DEL MENÚ DESPLEGABLE "TODO"
    const btnTodo = header.querySelector('#btn-master-todo');
    const dropdown = header.querySelector('#dropdown-categories');
    if (btnTodo && dropdown) {
        btnTodo.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('active');
        });
        document.addEventListener('click', () => dropdown.classList.remove('active'));
    }

    // REDIRECCIÓN INTERACTIVA POR CATEGORÍAS (Muerde el catálogo al filtrar)
    if (dropdown) {
        dropdown.querySelectorAll('.soto-dropdown-categories .soto-dropdown-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const catId = e.currentTarget.getAttribute('data-cat');
                if (catId && window.App) {
                    if (!window.App.state) window.App.state = {};
                    window.App.state.categoriaSeleccionada = catId;
                    if (typeof window.App.navigate === 'function') window.App.navigate('catalogo-b2b');
                }
            });
        });
    }

          // =========================================================================
    // 🧠 MOTOR DE BÚSQUEDA INDUSTRIAL ADAPTADO PARA INSTALABLE .EXE (PERFECTO)
    // Ubicación: Dentro del componente inyectable del Buscador en home.js
    // =========================================================================
    const inputCore = header.querySelector('.search-core-input');
    let temporizadorBusqueda; // Variable de control para pausar ráfagas de teclas

    if (inputCore) {
        // 🎯 CORE REPAIR: La persistencia de texto se ejecuta dentro de la validación física del nodo
        if (window.App?.state?.ultimoTerminoBuscado) {
            inputCore.value = window.App.state.ultimoTerminoBuscado;
        }

        inputCore.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                return;
            }

            let termino = event.target.value; // Conservamos el texto crudo con espacios para edición

            // Limpiamos el temporizador anterior con cada nueva tecla pulsada
            clearTimeout(temporizadorBusqueda);

            // 🎯 BYPASS ULTRA-RÁPIDO SOTO SYSTEM: Muerde las tarjetas directamente en el monitor
            const terminoLimpio = termino.toLowerCase().trim();
            
            // Seleccionamos las cajas blancas de tus productos usando los contenedores flexibles visibles
            const tarjetasProductos = document.querySelectorAll('.apio-erp-wrapper div, [style*="background-color: white"], [style*="background-color: #ffffff"], .producto-card');

            if (tarjetasProductos.length > 0 && terminoLimpio.length > 0) {
                console.log(`📡 [SOTO ENGINE]: Buscando texto en ${tarjetasProductos.length} tarjetas del catálogo...`);
                tarjetasProductos.forEach(tarjeta => {
                    // Evitamos ocultar elementos máster que no sean tarjetas de productos
                    if (tarjeta.innerText && (tarjeta.innerText.includes("HARINA") || tarjeta.innerText.includes("$") || tarjeta.innerText.includes("PAS"))) {
                        const textoTarjeta = tarjeta.innerText.toLowerCase();
                        
                        // Si la tarjeta contiene el texto de la cajera (ej: "pan"), se queda; si no, se esconde al instante
                        if (textoTarjeta.includes(terminoLimpio)) {
                            tarjeta.style.display = "";
                        } else {
                            tarjeta.style.display = "none";
                        }
                    }
                });
            }

            // 🎯 RESTAURACIÓN INMEDIATA AL BORRAR EL CAMPO
            if (termino.trim().length === 0) {
                console.log("🔄 [SOTO SYSTEM]: Buscador vacío. Restaurando el catálogo completo...");
                if (tarjetasProductos.length > 0) {
                    tarjetasProductos.forEach(tarjeta => {
                        tarjeta.style.display = "";
                    });
                }
                if (window.App && window.App.state) {
                    window.App.state.ultimoTerminoBuscado = "";
                    window.App.state.productosFiltrados = window.App.state.productosOriginales || window.App.state.productosVivos || [];
                }
                return;
            }

            // ⏱️ PARCHE DE DEBOUNCE SANEADO: Consulta a Django sin romper el layout visual
            temporizadorBusqueda = setTimeout(() => {
                // 🎯 REPARACIÓN DE ENDPOINT MÁSTER: Apunta milimétricamente a la ruta real de tu views.py plano
                let urlApi = `https://apio-ecomerce-software-b2b-sotosystem-production.up.railway.app/api/v1/buscador-productos-api/`;
                
                console.log(`📡 [Buscador Apio POS]: Consultando backend local -> ${urlApi}`);

                window.fetch(urlApi)
                    .then(response => {
                        if (!response.ok) throw new Error("Rebote de ruta en el servidor de Django");
                        return response.json();
                    })
                    .then(data => {
                        if (window.App && window.App.state) {
                            // Extraemos el cargamento plano de forma elástica sin importar la estructura
                            const loteProductos = Array.isArray(data) ? data : (data.productos || []);

                            console.log(`✨ [SOTO POS BACKEND SUCCESS]: Elementos validados de Railway -> ${loteProductos.length}`);

                            // 🎯 DOBLE IMPACTO SIMÉTRICO DE MEMORIA: Forzamos la asignación limpia en ambas variables de la RAM
                            window.App.state.productosFiltrados = loteProductos;
                            window.App.state.productosVivos = loteProductos; 
                            window.App.state.ultimoTerminoBuscado = termino; 

                            // 🖨️ RE-RENDERIZADO SELECTIVO DE CONTENEDOR (NUNCA VOLVEMOS A DESTRUIR LA VISTA ENTERA)
                            // Le avisamos directamente al catálogo que vuelva a pintar los elementos sobre el DOM existente
                            if (typeof window.recalcularGrillaCatalogoB2BEnCaliente === 'function') {
                                window.recalcularGrillaCatalogoB2BEnCaliente(loteProductos);
                            } else if (typeof window.App.renderViewOnly === 'function') {
                                window.App.renderViewOnly('catalogo-b2b');
                            }

                            // 3. Devolvemos el foco al buscador de forma síncrona inmediata para escritura ultra-suave
                            const inputRecargado = document.querySelector('.search-core-input');
                            if (inputRecargado) {
                                inputRecargado.focus();
                                inputRecargado.setSelectionRange(termino.length, termino.length);
                            }
                        }
                    })
                    .catch(error => console.error("❌ Error de comunicación en Apio Engine:", error.message));
            }, 350); // 350 milisegundos óptimos de tolerancia de escritura

        });
    }

    return header;
};

// =========================================================================
// 4. CARRUSEL PUBLICITARIO DE ANUNCIOS B2B (PARTE 1: ARQUITECTURA Y ESTILOS)
// =========================================================================
Home.currentSlide = 0;
Home.carouselInterval = null;

Home.renderCarousel = function() {
    const carouselContainer = document.createElement('div');
    carouselContainer.id = "soto-master-carousel";
    carouselContainer.className = "w-full h-full relative group overflow-hidden select-none";
    
    // CONTROL DE DUPLICIDAD: Inyección de estilos limpios de alto rendimiento en el HEAD
    if (!document.getElementById('soto-carousel-amazon-styles')) {
        const cStyle = document.createElement('style');
        cStyle.id = 'soto-carousel-amazon-styles';
        cStyle.innerHTML = `
            /* Contenedor del anuncio dividido en dos bloques (Texto/Imagen) */
            .amazon-slide-layout {
                position: absolute;
                inset: 0;
                display: flex !important;
                align-items: center !important;
                justify-content: space-between !important;
                padding: 0 5rem !important;
                transition: opacity 0.6s ease-in-out !important;
                box-sizing: border-box !important;
            }
            
            /* Ajuste responsivo para pantallas pequeñas */
            @media (max-width: 768px) {
                .amazon-slide-layout { padding: 0 2rem !important; }
                .amazon-slide-image-box { flex: 0 0 45% !important; }
                .amazon-slide-text-box h3 { font-size: 1.85rem !important; }
            }
            
            /* Bloque de Texto publicitario izquierdo */
            .amazon-slide-text-box {
                flex: 0 0 45% !important;
                display: flex !important;
                flex-direction: column !important;
                justify-content: center !important;
                z-index: 30 !important;
            }
            
            /* Contenedor Gráfico derecho adaptativo */
            .amazon-slide-image-box {
                flex: 0 0 50% !important;
                height: 100% !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                position: relative !important;
                z-index: 20 !important;
            }
            .amazon-slide-image-box img {
                max-height: 85% !important;
                max-width: 100% !important;
                object-fit: contain !important; /* Mantiene la proporción perfecta sin deformar */
                filter: drop-shadow(0 15px 25px rgba(0,0,0,0.7)) !important; /* Profundidad tridimensional */
            }

            /* Flechas de navegación delgadas y sutiles */
            .amazon-arrow-btn {
                position: absolute !important;
                top: 50% !important;
                transform: translateY(-50%) !important;
                background: transparent !important;
                border: none !important;
                color: #FFFFFF !important;
                font-size: 3rem !important;
                font-family: monospace !important;
                cursor: pointer !important;
                opacity: 0;
                transition: opacity 0.3s, color 0.2s !important;
                z-index: 40 !important;
                padding: 0 20px !important;
            }
            .group:hover .amazon-arrow-btn { opacity: 0.4; }
            .amazon-arrow-btn:hover { opacity: 1 !important; color: #ff9900 !important; }
        `;
        document.head.appendChild(cStyle);
    }
    // Datos estructurados con la fórmula de Amazon y tus 3 colores corporativos fijos
    const anuncios = [
        {
            titulo: "Víveres de Alta Calidad",
            sub: "Precios como barriguita de Morrocoy",
            desc: "Abastecimiento masivo directo para tu negocio. Carga inmediata de inventario al mayor con los márgenes de ganancia más competitivos del mercado.",
            imgUrl: "./assets/bodegon-abastecido.jpg",
            target: "catalogo-b2b",
            // Azul Oscuro de Respaldo Contable
            bgStyle: "linear-gradient(90deg, #101b2b 0%, #0a111c 45%, #0B0E14 100%)" 
        },
        //{
            //titulo: "Inteligencia Artificial Operativa",
            //sub: "Daniela IA: Tu Gerente Personal",
            //desc: "Automatización inteligente integrada para el control exhaustivo de stock, auditorías en tiempo real y predicción analítica de compras.",
            //imgUrl: "./assets/daniela.png",
            //target: "home",
            // Morado Cyberpunk para Daniela IA
            //bgStyle: "linear-gradient(90deg, #2c123d 0%, #1a0a24 45%, #0B0E14 100%)" 
        //},
        {
            titulo: "Multimétodo de Pago",
            sub: "Contamos con Biopago, Pago Móvil y Punto de Venta",
            desc: "Pasarela de cobro express optimizada. Seguridad transaccional de alta velocidad integrada de punta a punta con el ecosistema Apio.",
            imgUrl: "./assets/biopago-cliente.jpg",
            target: "pasarela-pago",
            // Verde Esmeralda/Biopago BDV
            bgStyle: "linear-gradient(90deg, #09241b 0%, #05140f 45%, #0B0E14 100%)" 
        }
    ];

    let slidesHTML = '';
    anuncios.forEach((ad, index) => {
        slidesHTML += `
            <div class="amazon-slide-layout" style="background: ${ad.bgStyle}; opacity: ${index === 0 ? '1' : '0'}; z-index: ${index === 0 ? '10' : '0'}; cursor: pointer;" data-slide-index="${index}" data-target-view="${ad.target}">
                
                <!-- Máscara de fusión inferior transparente hacia el fondo del Dashboard -->
                <div style="position: absolute; left:0; right:0; bottom:0; height: 70px; background: linear-gradient(to top, #0B0E14 15%, transparent); z-index: 25;"></div>

                <!-- LADO IZQUIERDO: Bloque tipográfico comercial de alto impacto -->
                <div class="amazon-slide-text-box">
                    <span style="color: #FFD700; font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px;">
                        ${ad.sub}
                    </span>
                    <h3 style="font-size: 2.6rem; font-weight: 900; color: #FFFFFF; line-height: 1.15; margin: 0 0 10px 0; letter-spacing: -0.02em;">
                        ${ad.titulo}
                    </h3>
                    <p style="font-size: 13px; color: #94a3b8; font-weight: 500; line-height: 1.4; margin: 0; max-w: 480px;">
                        ${ad.desc}
                    </p>
                </div>
                
                <!-- LADO DERECHO: Imagen con tratamiento contain y sombreado flotante -->
                <div class="amazon-slide-image-box">
                    <img src="${ad.imgUrl}" alt="${ad.titulo}">
                </div>

            </div>
        `;
    });

    // Inyección de las flechas minimalistas
    carouselContainer.innerHTML = `
        <div class="w-full h-full relative" id="slides-wrapper">${slidesHTML}</div>
        <button id="prev-slide-btn" class="amazon-arrow-btn" style="left: 15px;">‹</button>
        <button id="next-slide-btn" class="amazon-arrow-btn" style="right: 15px;">›</button>
    `;
    // --- MANEJO DE EVENTOS SEGUROS EN EL CARRUSEL ---
    
    // 1. Evento para retroceder un anuncio manualmente
    carouselContainer.querySelector('#prev-slide-btn').addEventListener('click', (e) => {
        e.stopPropagation(); // Evita conflictos con el clic general de la tarjeta
        this.moveCarousel(-1, carouselContainer);
    });
    
    // 2. Evento para avanzar un anuncio manualmente
    carouselContainer.querySelector('#next-slide-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        this.moveCarousel(1, carouselContainer);
    });

    // 3. Clic Global Inteligente: Toda la valla publicitaria redirige a su sección B2B
    carouselContainer.querySelectorAll('.amazon-slide-layout').forEach(slide => {
        slide.addEventListener('click', (e) => {
            const view = slide.getAttribute('data-target-view');
            if (view && window.App && typeof window.App.navigate === 'function') {
                // Frenamos el autoplay de inmediato para que no intente saltar de fondo en otra vista
                if (this.carouselInterval) clearInterval(this.carouselInterval); 
                window.App.navigate(view);
            }
        });
    });

    // 4. Arrancar el temporizador automatizado pasando la referencia del nodo local
    this.startCarouselAutoPlay(carouselContainer);

    return carouselContainer;
};

// =========================================================================
// MÉTODOS DE CONTROL ARQUITECTÓNICO Y TRANSICIÓN SEDOSA
// =========================================================================
Home.moveCarousel = function(direction, container) {
    const currentContainer = container || document.getElementById('soto-master-carousel');
    if (!currentContainer) return; // Salvaguarda si el usuario cambió de pantalla

    const slides = currentContainer.querySelectorAll('.amazon-slide-layout');
    if (!slides.length) return;

    let nextIndex = this.currentSlide + direction;
    if (nextIndex >= slides.length) nextIndex = 0;
    if (nextIndex < 0) nextIndex = slides.length - 1;
    
    this.goToSlide(nextIndex, currentContainer);
};

Home.goToSlide = function(index, container) {
    const currentContainer = container || document.getElementById('soto-master-carousel');
    if (!currentContainer) return;

    this.currentSlide = index;
    const slides = currentContainer.querySelectorAll('.amazon-slide-layout');
    
    // Transición fluida: Apagamos todas las capas y encendemos solo la activa con fundido suave
    slides.forEach((slide, i) => {
        slide.style.opacity = i === index ? '1' : '0';
        slide.style.zIndex = i === index ? '10' : '0';
    });
};

Home.startCarouselAutoPlay = function(container) {
    // Si ya había un intervalo corriendo en memoria, lo matamos para evitar duplicados
    if (this.carouselInterval) clearInterval(this.carouselInterval);
    
    this.carouselInterval = setInterval(() => {
        const currentContainer = container || document.getElementById('soto-master-carousel');
        
        // MEMORY LEAK PROTECTION: Si el contenedor ya no existe en el DOM, destruimos el intervalo
        if (!currentContainer || !document.body.contains(currentContainer)) {
            clearInterval(this.carouselInterval);
            return;
        }
        this.moveCarousel(1, currentContainer);
    }, 5000); // 5 segundos exactos de exposición por anuncio publicitario
};


// =========================================================================
// 5. CUADRÍCULA DE CATEGORÍAS EN BLOQUES DE 4x2 (PRESIÓN MILIMÉTRICA TAILWIND)
// =========================================================================
Home.renderDashboardBody = function() {
    const bodyContainer = document.createElement('div');
    // CORRECCIÓN DE BORDES Y CENTRADO: Añadimos px-4 (colchón lateral) y cambiamos max-w-7xl mx-auto a clases puras de Tailwind eficientes
    bodyContainer.className = "px-4 md:px-6 lg:px-8 max-w-[1400px] mx-auto relative z-30 -mt-16 md:-mt-24 pb-12 w-full box-border";
    
    // Mapeo exacto de las 4 categorías con sus 4 subproductos e imágenes .jpg asignadas
    const categoriasB2B = [
        {
            id: "cat-viveres",
            slug: "viveres", // Slug para la redirección URL
            titulo: "Víveres Esenciales",
            subproductos: [
                { nombre: "Arroz y Pastas", img: "./assets/Arroz-Amanecer-900g.jpg" },
                { nombre: "Aceites y Granos", img: "./assets/Aceite-Vatel-1L.jpg" },
                { nombre: "Harinas y Más", img: "./assets/harina-pan.jpg" },
                { nombre: "Condimentos", img: "./assets/sub-condimento.png" }
            ]
        },
        {
            id: "cat-bebidas",
            slug: "bebidas",
            titulo: "Bebidas y Refrescos",
            subproductos: [
                { nombre: "Jugos y Sodas", img: "./assets/jugo-Yusti.png" },
                { nombre: "Aguas", img: "./assets/sub-agua.jpg" },
                { nombre: "Gaseosas", img: "./assets/Refresco-Golden.jpg" },
                { nombre: "Maltas", img: "./assets/malta.jpg" }
            ]
        },
        {
            id: "cat-postres",
            slug: "postres",
            titulo: "Postres y Lácteos",
            subproductos: [
                { nombre: "Quesillos", img: "./assets/sub-quesillo.jpg" },
                { nombre: "Yogures", img: "./assets/sub-yogur.jpg" },
                { nombre: "Charcutería", img: "./assets/queso.jpg" },
                { nombre: "Dulces", img: "./assets/sub-dulce.jpg" }
            ]
        },
        {
            id: "cat-panaderia",
            slug: "panaderia",
            titulo: "Panadería y Dulces",
            subproductos: [
                { nombre: "Pan Dulce", img: "./assets/sub-pandulce.jpg" },
                { nombre: "Pan De Guayaba", img: "./assets/sub-guayaba.jpg" },
                { nombre: "pastelitos", img: "./assets/sub-pastelito.png" },
                { font: "Repostería", nombre: "Repostería", img: "./assets/sub-reposteria.jpg" }
            ]
        }
    ];

    let gridHTML = '';
    
    // Inyección única de las directivas de animación para las imágenes del cuadrante
    if (!document.getElementById('soto-mini-floating-styles')) {
        const styleEl = document.createElement('style');
        styleEl.id = 'soto-mini-floating-styles';
        styleEl.innerHTML = `
            /* Al hacer hover en la tarjeta grande, sus 4 imágenes internas escalan suavemente */
            .amazon-card-group:hover .soto-animate-img {
                transform: scale(1.08) translateY(-2px) !important;
                filter: drop-shadow(0 6px 10px rgba(0,0,0,0.12)) !important;
            }
            /* Efecto sutil de levantamiento tridimensional en la tarjeta */
            .amazon-card-group:hover {
                transform: translateY(-4px) !important;
                box-shadow: 0 20px 35px rgba(0,0,0,0.25) !important;
                border-color: #3b82f6 !important; /* Borde azul sutil en hover */
            }
        `;
        document.body.appendChild(styleEl);
    }
    
    categoriasB2B.forEach(cat => {
        gridHTML += `
            <!-- TARJETA CONTROLADA: Forzamos fondo blanco, caja rígida h-[420px] -->
            <div class="amazon-card-group" data-main-cat="${cat.id}" data-slug="${cat.slug}" style="background-color: #FFFFFF !important; color: #000000 !important; border-radius: 8px !important; padding: 20px !important; display: flex !important; flex-direction: column !important; justify-content: space-between !important; height: 420px !important; box-shadow: 0 10px 25px rgba(0,0,0,0.15) !important; box-sizing: border-box !important; border: 1px solid #e2e8f0 !important; cursor: pointer; transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;">
                
                <div>
                    <!-- Título interno de la Categoría -->
                    <h3 style="font-weight: 800 !important; font-size: 17px !important; color: #0f172a !important; margin: 0 0 14px 0 !important; font-family: 'Inter', sans-serif !important; letter-spacing: -0.02em !important;">
                        ${cat.titulo}
                    </h3>
                    
                    <!-- REJILLA INTERNA 2x2: Distribución exacta de los 4 subcuadrantes -->
                    <div style="display: grid !important; grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; width: 100% !important; box-sizing: border-box !important;">
                        ${cat.subproductos.map(sub => `
                            <div style="display: flex !important; flex-direction: column !important; width: 100% !important; min-width: 0 !important; box-sizing: border-box !important;">
                                
                                <!-- EL ANCLA MILIMÉTRICA -->
                                <div style="width: 100% !important; height: 100px !important; background-color: #f8fafc !important; border-radius: 6px !important; overflow: hidden !important; display: flex !important; align-items: center !important; justify-content: center !important; border: 1px solid #e2e8f0 !important; box-sizing: border-box !important;">
                                    <img src="${sub.img}" alt="${sub.nombre}" class="soto-animate-img" style="max-width: 100% !important; max-height: 100% !important; object-fit: contain !important; padding: 6px !important; box-sizing: border-box !important; transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), filter 0.3s ease !important; will-change: transform, filter !important;" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://w3.org\' width=\'100\' height=\'100\' viewBox=\'0 0 100 100\'><rect width=\'100\' height=\'100\' fill=\'%23f1f5f9\'/><text x=\'50%\' y=\'50%\' dominant-baseline=\'middle\' text-anchor=\'middle\' font-size=\'9\' font-weight=\'bold\' fill=\'%2394a3b8\'>Apio B2B</text></svg>';">
                                </div>
                                
                                <!-- Texto debajo de la imagen con truncado estricto anti-colapso -->
                                <span style="font-size: 11px !important; font-weight: 600 !important; color: #475569 !important; margin-top: 6px !important; white-space: nowrap !important; overflow: hidden !important; text-overflow: ellipsis !important; font-family: 'Inter', sans-serif !important;">
                                    ${sub.nombre}
                                </span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Enlace inferior de acción de Amazon -->
                <div style="margin-top: 12px !important; padding-top: 8px !important; border-top: 1px solid #f1f5f9 !important;">
                    <button class="btn-ver-inventario" style="background: transparent !important; border: none !important; font-size: 12px !important; font-weight: 700 !important; color: #007185 !important; cursor: pointer !important; padding: 0 !important; text-align: left !important; transition: color 0.2s ease;">
                        Ver inventario completo →
                    </button>
                </div>

            </div>
        `;
    });

      // REJILLA MASTER INLINE OPTIMIZADA: Centra las tarjetas y evita que choquen con los bordes
    bodyContainer.innerHTML = `
        <div id="categories-amazon-grid" style="display: grid !important; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)) !important; gap: 24px !important; width: 100% !important; max-width: 1350px !important; margin: 0 auto !important; box-sizing: border-box !important; justify-content: center !important;">
            ${gridHTML}
        </div>
    `;

    // --- ENRUTAMIENTO MAESTRO MEDIANTE WINDOW.APP ---
    bodyContainer.querySelectorAll('.amazon-card-group').forEach(card => {
        const idCat = card.getAttribute('data-main-cat'); // Captura el id (ej: cat-viveres)
        
        // 1. Click en cualquier parte de la tarjeta va al catálogo general de la categoría
        card.addEventListener('click', (e) => {
            if (e.target.closest('.btn-ver-inventario')) return; // Evita doble ejecución
            
            if (window.App) {
                // Seteamos el estado exactamente como lo hace tu dropdown "Todo"
                if (!window.App.state) window.App.state = {};
                window.App.state.categoriaSeleccionada = idCat;
                window.App.state.filtroInventario = 'general'; // Flag por si la necesitas
                
                // Navegamos usando tu función global nativa
                if (typeof window.App.navigate === 'function') {
                    window.App.navigate('catalogo-b2b');
                }
            }
        });

        // 2. Click exclusivo en "Ver inventario completo →" va al catálogo con filtro activo
        const btnInventario = card.querySelector('button');
        if (btnInventario) {
            btnInventario.classList.add('btn-ver-inventario');
            btnInventario.addEventListener('click', (e) => {
                e.stopPropagation(); // Frena el evento para que no se active el click de la tarjeta padre
                
                if (window.App) {
                    if (!window.App.state) window.App.state = {};
                    window.App.state.categoriaSeleccionada = idCat;
                    window.App.state.filtroInventario = 'completo'; // Le avisa al catálogo que muestre todo
                    
                    if (typeof window.App.navigate === 'function') {
                        window.App.navigate('catalogo-b2b');
                    }
                }
            });
        }
    });

    return bodyContainer;
};

// =========================================================================
// 7. WIDGET DE DANIELA IA (PARTE 1: INICIALIZACIÓN, ESTILOS Y DRAG-AND-DROP)
// =========================================================================
// MODIFICACIÓN DE ALINEACIÓN EN LA PC (Antes de renderizar el Widget)

//Home.conectarCanalDaniela = function() {
    // 🚀 EXTRACCIÓN DINÁMICA: Captura el usuario real configurado en la ficha (ej: "Gabriel", "Maria_Cajera")
  //  const usuarioActivo = Home.obtenerUsuarioLogueado() || "Cajero_Generico"; 
    
    // Generamos el ID de sesión combinando el timestamp y el nombre del usuario para que sea único por caja
 //   const idSesionCaja = btoa(`${usuarioActivo}_${Date.now()}`); 
 //   Home.idSesionActual = idSesionCaja;
  //  Home.usuarioActual = usuarioActivo; // Almacenamos el operador en la memoria RAM del front

    // 📡 REPARACIÓN QUÍMICA DE RUTA: Apunta directo al canal /ws/caja/ que tu proxy en Railway espera
    // Usamos el host real unificado en la nube para que muerda el upgrade de forma síncrona
  //  const ws = new WebSocket(`wss://web-production-dcec7.up.railway.app/ws/caja/${Home.idSesionActual}`);

 //   ws.onmessage = function(event) {
  //      const data = JSON.parse(event.data);
        
        // Control de emparejamiento clásico del mostrador
   //     if (data.status === "VINCULADO_GERENTE" || data.evento === "VINCULACION_CONFIRMADA") {
    //        window.setDanielaIAOnline();
    //        Home.socketDanielaActivo = ws;
    //    }
        
        // EL DISPARADOR DE CORNETAS (REGLA DE ORO SOTO SYSTEM)
    //    if (data.evento === "REPRODUCIR_VOZ_DANIELA" && data.datos && data.datos.texto) {
    //        const consolaNegraTexto = document.getElementById('consola-facturacion-texto-real');
    //        if (consolaNegraTexto) {
    //            consolaNegraTexto.innerText = data.datos.texto;
    //        }

    //        const rafagaVoz = new SpeechSynthesisUtterance(data.datos.texto);
    //        rafagaVoz.lang = 'es-VE';  
    //        rafagaVoz.rate = 1.0;      
    //        rafagaVoz.pitch = 1.15;    
    //        
    //        window.speechSynthesis.speak(rafagaVoz);
    //    }
   // };
//};

//Home.renderDanielaWidget = function() {
    // Control antiduplicidad estricto para evitar clonaciones en SPA
  //  if (document.getElementById('daniela-ia-widget-root')) {
    //    return document.getElementById('daniela-ia-widget-root');
   // }

 //   const widgetContainer = document.createElement('div');
 //   widgetContainer.id = "daniela-ia-widget-root";
    // Posicionamiento fijo inicial en la esquina inferior derecha
 //   widgetContainer.setAttribute('style', 'position: fixed !important; bottom: 24px !important; right: 24px !important; z-index: 200 !important; display: flex !important; flex-direction: column !important; align-items: flex-end !important; font-family: "Inter", sans-serif !important;');

    // INYECCIÓN DE ESTILOS DE ARTILLERÍA: Animaciones globales del ecosistema de la IA
 //   if (!document.getElementById('soto-daniela-global-styles')) {
 //       const style = document.createElement('style');
 //       style.id = 'soto-daniela-global-styles';
 //       style.innerHTML = `
            /* Pulso neón verde cuando se conecta la terminal con el backend */
 //           .daniela-pulse-online { animation: danielaGlow 2s infinite alternate; }
 //           @keyframes danielaGlow {
 //               0% { box-shadow: 0 0 8px rgba(34, 197, 94, 0.5), inset 0 0 4px rgba(34, 197, 94, 0.3); }
 //               100% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.9), inset 0 0 8px rgba(34, 197, 94, 0.5); }
 //           }

            /* Nube de chat / Tooltip superior flotante "¿Quieres chatear con Daniela?" */
 //           .daniela-hover-tooltip {
 //               visibility: hidden; opacity: 0; transform: translateY(10px);
 //               transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
 //           }
 //           .daniela-trigger-ball-box:hover .daniela-hover-tooltip {
 //               visibility: visible; opacity: 1; transform: translateY(0);
 //           }

            /* Animación de la línea láser del escáner QR */
 //           .qr-laser-line { animation: scanLine 2.5s infinite linear; position: absolute; left: 0; right: 0; height: 2px; background-color: #22c55e; box-shadow: 0 0 10px #22c55e; }
 //           @keyframes scanLine {
 //               0% { top: 0%; opacity: 0.3; }
 //               50% { top: 100%; opacity: 1; }
 //               100% { top: 0%; opacity: 0.3; }
 //           }
            
            /* Reset de scrolls para el cuerpo del chat */
 //           .no-scrollbar::-webkit-scrollbar { display: none; }
 //           .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
 //       `;
 //       document.body.appendChild(style);
 //   }

    // Maquetación de la esfera arrastrable y el cascarón de la ventana (BLINDAJE TOTAL DE INICIO)
 //   widgetContainer.innerHTML = `
 //       <!-- VENTANA MAESTRA UNIFICADA (Forzamos display: none !important inicial para que no aparezca al comienzo) -->
 //       <div id="daniela-chat-window" class="hidden" style="display: none !important; width: 350px !important; height: 490px !important; background-color: #0c111d !important; border: 1px solid #1e293b !important; border-radius: 16px !important; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.7) !important; flex-direction: column; overflow: hidden; margin-bottom: 12px; z-index: 210 !important; box-sizing: border-box !important;">
 //           <div id="window-dynamic-content" style="width: 100% !important; height: 100% !important; display: flex; flex-direction: column; box-sizing: border-box !important;">
 //               <!-- Aquí se inyectarán las fases de QR y de Chat de forma dinámica -->
 //           </div>
 //       </div>

 //       <!-- BOTÓN DISPARADOR: Círculo de contacto arrastrable (Drag & Drop para PC y Móviles) -->
 //       <div id="daniela-trigger-btn" class="daniela-trigger-ball-box flex items-center justify-center relative transition-transform duration-200" style="width: 60px !important; height: 60px !important; background-color: #121b22 !important; border-radius: 50% !important; border: 2px solid #64748b; cursor: grab; box-shadow: 0 10px 25px rgba(0,0,0,0.5) !important; touch-action: none !important;">
            
  //          <!-- Etiqueta Tooltip superior solicitada -->
  //          <div class="daniela-hover-tooltip" style="position: absolute !important; bottom: 75px !important; right: 0 !important; background-color: #1e293b !important; color: #FFFFFF !important; font-size: 11px !important; font-weight: 700 !important; padding: 6px 12px !important; border-radius: 20px !important; border: 1px solid #334155 !important; white-space: nowrap !important; box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important; pointer-events: none !important;">
  //              ¿Quieres chatear con Daniela? ✨
  //          </div>

 //           <!-- Avatar interno usando tu imagen local -->
 //           <img src="./assets/daniela.png" alt="Daniela Chat" style="width: 100% !important; height: 100% !important; object-fit: cover !important; border-radius: 50% !important; pointer-events: none !important;">
            
 //           <!-- Micro-indicador del pin de estado -->
 //           <span id="daniela-status-dot" style="position: absolute !important; top: 0 !important; right: 0 !important; width: 14px !important; height: 14px !important; background-color: #f59e0b !important; border-radius: 50% !important; border: 2px solid #0B0E14 !important; box-sizing: border-box !important;"></span>
 //       </div>
 //   `;

 //   const triggerBtn = widgetContainer.querySelector('#daniela-trigger-btn');
 //   const chatWindow = widgetContainer.querySelector('#daniela-chat-window');
 //   const dynamicContent = widgetContainer.querySelector('#window-dynamic-content');
 //   const statusDot = widgetContainer.querySelector('#daniela-status-dot');

    // --- LOGICA DE DRAG & DROP MILIMÉTRICA CON PROTECCIÓN DE CLICK ---
//    let isDragging = false;
//    let hasDragged = false;
//    let startX = 0, startY = 0, initialLeft = 0, initialTop = 0;

//    const onDragStart = (e) => {
//        isDragging = true;
//        hasDragged = false;
//        triggerBtn.style.cursor = 'grabbing';

 //       const clientX = e.type === 'touchstart' ? e.touches.clientX : e.clientX;
 //       const clientY = e.type === 'touchstart' ? e.touches.clientY : e.clientY;

  //      startX = clientX;
  //      startY = clientY;

  //      const rect = widgetContainer.getBoundingClientRect();
  //      initialLeft = rect.left;
  //      initialTop = rect.top;

  //      document.addEventListener('mousemove', onDragMove, { passive: false });
   //     document.addEventListener('mouseup', onDragEnd);
   //     document.addEventListener('touchmove', onDragMove, { passive: false });
   //     document.addEventListener('touchend', onDragEnd);
  //  };

 //   const onDragMove = (e) => {
  //      if (!isDragging) return;
  //      if (e.cancelable) e.preventDefault(); // Evita scrolls accidentales de la pantalla en teléfonos

 //       const clientX = e.type === 'touchmove' ? e.touches.clientX : e.clientX;
  //      const clientY = e.type === 'touchmove' ? e.touches.clientY : e.clientY;

 //       const deltaX = clientX - startX;
  //      const deltaY = clientY - startY;

  //      if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
   //         hasDragged = true; // Se confirma arrastre, se anula el click de apertura de la ventana
   //     }

   //     let newLeft = initialLeft + deltaX;
    //    let newTop = initialTop + deltaY;

        // Abrazamos márgenes de seguridad para que la bola no se pierda fuera de la pantalla visible
   //     newLeft = Math.max(12, Math.min(newLeft, window.innerWidth - 72));
   //     newTop = Math.max(12, Math.min(newTop, window.innerHeight - 72));

  //      widgetContainer.style.bottom = 'auto';
  //      widgetContainer.style.right = 'auto';
 //       widgetContainer.style.left = `${newLeft}px`;
 //       widgetContainer.style.top = `${newTop}px`;
 //   };

 //   const onDragEnd = () => {
  //      isDragging = false;
   //     triggerBtn.style.cursor = 'grab';
  //      document.removeEventListener('mousemove', onDragMove);
   //     document.removeEventListener('mouseup', onDragEnd);
  //      document.removeEventListener('touchmove', onDragMove);
   //     document.removeEventListener('touchend', onDragEnd);
 //   };

    // --- LÓGICA DE ARRASTRE EXCLUSIVA PARA LA CABECERA DE LA VENTANA DE CHAT ---
 //   let isWindowDragging = false;
 //   let wStartX = 0, wStartY = 0, wInitialLeft = 0, wInitialTop = 0;

//    const onWindowDragStart = (e) => {
        // Interceptamos clicks en botones o entradas de texto para que no arrastren la ventana por error
//        const target = e.target;
 //       if (target.id === 'close-daniela-view' || target.tagName === 'INPUT' || target.tagName === 'BUTTON') return;

        // Validamos que el arrastre provenga exclusivamente del contenedor de la cabecera (primer hijo de la ventana)
 //       const header = chatWindow.firstElementChild;
 //       if (!header || !header.contains(target)) return;

 //       isWindowDragging = true;
 //       header.style.cursor = 'move';

 //       wStartX = e.clientX;
 //       wStartY = e.clientY;

 //       const rect = widgetContainer.getBoundingClientRect();
 //       wInitialLeft = rect.left;
 //       wInitialTop = rect.top;

 //       document.addEventListener('mousemove', onWindowDragMove);
  //      document.addEventListener('mouseup', onWindowDragEnd);
  //  };

 //   const onWindowDragMove = (e) => {
 //       if (!isWindowDragging) return;

 //       const deltaX = e.clientX - wStartX;
 //       const deltaY = e.clientY - wStartY;

  //      let newLeft = wInitialLeft + deltaX;
  //      let newTop = wInitialTop + deltaY;

        // Márgenes de seguridad calculados para la ventana (ancho aproximado 350px, alto 550px junto a la esfera)
 //       newLeft = Math.max(12, Math.min(newLeft, window.innerWidth - 362));
 //       newTop = Math.max(12, Math.min(newTop, window.innerHeight - 562));

//        widgetContainer.style.bottom = 'auto';
//        widgetContainer.style.right = 'auto';
 //       widgetContainer.style.left = `${newLeft}px`;
 //       widgetContainer.style.top = `${newTop}px`;
//    };

//    const onWindowDragEnd = () => {
  //      isWindowDragging = false;
   //     const header = chatWindow.firstElementChild;
   //     if (header) header.style.cursor = 'default';
   //     document.removeEventListener('mousemove', onWindowDragMove);
  //      document.removeEventListener('mouseup', onWindowDragEnd);
 //   };

    // =========================================================================
// CONTINUACIÓN DE RENDER: MANEJO DE SEÑALIZACIÓN CLICK Y ENLACE DE HARDWARE
// =========================================================================
  //  triggerBtn.addEventListener('click', () => {
        // Si el usuario arrastró el botón, cancelamos la acción de abrir/cerrar
     //   if (hasDragged) return;

      //  const isHidden = chatWindow.style.getPropertyValue('display') === 'none !important' || 
          //               chatWindow.style.display === 'none' || 
         //                chatWindow.classList.contains('hidden');

     //   if (isHidden) {
            // 1. REACCIÓN CLAVE: Forzamos el redibujado de la vista inyectando la Parte 2-A
        //    if (typeof Home.updateWidgetView === 'function') {
        //        Home.updateWidgetView(dynamicContent, statusDot, chatWindow);
       //     }

            // 2. Se abre el modal físicamente en pantalla
       //     chatWindow.classList.remove('hidden');
      //      chatWindow.style.setProperty('display', 'flex', 'important');
    //    } else {
            // Se cierra el modal
   //         chatWindow.classList.add('hidden');
   //         chatWindow.style.setProperty('display', 'none', 'important');
  //      }
  //  });

    // Inicializadores de listeners para arrastre de la esfera
 //   triggerBtn.addEventListener('mousedown', onDragStart);
 //   triggerBtn.addEventListener('touchstart', onDragStart, { passive: true });

    // Inicializador de listener para arrastre de la cabecera de la ventana
 //   chatWindow.addEventListener('mousedown', onWindowDragStart);

    // Acoplamos el nodo raíz al árbol del documento
 //   document.body.appendChild(widgetContainer);

  //  return widgetContainer;
//}; 

// =========================================================================
// 7. WIDGET DE DANIELA IA (PARTE 2-A: MÁNAGER DE VISTAS - CONTROLADOR QR) - CORRECCIÓN DE TIEMPO
// =========================================================================
//Home.updateWidgetView = function(container, dot, windowModal) {
   // if (!container) return;
   // container.innerHTML = ''; // Limpieza de seguridad

    //if (!this.danielaConectada) {
       // if (dot) {
        //    dot.style.setProperty('background-color', '#f59e0b', 'important');
        //    dot.style.setProperty('box-shadow', '0 0 10px rgba(245, 158, 11, 0.6)', 'important');
        //}

        //container.innerHTML = `
        //    <div style="background-color: #121b22; padding: 16px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #1e293b; box-sizing: border-box;">
        //        <div style="display: flex; align-items: center; gap: 8px;">
        //            <span style="font-size: 13px; font-weight: 800; color: #FFFFFF; font-family: 'Inter', sans-serif; text-transform: uppercase; letter-spacing: 0.05em;">Sincronización Apio B2B</span>
        //        </div>
        //        <button id="close-daniela-view" style="background: transparent; border: none; color: #94a3b8; cursor: pointer; font-size: 16px; padding: 0 4px;">✕</button>
        //    </div>
            
        //    <div style="flex: 1; padding: 24px; display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: #080c14; text-align: center; gap: 16px; box-sizing: border-box;">
        //        <div style="width: 50px; height: 50px; border-radius: 50%; overflow: hidden; border: 1px solid #334155; background-color: #131921;">
        //            <img src="./assets/daniela.png" alt="Daniela" style="width: 100%; height: 100%; object-fit: cover;">
        //        </div>
        //        <div>
        //            <h4 style="font-weight: 800; font-size: 15px; color: #FFFFFF; margin: 0; font-family: 'Inter', sans-serif;">Emparejar Daniela IA</h4>
        //            <p style="font-size: 11px; color: #94a3b8; margin: 6px 0 0 0; line-height: 1.5; padding: 0 8px; font-family: 'Inter', sans-serif;">Abre la App Móvil de Apio en tu teléfono y escanea el código para enlazar el asistente al sistema de escritorio.</p>
        //        </div>

        //        <div style="position: relative; width: 170px; height: 170px; background-color: #FFFFFF; padding: 12px; border-radius: 16px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); border: 4px solid rgba(34, 197, 94, 0.15); overflow: hidden; display: flex; align-items: center; justify-content: center; box-sizing: border-box; margin: 8px 0;">
                    
        //            <canvas id="soto-dynamic-desktop-qr" style="width: 140px !important; height: 140px !important; display: block;"></canvas>
        //        </div>

        //        <div id="qr-status-text" style="font-size: 10px; font-family: monospace; font-weight: bold; color: #f59e0b; text-transform: uppercase; min-height: 15px;">
        //            ⏳ Esperando escaneo desde el móvil...
        //        </div>
        //    </div>
      //  `;

        // 🚀 EL AJUSTE MAESTRO: Subimos el tiempo de espera a 400ms para asegurar que el DOM esté completamente pintado
    //    setTimeout(() => {
       //     try {
                // Buscamos el elemento canvas con un selector local estricto
       //         const canvasQR = document.getElementById('soto-dynamic-desktop-qr');
                
                // Verificación de hardware de que el canvas y la librería existen en la RAM
       //         if (canvasQR && typeof QRCode !== 'undefined') {
                    // Generamos la sesión limpia y única
       //             const idSesionLocal = btoa(`Cajero_${Date.now()}`);
                    
                    // Endpoint duro definitivo apuntando a tu Django en la nube
       //             const urlSincronizacionFinal = `https://railway.app${idSesionLocal}`;
               
                    // Forzamos el renderizado de la matriz de puntos binarios
        //            QRCode.toCanvas(canvasQR, urlSincronizacionFinal, {
        //                width: 140,
        //                margin: 0,
        //                color: { dark: '#111B21', light: '#FFFFFF' },
         //               errorCorrectionLevel: 'H'
        //            }, function (error) {
        //                if (error) console.error("❌ [SOTO QR ERROR]:", error);
       //             });
                    
       //             console.log("📡 [SOTO NET]: Matriz de puntos QR inyectada con éxito en el canvas.");
       //         } else {
      //              console.warn("⚠️ [SOTO NET]: Esperando que el Canvas o la librería QRCode se acoplencen en RAM.");
      //          }
      //      } catch (err) {
     //           console.error("❌ [SOTO CRITICAL]: Fallo en la inyección de tinta del QR:", err.message);
     //       }
    //    }, 400); // 🎛️ 400 milisegundos de respiro para que la SPA termine el render

        // Escuchador del botón X de cierre
  //      const closeBtn = container.querySelector('#close-daniela-view');
  //      if (closeBtn && windowModal) {
       //     closeBtn.addEventListener('click', (e) => {
      //          e.stopPropagation();
      //          windowModal.classList.add('hidden');
     //           windowModal.style.setProperty('display', 'none', 'important'); 
    //        });
   //     }
  //  }
//};

// =========================================================================
// 7. WIDGET DE DANIELA IA (PARTE 3: PUENTE DISPARADOR DE PRODUCCIÓN CORREGIDO)
// =========================================================================

// CORRECCIÓN: Asignación directa sobre el objeto Home local
//Home.setDanielaOnline = function() {
 //   const root = document.getElementById('daniela-ia-widget-root');
//    if (!root) return;

 //   const dot = root.querySelector('#daniela-status-dot');
 //   const chatWindow = root.querySelector('#daniela-chat-window');
 //   const dynamicContent = root.querySelector('#window-dynamic-content');
 //   const triggerBtn = root.querySelector('#daniela-trigger-btn');

 //   this.danielaConectada = true; // 'this' apunta correctamente a Home

    // 1. Mutación Estética: Aplicamos el Anillo Verde Neón de Estado sin romper estilos inline dinámicos
 //   if (triggerBtn) {
 //       triggerBtn.classList.add('daniela-pulse-online');
        
        // Modificación selectiva de propiedades para preservar la flexibilidad del Drag & Drop
 //       triggerBtn.style.setProperty('border', '3px solid #22c55e', 'important');
 //       triggerBtn.style.setProperty('box-shadow', '0 0 15px rgba(34, 197, 94, 0.6)', 'important');
 //   }
    
    // Cambiamos el pin superior de estado a verde fijo
 //   if (dot) dot.style.backgroundColor = "#22c55e";

    // 2. Redibujamos la vista interna al cascarón de chat en blanco de forma reactiva
 //   if (dynamicContent && chatWindow) {
 //       this.updateWidgetView(dynamicContent, dot, chatWindow);
 //   }
    
 //   console.log("🤖 Ecosistema Apio B2B: Sincronización asíncrona completada. Daniela en línea.");
//};

// Exponemos la función a la ventana global por si tu server.cjs necesita invocarla desde fuera
//window.setDanielaIAOnline = function() {
 //   if (Home && typeof Home.setDanielaOnline === 'function') {
 //       Home.setDanielaOnline();
//    }
//};

// =========================================================================
// CARRUSEL INFINITO DE MARCAS PROVEEDORAS (ESTILO MARKETPLACE PREMIUM)
// =========================================================================
Home.renderBrandsCarousel = function() {
    const brandsSection = document.createElement('section');
    brandsSection.className = "max-w-7xl mx-auto px-6 py-10 border-b border-slate-900/40 bg-[#0B0E14]";

    // CONTROL DE DUPLICIDAD: Inyectamos estilos y animaciones clave una sola vez en el HEAD
    if (!document.getElementById('soto-system-brands-styles')) {
        const style = document.createElement('style');
        style.id = 'soto-system-brands-styles';
        style.innerHTML = `
            @keyframes scrollBrands {
                0% { transform: translateX(0); }
                /* -50% es matemáticamente perfecto porque el contenedor mide el doble exacto de marcas */
                100% { transform: translateX(-50%); }
            }
            .brands-slider-track {
                display: flex !important;
                width: max-content !important; /* Deja que el navegador calcule el ancho real sumado */
                animation: scrollBrands 25s linear infinite !important;
            }
            .brands-slider-track:hover {
                animation-play-state: paused !important;
            }

            /* Marco rígido del logotipo para que ninguna imagen deforme la barra */
            .soto-brand-img-wrapper {
                width: 110px !important;
                height: 55px !important;
                background-color: #FFFFFF !important; /* Fondo blanco para que resalten los logotipos */
                border-radius: 6px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                padding: 6px !important;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4) !important;
                border: 1px solid #1e293b !important;
                box-sizing: border-box !important;
            }
            .soto-brand-img-wrapper img {
                max-width: 100% !important;
                max-height: 100% !important;
                object-fit: contain !important; /* Encoge la imagen de forma simétrica */
                display: block !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Listado de las marcas líderes sincronizadas con los formatos mixtos reales de tus assets
    const marcas = [
        { nombre: "Empresas Polar", logo: "./assets/polar.jpg" },
        { nombre: "Mavesa", logo: "./assets/mavesa.png" },
        { nombre: "Alimentos El Tunal", logo: "./assets/tunal.jpg" },
        { nombre: "Natulac", logo: "./assets/natulac.jpg" },
        { nombre: "Nestlé", logo: "./assets/nestle.jpg" }
    ];

    // Duplicamos el array para lograr el efecto infinito visual perfecto sin saltos
    const marcasDobles = [...marcas, ...marcas];

    let brandsHTML = '';
    marcasDobles.forEach(marca => {
        brandsHTML += `
            <!-- TARJETA DE MARCA CONTROLADA: Impide el apilamiento vertical y fuerza la escala de grises sutil -->
            <div style="width: 160px !important; flex-shrink: 0 !important; text-align: center !important; padding: 12px !important; display: flex !important; flex-direction: column !important; align-items: center !important; justify-content: center !important; gap: 8px !important; box-sizing: border-box !important; cursor: pointer !important;" class="grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                <div class="soto-brand-img-wrapper">
                    <img src="${marca.logo}" alt="${marca.nombre}">
                </div>
                <span style="font-size: 10px !important; text-transform: uppercase !important; letter-spacing: 0.05em !important; font-weight: 700 !important; color: #64748b !important; font-family: 'Inter', sans-serif !important; text-align: center !important; white-space: nowrap !important; overflow: hidden !important; text-overflow: ellipsis !important; width: 100% !important;">
                    ${marca.nombre}
                </span>
            </div>
        `;
    });

        // REFACTORIZACIÓN DE SEGURIDAD: Máscaras encapsuladas dentro del límite del slider
    brandsSection.innerHTML = `
        <h4 style="text-align: center !important; font-weight: 700 !important; font-size: 12px !important; text-transform: uppercase !important; letter-spacing: 0.1em !important; color: #64748b !important; margin-bottom: 24px !important; font-family: 'Inter', sans-serif !important;">
            Proveedores y Marcas Distribuidas
        </h4>
        <!-- Forzamos position: relative y z-index bajo para que no interfiera con las tarjetas de arriba -->
        <div style="width: 100% !important; overflow: hidden !important; position: relative !important; z-index: 10 !important; background-color: #090b0f !important; border: 1px solid #1e293b !important; padding: 8px 0 !important; border-radius: 12px !important; box-shadow: inset 0 4px 10px rgba(0,0,0,0.5) !important;">
            
            <!-- Gradientes laterales acortados en altura para que jamás salten fuera de la barra -->
            <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 40px; background: linear-gradient(to right, #090b0f, transparent); z-index: 20; pointer-events: none; height: 100% !important;"></div>
            <div style="position: absolute; right: 0; top: 0; bottom: 0; width: 40px; background: linear-gradient(to left, #090b0f, transparent); z-index: 20; pointer-events: none; height: 100% !important;"></div>
            
            <div class="brands-slider-track">
                ${brandsHTML}
            </div>
        </div>
    `;

    return brandsSection;
};

// =========================================================================
// 8. FOOTER INSTITUCIONAL DE APIO (SIEMPRE EN LA ÚLTIMA LÍNEA)
// =========================================================================
Home.renderFooter = function() {
    const footerElement = document.createElement('footer');
    footerElement.setAttribute('style', 'background-color: #090b0f !important; padding: 32px 24px !important; border-top: 1px solid #1e293b !important; width: 100% !important; box-sizing: border-box !important; margin-top: auto !important; z-index: 20 !important;');

    footerElement.innerHTML = `
        <div style="max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; gap: 12px; font-size: 12px; color: #64748b; font-family: 'Inter', sans-serif;">
            
            <!-- Bloque Superior: Marca Homologada del Header -->
            <div style="line-height: 1.4;">
                <p style="color: #cbd5e1; font-weight: bold; margin: 0; letter-spacing: 0.03em; font-size: 13px;">
                    APIO <span style="color: #eab308; font-size: 11px; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase;">E-COMMERCE SOFTWARE</span> <span style="color: #3b82f6; font-size: 10px; font-family: monospace; font-weight: 700; margin-left: 4px;">v1.0.0-SaaS</span>
                </p>
                <p style="font-size: 10px; color: #475569; margin: 4px 0 0 0;">Fase de Desarrollo Comercial • Bodega Digital</p>
            </div>
            
            <!-- Bloque Inferior: Derechos de Autor y Firma en Gris Claro Legible -->
            <div style="line-height: 1.4;">
                <p style="color: #94a3b8; margin: 0; font-weight: 500;">© 2026 All Rights Reserved.</p>
                <p style="font-size: 10px; color: #475569; margin: 4px 0 0 0;">
                    Desarrollado por <span style="color: #cbd5e1; font-weight: bold; letter-spacing: 0.02em;">Soto System Digital Solutions VE</span>
                </p>
            </div>

        </div>
    `;

    return footerElement;
};

export { Home };
