import os
import json
import django

# =========================================================================
# 🚀 SOTO SYSTEM BODEGA SEEDER - BYPASS DE INYECCIÓN DIRECTA CLOUD (2026)
# Ubicación: seed.py (Raíz del Proyecto)
# =========================================================================

# 🎯 FORZAMOS LA RED INTERNA NATIVA DE RAILWAY:
# Si el contenedor corre en internet, hereda DATABASE_URL del sistema en automático.
# Si corres en la laptop, le pasamos tus credenciales públicas de resguardo.
if not os.environ.get('DATABASE_URL'):
    CLAVE_MAESTRA = "gkfDbFUktFKmVUVIDxgujQVjlDtaJVbP"
    HOST_PUBLICO = "thomas.proxy.rlwy.net"  
    PUERTO_PUBLICO = "18806"                
    os.environ['DATABASE_URL'] = f"postgresql://postgres:{CLAVE_MAESTRA}@{HOST_PUBLICO}:{PUERTO_PUBLICO}/railway"

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

def sembrar_catalogo_viveres_exclusivo():
    from bodega.models import Producto, Categoria

    print("📡 [SOTO CLOUD CORE]: Iniciando operación de sembrado directo en la máquina virtual...")
    
    # Mapeamos la ruta física exacta del JSON adentro del contenedor Linux de Railway
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

            # Usamos un guion bajo para indicarle a VS Code que descartamos intencionalmente el booleano
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
            print(f"📥 [{conteo_exitoso}/53] Grabado en PostgreSQL Cloud -> SKU: {sku_limpio}")

        print(f"\n🏆 [OPERACIÓN CONCLUIDA CON ÉXITO]: {conteo_exitoso} productos vivos en producción.")

    except Exception as e:
        print(f"❌ [CRASH EN SEEDER]: {str(e)}")

if __name__ == '__main__':
    sembrar_catalogo_viveres_exclusivo()
