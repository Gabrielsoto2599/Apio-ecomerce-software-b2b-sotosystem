import os
import json
import django

# =========================================================================
# 🚀 SOTO SYSTEM BODEGA SEEDER - PRODUCCIÓN INMUTABLE POSTGRESQL (2026)
# Ubicación: seed.py (Raíz del Proyecto)
# =========================================================================

# 🎯 ENLACE ATÓMICO CLOUD: Conexión forzada externa a PostgreSQL Railway
# 🎯 ENLACE ATÓMICO EXTERNO CORPORATIVO SOTO SYSTEM (ALINEADO CON TU PANEL)
CLAVE_MAESTRA = "gkfDbFUktFKmVUVIDxgujQVjlDtaJVbP"
HOST_PUBLICO = "thomas.proxy.rlwy.net"  
PUERTO_PUBLICO = "18806"                

# Si corres el script localmente en tu laptop, le inyectamos la cañería pública de red
if not os.environ.get('DATABASE_URL'):
    os.environ['DATABASE_URL'] = f"postgresql://postgres:{CLAVE_MAESTRA}@{HOST_PUBLICO}:{PUERTO_PUBLICO}/railway"

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

# Inicialización obligatoria del entorno de Django
django.setup()

from bodega.models import Producto, Categoria

def sembrar_catalogo_viveres_exclusivo():
    print("☁️ [SOTO CENTRAL]: Forzando puente telemétrico hacia PostgreSQL Cloud en Railway...")
    
    # Localización de la ruta elástica del untas.json
    ruta_json = os.path.join(os.path.dirname(__file__), 'bodega', 'untas.json')
    if not os.path.exists(ruta_json):
        ruta_json = os.path.join(os.path.dirname(__file__), 'untas.json')

    if not os.path.exists(ruta_json):
        print(f"❌ Error Crítico: No se encontró el archivo maestro untas.json en la PC.")
        return

    print(f"📦 Archivo maestro localizado con éxito en: {ruta_json}")

    try:
        with open(ruta_json, 'r', encoding='utf-8') as archivo:
            datos_productos = json.load(archivo)
            
        # Purgamos las tablas remotas de PostgreSQL en internet antes de la molienda
        conteo_previo = Producto.objects.count()
        Producto.objects.all().delete()
        print(f"🗑️ Tabla Producto en PostgreSQL remota purgada. Se eliminaron {conteo_previo} registros anteriores.")

        productos_a_crear = []
        conteo_exitoso = 0

        # Iteramos el cargamento de víveres del untas.json
        for item in datos_productos:
            sku_limpio = str(item.get('sku', '')).strip().upper()
            nombre_prod = str(item.get('nombre', 'Producto sin Nombre')).strip()
            precio = float(item.get('precio_usd', 0.0) or item.get('precio', 0.0))
            inventario = int(item.get('stock', 0) or item.get('cantidad', 0))
            texto_categoria = str(item.get('categoria', 'General')).strip()

            if not sku_limpio:
                continue

            # Escudo de Llave Foránea Adaptativo (Crea o recupera la categoría en la nube)
            categoria_obj, creado = Categoria.objects.get_or_create(
                nombre=texto_categoria
            )

            # Instancia estructurada con las columnas reales de tu base de datos de producción
            nuevo_producto = Producto(
                sku=sku_limpio,
                nombre=nombre_prod,
                categoria=categoria_obj,
                precio_usd=precio,
                stock=inventario
            )
            productos_a_crear.append(nuevo_producto)
            conteo_exitoso += 1

        # Inyección masiva e instantánea por lote (Bulk Create) en la nube pública
        if productos_a_crear:
            Producto.objects.bulk_create(productos_a_crear)
            print(f"🏆 ¡SIEMBRA COMPLETADA EN LA NUBE! -> Se inyectaron {conteo_exitoso} víveres reales en PostgreSQL Railway.")
        else:
            print("⚠️ Advertencia: El archivo json no contenía registros válidos para sembrar.")

    except Exception as e:
        print(f"❌ [CRASH EN SEEDER]: Falló la inyección en la nube -> {str(e)}")

if __name__ == '__main__':
    sembrar_catalogo_viveres_exclusivo()
