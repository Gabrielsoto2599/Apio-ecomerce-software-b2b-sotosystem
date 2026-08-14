import os
import json
import django

# 🚀 DESPIERTA EL ENTORNO DE DJANGO
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from bodega.models import Producto, Categoria

def cargar_inventario():
    # 📁 Ubicación exacta de tu archivo de datos (apunta a bodega/untas.json)
    ruta_json = os.path.join(os.path.dirname(__file__), 'bodega', 'untas.json')
    
    if not os.path.exists(ruta_json):
        print(f"❌ Error: No se encontró el archivo JSON en la ruta: {ruta_json}")
        return

    try:
        print('--- 📡 Iniciando inyección atómica de datos en Railway Cloud (2026) ---')
        with open(ruta_json, 'r', encoding='utf-8') as f:
            productos_json = json.load(f)

        conteo_nuevos = 0
        for prod in productos_json:
            # 1. Aseguramos la existencia de la Categoría en Postgres para evitar conflictos de ForeignKey
            nombre_cat = prod.get('categoria', 'General').strip()
            categoria_obj, _ = Categoria.objects.get_or_create(nombre=nombre_cat)

            # 2. Inyección con control anti-duplicados usando el SKU como pivote
            producto_obj, creado = Producto.objects.get_or_create(
                sku=prod['sku'].strip(),
                defaults={
                    'nombre': prod['nombre'].strip(),
                    'precio_usd': float(prod['precio_usd']),
                    'stock': int(prod['stock']),
                    'categoria': categoria_obj
                }
            )

            if creado:
                conteo_nuevos += 1
                print(f"✅ Indexado en RAM: {producto_obj.nombre} [{producto_obj.sku}]")

        print("----------------------------------------------------------------")
        print(f"🏆 ¡ÉXITO TOTAL! Se procesaron {len(productos_json)} artículos.")
        print(f"🚀 {conteo_nuevos} productos nuevos inyectados directo en la base de datos cloud.")
        print("----------------------------------------------------------------")

    except Exception as e:
        print(f"❌ CRASH EN EL PROCESO: {str(e)}")

if __name__ == '__main__':
    cargar_inventario()
