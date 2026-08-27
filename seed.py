import os
import json
import django

# =========================================================================
# 🚀 SOTO SYSTEM BODEGA SEEDER - EXCLUSIVO VÍVERES PURIFICADO (2026)
# Ubicación: seed.py (Raíz del Proyecto)
# =========================================================================

CLAVE_MAESTRA = "gkfDbFUktFKmVUVIDxgujQVjlDtaJVbP"
HOST_PUBLICO = "thomas.proxy.rlwy.net"  
PUERTO_PUBLICO = "18806"                

if not os.environ.get('DATABASE_URL'):
    os.environ['DATABASE_URL'] = f"postgresql://postgres:{CLAVE_MAESTRA}@{HOST_PUBLICO}:{PUERTO_PUBLICO}/railway"

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

def sembrar_catalogo_viveres_exclusivo():
    from bodega.models import Producto, Categoria

    print("☁️ [SOTO CENTRAL]: Iniciando carga explícita uno por uno en la nube...")
    
    ruta_json = os.path.join(os.path.dirname(__file__), 'bodega', 'untas.json')
    if not os.path.exists(ruta_json):
        ruta_json = os.path.join(os.path.dirname(__file__), 'untas.json')

    try:
        with open(ruta_json, 'r', encoding='utf-8') as archivo:
            datos_productos = json.load(archivo)
            
        conteo_previo = Producto.objects.count()
        Producto.objects.all().delete()
        print(f"🗑️ Tabla purgada en PostgreSQL. Se eliminaron {conteo_previo} registros.")

        conteo_exitoso = 0

        # 🎯 SIEMBRA PURA DE VÍVERES: Libre de variables muertas de ropa
        for item in datos_productos:
            sku_limpio = str(item.get('sku', '')).strip().upper()
            nombre_prod = str(item.get('nombre', 'Producto sin Nombre')).strip()
            precio = float(item.get('precio_usd', 0.0) or item.get('precio', 0.0))
            inventario = int(item.get('stock', 0) or item.get('cantidad', 0))
            texto_categoria = str(item.get('categoria', 'General')).strip()

            if not sku_limpio:
                continue

            categoria_obj, creado = Categoria.objects.get_or_create(nombre=texto_categoria)

            # Instanciamos el producto acoplando estrictamente tus campos reales de la laptop
            nuevo_producto = Producto(
                sku=sku_limpio,
                nombre=nombre_prod,
                categoria=categoria_obj,
                precio_usd=precio,
                stock=inventario
            )
            
            nuevo_producto.save()
            conteo_exitoso += 1
            print(f"📥 [{conteo_exitoso}/53] Sembrado con éxito en Railway -> SKU: {sku_limpio} | {nombre_prod}")

        print(f"\n🏆 ¡SIEMBRA VISUAL COMPLETADA! -> {conteo_exitoso} víveres reales brillando en PostgreSQL Cloud.")

    except Exception as e:
        print(f"❌ [CRASH EN SEEDER]: Falló la inyección -> {str(e)}")

if __name__ == '__main__':
    sembrar_catalogo_viveres_exclusivo()
