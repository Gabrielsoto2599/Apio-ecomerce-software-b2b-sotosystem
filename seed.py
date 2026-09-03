import os
import json
import django

# =========================================================================
# 🚀 SOTO SYSTEM BODEGA SEEDER - INYECCIÓN EXPLÍCITA INDESTRUCTIBLE (2026)
# Ubicación: seed.py (Raíz del Proyecto)
# =========================================================================

# Establecemos las credenciales públicas que verificamos en el panel de Railway
CLAVE_MAESTRA = "gkfDbFUktFKmVUVIDxgujQVjlDtaJVbP"
HOST_PRODUCCION = "postgres.railway.internal"  # Red interna nativa de la nube
PUERTO_PRODUCCION = "5432"

# 🎯 BLINDAJE TELEMÉTRICO: Forzamos el puente de red en las variables del sistema
os.environ['PGPASSWORD'] = CLAVE_MAESTRA
os.environ['PGHOST'] = HOST_PRODUCCION
os.environ['PGPORT'] = PUERTO_PRODUCCION
os.environ['PGUSER'] = "postgres"
os.environ['PGDATABASE'] = "railway"

# Forzamos la cadena unificada para cualquier submódulo que la consuma
os.environ['DATABASE_URL'] = f"postgresql://postgres:{CLAVE_MAESTRA}@{HOST_PRODUCCION}:{PUERTO_PRODUCCION}/railway"

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

def sembrar_catalogo_viveres_exclusivo():
    from bodega.models import Producto, Categoria

    print("📡 [SOTO CLOUD CORE]: Iniciando operación de sembrado directo e impositivo en PostgreSQL...")
    
    # Localizamos el archivo untas.json en el contenedor Linux de Railway
    ruta_json = os.path.join(os.path.dirname(__file__), 'bodega', 'untas.json')
    if not os.path.exists(ruta_json):
        ruta_json = os.path.join(os.path.dirname(__file__), 'untas.json')

    try:
        with open(ruta_json, 'r', encoding='utf-8') as archivo:
            datos_productos = json.load(archivo)
            
        conteo_previo = Producto.objects.count()
        
        # Purgamos la tabla real conectada
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

            # Mapeamos la relación de la Llave Foránea
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

        print(f"\n🏆 [OPERACIÓN CONCLUIDA CON ÉXITO]: {conteo_exitoso} productos brillando de forma remota.")

    except Exception as e:
        print(f"❌ [CRASH EN SEEDER]: Falló la molienda del JSON -> {str(e)}")

if __name__ == '__main__':
    sembrar_catalogo_viveres_exclusivo()
