import os
import json
import django

# =========================================================================
# 🚀 SOTO SYSTEM BODEGA SEEDER - RECALIBRACIÓN EXCLUSIVA DE VÍVERES (2026)
# Ubicación: bodega/seed.py
# =========================================================================

# 1. Inicialización obligatoria del entorno de Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sotosystem.settings') # Cambia 'sotosystem' por el nombre de tu proyecto si difiere
django.setup()

from bodega.models import Producto

def sembrar_catalogo_viveres_exclusivo():
    # Ruta absoluta segura hacia tu archivo maestro de abasto
    ruta_json = os.path.join(os.path.dirname(__file__), 'untas.json')
    
    print("📡 [SOTO SEEDER]: Iniciando purga y siembra masiva en PostgreSQL Cloud...")
    
    if not os.path.exists(ruta_json):
        print(f"❌ Error Crítico: No se encontró el archivo maestro en la ruta -> {ruta_json}")
        return

    try:
        with open(ruta_json, 'r', encoding='utf-8') as archivo:
            datos_productos = json.load(archivo)
            
        # 🛡️ PROTECCIÓN DE PATRIMONIO: Limpiamos los productos viejos para evitar duplicación de registros
        conteo_previo = Producto.objects.count()
        Producto.objects.all().delete()
        print(f"🗑️ Base de datos purgada con éxito. Se eliminaron {conteo_previo} registros anteriores.")

        productos_a_crear = []
        conteo_exitoso = 0

        # Mapeamos e iteramos el cargamento de víveres del untas.json
        for item in datos_productos:
            sku_limpio = str(item.get('sku', '')).strip().upper()
            nombre_prod = str(item.get('nombre', 'Producto sin Nombre')).strip()
            cat_prod = str(item.get('categoria', 'General')).strip()
            precio = float(item.get('precio_usd', 0.0) or item.get('precio', 0.0))
            inventario = int(item.get('stock', 0) or item.get('cantidad', 0))

            if not sku_limpio:
                continue

            # Creamos la instancia inmutable apuntando estrictamente a la modalidad de la Bodega
            nuevo_producto = Producto(
                sku=sku_limpio,
                nombre=nombre_prod,
                categoria=cat_prod,
                precio_usd=precio,
                stock=inventario,
                tipo_negocio='BODEGA', # Forzado para evitar colisiones con ropa
                activo=True
            )
            productos_a_crear.append(nuevo_producto)
            conteo_exitoso += 1

        # ⚡ INYECCIÓN BULK: Guarda los 53 víveres en Railway en un solo milisegundo
        if productos_a_crear:
            Producto.objects.bulk_create(productos_a_crear)
            print(f"🏆 ¡SIEMBRA COMPLETADA CON ÉXITO! -> Se inyectaron {conteo_exitoso} víveres en Railway Cloud.")
        else:
            print("⚠️ Advertencia: El archivo untas.json no contenía registros válidos para sembrar.")

    except Exception as e:
        print(f"❌ [CRASH EN SEEDER]: Falló la molienda del JSON o la conexión de red -> {str(e)}")

if __name__ == '__main__':
    sembrar_catalogo_viveres_exclusivo()
