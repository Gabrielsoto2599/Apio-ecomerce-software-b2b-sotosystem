// src/pages/catalogo.js
import { Home } from './home.js'; // Importamos el Home para heredar sus módulos visuales y lógica de la IA

// =========================================================================
// BLOQUE 1: CORE DE DATOS - LISTA DE 53 PRODUCTOS DESDE POSTGRESQL (DJANGO ORM)
// =========================================================================

const CatalogoB2B = {
    // Sincronización exacta del JSON de la base de datos de Apio
    productos: [
        {"sku": "PAS-CAP-001", "nombre": "Pasta-Capri-1kg", "precio_usd": 2.50, "stock": 10, "categoria": "Pastas"},
        {"sku": "PAS-PRI-002", "nombre": "Pasta-Primor-1kg", "precio_usd": 2.70, "stock": 10, "categoria": "Pastas"},
        {"sku": "PAS-HOR-003", "nombre": "Pasta-Horizonte-1kg", "precio_usd": 2.20, "stock": 10, "categoria": "Pastas"},
        {"sku": "MAY-AAD-004", "nombre": "Mayonesa-AAD", "precio_usd": 1.50, "stock": 10, "categoria": "Salsas"},
        {"sku": "FOR-VAL-005", "nombre": "Fororo-Valle-Hondo-400g", "precio_usd": 1.30, "stock": 10, "categoria": "Cereales"},
        {"sku": "HAR-TRI-006", "nombre": "Harina-de-trigo-leudante-900g", "precio_usd": 1.60, "stock": 10, "categoria": "Harinas"},
        {"sku": "LEC-AMA-007", "nombre": "Leche-Amanecer-125g", "precio_usd": 2.50, "stock": 10, "categoria": "Lácteos"},
        {"sku": "LEC-AMA-008", "nombre": "Leche Amanecer 400g", "precio_usd": 7.50, "stock": 10, "categoria": "Lácteos"},
        {"sku": "ACE-VAT-009", "nombre": "Aceite-Vatel-230cm", "precio_usd": 1.30, "stock": 10, "categoria": "Aceites"},
        {"sku": "ACE-POR-010", "nombre": "Aceite-Portumesa-850cm", "precio_usd": 4.00, "stock": 10, "categoria": "Aceites"},
        {"sku": "ACE-VAT-011", "nombre": "Aceite-Vatel-1L", "precio_usd": 4.30, "stock": 10, "categoria": "Aceites"},
        {"sku": "ACE-IDE-012", "nombre": "Aceite-Ideal", "precio_usd": 1.30, "stock": 10, "categoria": "Aceites"},
        {"sku": "MAY-PRE-013", "nombre": "Mayonesa-Premium-445g", "precio_usd": 6.00, "stock": 10, "categoria": "Salsas"},
        {"sku": "SAL-KET-014", "nombre": "Salsa-de-tomate-Ketchup-198g", "precio_usd": 1.55, "stock": 10, "categoria": "Salsas"},
        {"sku": "SAL-PAM-015", "nombre": "Salsa-de-tomate-Pampero 370g", "precio_usd": 1.70, "stock": 10, "categoria": "Salsas"},
        {"sku": "VIN-500-016", "nombre": "Vinagre-500cm", "precio_usd": 1.55, "stock": 10, "categoria": "Condimentos"},
        {"sku": "LEC-BON-017", "nombre": "Leche-Do-Bon-400g", "precio_usd": 3.50, "stock": 10, "categoria": "Lácteos"},
        {"sku": "LEC-BON-018", "nombre": "Leche-Do-Bon-200g", "precio_usd": 2.40, "stock": 10, "categoria": "Lácteos"},
        {"sku": "MAR-PAM-019", "nombre": "Margarina-La-Pampa-225g", "precio_usd": 1.20, "stock": 10, "categoria": "Mantequillas"},
        {"sku": "MAR-PAM-020", "nombre": "Margarina-La-Pampa-450g", "precio_usd": 2.30, "stock": 10, "categoria": "Mantequillas"},
        {"sku": "HAR-YAR-021", "nombre": "Harina-Yaracuy", "precio_usd": 1.10, "stock": 10, "categoria": "Harinas"},
        {"sku": "MAR-MAV-022", "nombre": "Margarina-Mavesa-500g", "precio_usd": 3.75, "stock": 10, "categoria": "Mantequillas"},
        {"sku": "HAR-PAN-023", "nombre": "harina-pan", "precio_usd": 1.90, "stock": 10, "categoria": "Harinas"},
        {"sku": "AZU-KON-024", "nombre": "Azúcar-Konfit-1kg", "precio_usd": 1.90, "stock": 10, "categoria": "Azúcares"},
        {"sku": "SAL-REF-025", "nombre": "Sal-comestible-refinada-400g", "precio_usd": 0.50, "stock": 10, "categoria": "Condimentos"},
        {"sku": "ARR-AMA-026", "nombre": "Arroz-Amanecer-900g", "precio_usd": 1.35, "stock": 10, "categoria": "Arroces"},
        {"sku": "ARR-MAR-027", "nombre": "Arroz-Mary", "precio_usd": 1.60, "stock": 10, "categoria": "Arroces"},
        {"sku": "QUEZ--028", "nombre": "queso", "precio_usd": 1.55, "stock": 10, "categoria": "lacteos"},
        {"sku": "JUG-YUS-029", "nombre": "jugo-Yusti", "precio_usd": 1.35, "stock": 10, "categoria": "Bebidas"},
        {"sku": "AZU-YAR-030", "nombre": "Azúcar-Yaracuy", "precio_usd": 1.60, "stock": 10, "categoria": "Azúcares"},
        {"sku": "AZU-MEL-031", "nombre": "Azúcar-Melao-500g", "precio_usd": 0.60, "stock": 10, "categoria": "Azúcares"},
        {"sku": "CAF-YAR-032", "nombre": "Café-Yaracuy-200g", "precio_usd": 3.00, "stock": 10, "categoria": "Cafés"},
        {"sku": "CAF-YAR-033", "nombre": "Café-Yaracuy-100g", "precio_usd": 1.50, "stock": 10, "categoria": "Cafés"},
        {"sku": "CAF-DEL-034", "nombre": "Café-Della-Nona-200g", "precio_usd": 3.10, "stock": 10, "categoria": "Cafés"},
        {"sku": "CAF-DEL-035", "nombre": "Café-Della-Nona-100g", "precio_usd": 1.55, "stock": 10, "categoria": "Cafés"},
        {"sku": "CAF-AMA-036", "nombre": "Café-Amanecer-100g", "precio_usd": 1.55, "stock": 10, "categoria": "Cafés"},
        {"sku": "CAR-AMA-037", "nombre": "Caraotas-Amanecer-400g", "precio_usd": 1.95, "stock": 10, "categoria": "Granos"},
        {"sku": "JAB-LLA-038", "nombre": "Jabón-Las-Llaves-400g", "precio_usd": 1.65, "stock": 10, "categoria": "Limpieza"},
        {"sku": "JAB-LLA-039", "nombre": "Jabón-Las-Llaves-900g", "precio_usd": 3.30, "stock": 10, "categoria": "Limpieza"},
        {"sku": "SUA-000-040", "nombre": "Suavitel", "precio_usd": 1.40, "stock": 10, "categoria": "Limpieza"},
        {"sku": "JAB-MUL-041", "nombre": "Jabón-de-baño-Multiclean", "precio_usd": 1.00, "stock": 10, "categoria": "Higiene"},
        {"sku": "MAL-PEQ-042", "nombre": "malta", "precio_usd": 0.62, "stock": 10, "categoria": "Bebidas"},
        {"sku": "JUG-PEQ-043", "nombre": "Jugo-de-cartón-pequeño", "precio_usd": 2.20, "stock": 10, "categoria": "Bebidas"},
        {"sku": "CLO-000-044", "nombre": "Cloro", "precio_usd": 1.55, "stock": 10, "categoria": "Limpieza"},
        {"sku": "DES-000-045", "nombre": "Desinfectante", "precio_usd": 1.55, "stock": 10, "categoria": "Limpieza"},
        {"sku": "JAB-ANI-046", "nombre": "Jabón-Anita-pequeño", "precio_usd": 1.50, "stock": 10, "categoria": "Limpieza"},
        {"sku": "PAS-MAK-047", "nombre": "Pasta-de-Diente-Maksim", "precio_usd": 2.00, "stock": 10, "categoria": "Higiene"},
        {"sku": "NUT-000-048", "nombre": "NutriBela", "precio_usd": 1.00, "stock": 10, "categoria": "Higiene"},
        {"sku": "PAN-000-049", "nombre": "Panelada", "precio_usd": 0.75, "stock": 10, "categoria": "Dulces"},
        {"sku": "PAN-BAB-050", "nombre": "Pañales-Baby-Finger-18und", "precio_usd": 5.60, "stock": 10, "categoria": "Higiene"},
        {"sku": "TOL-ALI-051", "nombre": "Toallas-Femeninas-Alive-8pcs", "precio_usd": 1.70, "stock": 10, "categoria": "Higiene"},
        {"sku": "COL-XTR-052", "nombre": "Colgate-Xtra-Blancura", "precio_usd": 4.50, "stock": 10, "categoria": "Higiene"},
        {"sku": "COL-MEN-053", "nombre": "Colgate-Menta-Original", "precio_usd": 3.70, "stock": 10, "categoria": "Higiene"}
    ],

// =========================================================================
// BLOQUE 2: MAQUETADO DE CONTENEDORES Y ESTRUCTURA DE LA GRILLA (REPARADO)
// =========================================================================
    render() {
        // 1. Contenedor Maestro con la identidad oscura absoluta de Apio (#0B0E14)
        const section = document.createElement('div');
        section.className = "home-container";
        section.style.minHeight = "100vh";
        section.style.display = "flex";
        section.style.flexDirection = "column";

        // 2. Inyección del Header Maestro directamente en el flujo vertical de la sección
        if (window.App && typeof window.App.renderMasterHeader === 'function') {
            section.appendChild(window.App.renderMasterHeader());
        } else if (window.Home && typeof window.Home.renderMasterHeader === 'function') {
            section.appendChild(window.Home.renderMasterHeader());
        }

        // 3. Contenedor de Contenido Central Rígido
        const mainContent = document.createElement('main');
        mainContent.style.flex = "1";
        mainContent.style.padding = "24px";
        mainContent.style.backgroundColor = "#0B0E14";
        mainContent.style.boxSizing = "border-box";
        
        mainContent.innerHTML = `
            <div style="margin-bottom: 20px;">
                <p style="color: #64748b; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin: 0;">Módulo de Distribución y Venta al Mayor</p>
                <h1 style="color: #ffffff; font-size: 28px; font-weight: 800; margin: 4px 0 0 0; letter-spacing: -0.5px;">Catálogo de Productos</h1>
            </div>
            
            <!-- Grid de 4 Columnas del prototipo de enero donde se inyectarán las tarjetas -->
            <div id="contenedor-articulos-b2b" class="categories-amazon-grid-fallback"></div>
        `;
        section.appendChild(mainContent);

    // Capturamos el nodo interno de la grilla para que el Bloque 3 inyecte las tarjetas allí
        const gridProductos = mainContent.querySelector('#contenedor-articulos-b2b');

                // =========================================================================
        // INTERCEPTOR ASÍNCRONO DE DATOS EN CALIENTE (APIO POS ENGINE - REPARADO)
        // =========================================================================
        // Limpiamos los productos del renderizado anterior para evitar duplicados
        if (gridProductos) gridProductos.innerHTML = '';

        // 🎯 CORE COUPLING SOTO SYSTEM: Acoplamiento elástico bidireccional para el ejecutable .exe
        // Evaluamos estrictamente si el filtro global está activo y contiene renglones buscados.
        // Si el estado es null o viene vacío, el sistema inyecta tus 53 productos nativos de 'this.productos'
        const datosOrigen = (window.App && window.App.state && window.App.state.productosFiltrados !== null && window.App.state.productosFiltrados !== undefined)
            ? window.App.state.productosFiltrados
            : (this.productos || window.App?.state?.listaProductosOriginal || []);

        console.log(`📡 [SOTO SYSTEM]: Sincronizando grilla del catálogo con ${datosOrigen.length} víveres en la RAM.`);

        // =========================================================================
        // BLOQUE 3: BUCLE MAESTRO - CON COBERTURA DE NOMENCLATURA TOTAL (REPARADO)
        // =========================================================================
        gridProductos.innerHTML = ''; 

        datosOrigen.forEach(prod => {
            const tarjeta = document.createElement('div');
            tarjeta.className = "amazon-card-fallback";
            
            // 1. Saneamos el string original para las rutas físicas
            const nombreLimpio = prod.nombre ? prod.nombre.trim() : "";
            const skuLimpio = prod.sku ? prod.sku.trim() : "";
            
            // 🚀 ARMA SECRETA SOTO SYSTEM: Mapeamos los dos formatos de archivos que tienes en assets
            const nombreConGuionesOriginal = nombreLimpio.replace(/\s+/g, '-'); // Mantiene "Harina-Yaracuy"
            const nombreConGuionesMinuscula = nombreLimpio.toLowerCase().replace(/\s+/g, '-'); // "harina-yaracuy"
            
            // Construimos las contingencias encadenadas para el .exe autónomo
            const rutaJpg = `./assets/${nombreConGuionesOriginal}.jpg`; // 🎯 Muerde tu formato actual
            const rutaPng = `./assets/${nombreConGuionesOriginal}.png`;
            const rutaMinusculas = `./assets/${nombreConGuionesMinuscula}.jpg`; // Match con la Harina Pan
            const rutaSku = `./assets/${skuLimpio.toLowerCase()}.jpg`;

            // Mantén el nombre a mostrar limpio con espacios para el texto del <h3>
            const nombreMostrar = nombreLimpio.replace(/-/g, ' ');

            tarjeta.innerHTML = `
                <div>
                    <!-- Área de visualización del producto con fondo blanco puro -->
                    <div style="width: 100%; height: 140px; display: flex; align-items: center; justify-content: center; background: #ffffff; margin-bottom: 12px; position: relative; overflow: hidden;">
                        
                        <!-- Foto Principal: Visible por defecto (display: block) -->
                        <img id="img-${skuLimpio}" src="${rutaJpg}" alt="${nombreLimpio}" 
                            style="max-height: 100%; max-width: 100%; object-fit: contain; display: block !important; transition: transform 0.3s ease-out; will-change: transform;">

                        <!-- CONTINGENCIA: Oculto por defecto (display: none), SOLO se enciende si la foto falla de verdad -->
                        <div id="fallback-${skuLimpio}" style="width: 70px; height: 70px; border-radius: 8px; background: #e2e8f0; display: none; align-items: center; justify-content: center; font-weight: 800; color: #475569; font-size: 24px; font-family: sans-serif; margin: 0 auto;">
                            ${nombreLimpio.charAt(0).toUpperCase()}
                        </div>

                        <!-- SKU fiscal visible -->
                        <span style="position: absolute; bottom: 4px; right: 4px; background: #f1f5f9; color: #475569; font-size: 9px; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-weight: 700; z-index: 2;">
                            ${skuLimpio}
                        </span>
                    </div>

                    <!-- Badge de categoría comercial -->
                    <span style="font-size: 10px; font-weight: 700; color: #ea580c; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 4px;">
                        ${prod.categoria}
                    </span>

                    <h3 style="margin: 0 0 6px 0; font-size: 13px; font-weight: 700; line-height: 1.4; color: #111827; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; height: 36px;">
                        ${nombreMostrar}
                    </h3>
                </div>

                <!-- Bloque inferior de Precios y Acciones Comerciales -->
                <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #f1f5f9;">
                    <div style="margin-bottom: 12px;">
                        <span style="font-size: 9px; text-transform: uppercase; color: #94a3b8; font-weight: 700; display: block;">Precio Mayorista</span>
                        <div style="display: flex; align-items: baseline; color: #111827;">
                            <span style="font-size: 11px; font-weight: 700; margin-right: 1px;">$</span>
                            <span style="font-size: 22px; font-weight: 800; letter-spacing: -0.5px; line-height: 1;">${Math.floor(prod.precio_usd)}</span>
                            <span style="font-size: 11px; font-weight: 700; align-self: flex-start; margin-top: 1px;">.${(prod.precio_usd % 1).toFixed(2).substring(2)}</span>
                            <span style="font-size: 10px; color: #64748b; font-weight: 500; margin-left: 4px;">USD</span>
                        </div>
                    </div>

                    <!-- Caja de controles de pedidos B2B -->
                    <div style="display: flex; gap: 6px;">
                        <input type="number" min="1" value="1" max="${prod.stock}" id="vol-${skuLimpio}"
                            style="width: 45px; text-align: center; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 12px; font-weight: 700; background: #f8fafc; color: #000000; outline: none; box-sizing: border-box;">
                        
                        <button onclick="CatalogoB2B.añadirAlPedido('${skuLimpio}')"
                            style="flex: 1; background: #2563EB; color: #ffffff; border: none; padding: 8px; border-radius: 6px; font-size: 10px; font-weight: 700; text-transform: uppercase; cursor: pointer; transition: background-color 0.2s;">
                            Añadir
                        </button>
                    </div>
                </div>
            `;

            gridProductos.appendChild(tarjeta);

            // =========================================================================
            // GESTIÓN ASÍNCRONA DE IMÁGENES Y EFECTOS HOVER (RECALIBRADO)
            // =========================================================================
            const imagenElemento = tarjeta.querySelector(`#img-${skuLimpio}`);
            const fallbackElemento = tarjeta.querySelector(`#fallback-${skuLimpio}`);

            if (imagenElemento) {
                tarjeta.addEventListener('mouseenter', () => {
                    if (imagenElemento.style.display !== 'none') {
                        imagenElemento.style.transform = 'scale(1.08)'; 
                    }
                });

                tarjeta.addEventListener('mouseleave', () => {
                    if (imagenElemento.style.display !== 'none') {
                        imagenElemento.style.transform = 'scale(1)'; 
                    }
                });

                imagenElemento.addEventListener('error', function manejadorErrores() {
                    const srcActual = imagenElemento.getAttribute('src');

                    // 🛡️ CASCADA INDESTRUCTIBLE: Si falla una ruta, salta a la siguiente
    if (srcActual === rutaJpg) {
        imagenElemento.setAttribute('src', rutaPng);
    } 
    else if (srcActual === rutaPng) {
        imagenElemento.setAttribute('src', rutaMinusculas);
    } 
    else if (srcActual === rutaMinusculas) {
        imagenElemento.setAttribute('src', rutaSku);
    }
    else {
        // 🚀 CIERRE DE SEGURIDAD ABSOLUTO: 
        // Eliminamos de raíz el uso de 'rutaSkuPng' para que nunca más dé ReferenceError.
        // Si ninguna opción de archivo físico responde, ocultamos la img y encendemos el cuadro gris.
        imagenElemento.style.display = 'none';
        if (fallbackElemento) {
            fallbackElemento.style.display = 'flex';
        }
        imagenElemento.removeEventListener('error', manejadorErrores);
    }
});
            }
        });

// =========================================================================
// 📡 ANTENA DE ESCUCHA GLOBAL MULTIPERFIL - SOTO SYSTEM (SOLUCIÓN CATÁLOGO FIJO)
// Ubicación: Módulo de Enlace de Entrada (home.js / App.js)
// =========================================================================

// 🎯 INTERRUPTOR MAESTRO: Cámbialo a "ROPA" para la Boutique o "BODEGA" para los víveres
const MODALIDAD_TIENDA_ACTIVA = "ROPA"; 

window.inyectarBusquedaDesdeDaniela = function(textoVoz) {
    const barraInput = document.querySelector('.search-core-input');
    
    // Saneamos la cadena de texto cruda recibida
    const terminoLimpio = textoVoz ? textoVoz.trim() : "";
    
    console.log(`📡 [SOTO CORE INTERRUPTOR]: Procesando término elástico -> "${terminoLimpio}" en modalidad [${MODALIDAD_TIENDA_ACTIVA}]`);

    if (barraInput) {
        barraInput.value = terminoLimpio;
        barraInput.focus();
    }

    // 1. Sincronizamos de forma inmediata el término en el estado core global de la SPA
    if (!window.App) window.App = {};
    if (!window.App.state) window.App.state = {};
    
    window.App.state.ultimoTerminoBuscado = terminoLimpio;

    // 2. ⏱️ GATILLO DE ACCESO ULTRA-RÁPIDO DIRECTO A LA RED DE DJANGO
    // 🎯 REPARACIÓN DE SUBDOMINIO: Corregido 'software' con la ortografía real de internet
    let backendBase = 'https://apio-ecomerce-software-b2b-sotosystem-production.up.railway.app';

    // Si el campo cae a un silencio total o borrado de letras, restauramos los productos
    if (terminoLimpio.length === 0) {
        window.App.state.productosFiltrados = null;
        window.App.state.ultimoTerminoBuscado = "";
        
        // Le gritamos a la grilla del catálogo que re-renderice la visual completa en caliente
        if (typeof window.recalcularGrillaCatalogoB2BEnCaliente === 'function') {
            window.recalcularGrillaCatalogoB2BEnCaliente();
        } else if (typeof window.App.render === 'function') {
            window.App.render();
        }
        return;
    }

        // Si trae texto (sea tecleado o por voz), disparamos la ráfaga telemétrica nativa
    window.fetch(urlFinalBuscador)
        .then(response => {
            if (!response.ok) throw new Error("Rebote de red en Django Status: " + response.status);
            return response.json();
        })
        .then(data => {
            let arregloExtraido = [];

            // 🎯 ESCUDO ELÁSTICO DE PROCESAMIENTO MULTIFORMATO
            if (Array.isArray(data)) {
                // Formato Plano Definitivo (El de tu views actual): [ ... ]
                arregloExtraido = data;
            } else if (data && Array.isArray(data.productos)) {
                // Formato Estructurado: { "productos": [...] }
                arregloExtraido = data.productos;
            } else if (data && Array.isArray(data.data)) {
                // Fallback de contingencia: { "data": [...] }
                arregloExtraido = data.data;
            }

            console.log(`📊 [SOTO FRONT REPAIR]: Lote asimilado. Elementos en RAM -> ${arregloExtraido.length}`);

            // Guardamos el arreglo real extraído en la memoria global de la suite
            window.App.state.productosFiltrados = arregloExtraido;

            // 🎯 ¡LA VICTORIA ATÓMICA REACCIONARIA!
            if (typeof window.recalcularGrillaCatalogoB2BEnCaliente === 'function') {
                window.recalcularGrillaCatalogoB2BEnCaliente();
                
                // Devolvemos el foco y colocamos el cursor al final de la palabra para escritura fluida
                const inputRecargado = document.querySelector('.search-core-input');
                if (inputRecargado) {
                    inputRecargado.focus();
                    // Colocamos un Try/Catch por si el elemento se re-renderiza rápido en el DOM
                    try {
                        inputRecargado.setSelectionRange(terminoLimpio.length, terminoLimpio.length);
                    } catch(e) {}
                }
            } else if (typeof window.App.render === 'function') {
                window.App.render();
            }
        })
        .catch(err => console.error("❌ [SOTO BUSCADOR CONTINGENCIA CRÍTICA]:", err.message));
};


// =========================================================================
// BLOQUE 4: ACOPLE DE LA IA DANIELA, RECUPERACIÓN DEL FOOTER Y EXPORTACIÓN
// =========================================================================
        // 1. Inyección automática del Asistente de IA Daniela Widget (¡Aquí se enciende el Home!)
        if (window.Home && typeof window.Home.renderDanielaWidget === 'function') {
            section.appendChild(window.Home.renderDanielaWidget());
        } else if (typeof Home.renderDanielaWidget === 'function') {
            section.appendChild(Home.renderDanielaWidget()); // Llamada directa al objeto importado arriba
        }

        // === PARCHE 2: INYECTAR EL FOOTER DEL HOME (¡Aquí también se enciende el Home!) ===
        if (typeof Home.renderFooter === 'function') {
            section.appendChild(Home.renderFooter()); // Al usarlo aquí, la línea 4 se iluminará de inmediato
        } else if (window.Home && typeof window.Home.renderFooter === 'function') {
            section.appendChild(window.Home.renderFooter());
        } else {
            console.warn("Soto System Admin: Footer institucional no detectado en Home.");
        }

        return section;
    },

    // 2. Manejador comercial conectado directamente al estado reactivo de App.js
    añadirAlPedido(sku) {
        const inputVolumen = document.getElementById(`vol-${sku}`);
        if (!inputVolumen) return;

        const cantidad = parseInt(inputVolumen.value);
        const producto = this.productos.find(p => p.sku === sku);

        if (!producto || cantidad <= 0) return;

        const itemExistente = App.state.carrito.find(item => item.sku === sku);
        
        if (itemExistente) {
            itemExistente.cantidad += cantidad;
        } else {
            App.state.carrito.push({
                sku: producto.sku,
                nombre: producto.nombre,
                precio: producto.precio_usd,
                cantidad: cantidad
            });
        }

        alert(`¡Añadido al pedido! ${cantidad} unidades de "${producto.nombre}".`);
        console.log("Estado de la orden de compra Apio B2B:", App.state.carrito);
    }
};

// Vinculamos al entorno global window para que App.js y los eventos onclick lo detecten de inmediato
window.CatalogoB2B = CatalogoB2B;
export { CatalogoB2B };
