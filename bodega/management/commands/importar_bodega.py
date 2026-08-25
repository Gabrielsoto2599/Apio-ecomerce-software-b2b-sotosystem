import os
import json
from django.core.management.base import BaseCommand
from bodega.models import Categoria, Producto, TasaCambio

class Command(BaseCommand):
    help = 'Importa los 53 productos del catálogo base del sistema Apio usando untas.json'

    def handle(self, *args, **options):
        # 🎯 CORE REPAIR: Apuntamos milimétricamente al archivo real untas.json en la carpeta bodega
        ruta_base = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
        ruta_json = os.path.join(ruta_base, 'bodega', 'untas.json')
        
        if not os.path.exists(ruta_json):
            self.stdout.write(self.style.ERROR(f"Error: No encontré el archivo '{ruta_json}'."))
            return

        with open(ruta_json, 'r', encoding='utf-8') as archivo:
            items = json.load(archivo)
        
        self.stdout.write(self.style.SUCCESS("=== Saneando y Restaurando Catálogo en soto_system_db ==="))
        
        # Sembramos la tasa inicial de forma segura respetando el manejo manual diario
        TasaCambio.objects.get_or_create(id=1, defaults={'precio_bcv': 0.00})
        
        conteo = 0
        for item in items:
            categoria_obj, _ = Categoria.objects.get_or_create(
                nombre=item['categoria'].strip()
            )
            
            # Forzamos la actualización de la columna tipo_negocio estrictamente a BODEGA
            producto_obj, creado = Producto.objects.update_or_create(
                sku=item['sku'].strip(),
                defaults={
                    'nombre': item['nombre'].strip(),
                    'precio_usd': float(item['precio_usd']),
                    'stock': int(item['stock']),
                    'categoria': categoria_obj,
                    'tipo_negocio': 'BODEGA'  # 🛡️ RESTAURACIÓN INMUTABLE DE VÍVERES
                }
            )
            conteo += 1

        self.stdout.write(self.style.SUCCESS(f"\n¡Éxito Absoluto! Los {conteo} productos originales regresaron a la modalidad BODEGA."))
