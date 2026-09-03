import os
import json
import django

# =========================================================================
# 🚀 SOTO SYSTEM BODEGA SEEDER - COMPUERTA DINÁMICA HÍBRIDA (2026)
# Ubicación: seed.py (Raíz del Proyecto)
# =========================================================================

CLAVE_MAESTRA = "gkfDbFUktFKmVUVIDxgujQVjlDtaJVbP"

# 🎯 DETECTOR INTELIGENTE DE ENTORNO SOTO SYSTEM:
# Si el script corre en la nube de Railway, existirá la variable RAILWAY_ENVIRONMENT_PROXY o similar, 
# o simplemente hereda la red interna. Evaluamos la presencia de red interna mediante os.environ
if os.environ.get('RAILWAY_STATIC_URL') or os.environ.get('DATABASE_URL') and "internal" in os.environ.get('DATABASE_URL', ''):
    print("📡 [SOTO CORE]: Conexión Cloud Forzada. Conectando por la red interna nativa...")
    HOST_FINAL = "postgres.railway.internal"
    PUERTO_FINAL = "5432"
else:
    print("💻 [SOTO CORE]: Conexión desde Laptop Detectada. Redirigiendo a través del Proxy Público...")
    HOST_FINAL = "thomas.proxy.rlwy.net"
    PUERTO_FINAL = "18806"

# 🎚️ Inyección simétrica en las variables del sistema antes de inicializar Django
os.environ['PGPASSWORD'] = CLAVE_MAESTRA
os.environ['PGHOST'] = HOST_FINAL
os.environ['PGPORT'] = PUERTO_FINAL
os.environ['PGUSER'] = "postgres"
os.environ['PGDATABASE'] = "railway"
os.environ['DATABASE_URL'] = f"postgresql://postgres:{CLAVE_MAESTRA}@{HOST_FINAL}:{PUERTO_FINAL}/railway"

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

def sembrar_catalogo_viveres_exclusivo():
    from bodega.models import Producto, Categoria

    print("⚡ [SOTO CLOUD CORE]: Iniciando operación de sembrado masivo de inventario...")
    
    ruta_json = os.path.join(os.path.dirname(__file__), 'bodega', 'untas.json')
    if not os.path.exists(ruta_json):
        ruta_json = os.path.join(os.path.dirname(__file__), 'untas.json')

    try:
        with open(ruta_json, 'r', encoding='utf-8') as archivo:
            datos_productos = json.load(archivo)
            
        conteo_previo = Producto.objects.count()
        Producto.objects.all().delete()
        print(f"🗑️ Purgando la tabla bodega_producto. Eliminados: {conteo_previo}")

        conteo_exitoso = 0

        for item in datos_productos:
            sku_limpio = str(item.get('sku', '')).strip().upper()
            nombre_prod = str(item.get('nombre', 'Producto sin Nombre')).strip()
            precio = float(item.get('precio_usd', 0.0) or item.get('precio', 0.0))
            inventario = int(item.get('stock', 0) or item.get('cantidad', 0))
            texto_categoria = str(item.get('categoria', 'General')).strip()

            if not sku_limpio:
                continue

            categoria_obj, _ = Categoria.objects.get_or_create(nombre=texto_categoria)

            nuevo_producto = Producto(
                sku=sku_limpio,
                nombre=nombre_prod,
                categoria=categoria_obj,
                precio_usd=precio,
                stock=inventario
            )
            
            nuevo_producto.save()
            conteo_exitoso += 1
            print(f"📥 [{conteo_exitoso}/53] Grabado exitoso en PostgreSQL Cloud -> SKU: {sku_limpio}")

        print(f"\n🏆 [OPERACIÓN CONCLUIDA CON ÉXITO]: {conteo_exitoso} productos brillando en la nube de Railway.")

    except Exception as e:
        print(f"❌ [CRASH EN SEEDER]: Falló la molienda del JSON -> {str(e)}")

if __name__ == '__main__':
    sembrar_catalogo_viveres_exclusivo()
