import os
import json
from django.core.management.base import BaseCommand
from bodega.models import Categoria, Producto, TasaCambio

class Command(BaseCommand):
    help = 'Importa los 53 productos del catálogo base del sistema Apio a PostgreSQL'

    def handle(self, *args, **options):
        # Buscamos el archivo productos.json en la raíz de tu proyecto
        ruta_base = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
        ruta_json = os.path.join(ruta_base, 'productos.json')
        
        if not os.path.exists(ruta_json):
            self.stdout.write(self.style.ERROR(f"Error: No encontré el archivo '{ruta_json}'."))
            return

        with open(ruta_json, 'r', encoding='utf-8') as archivo:
            items = json.load(archivo)
        
        self.stdout.write(self.style.SUCCESS("=== Iniciando Carga de Catálogo en soto_system_db ==="))
        
        # Sembramos la tasa inicial de forma segura
        TasaCambio.objects.get_or_create(id=1, defaults={'precio_bcv': 45.00})
        
        for item in items:
            # Insertar Categorías dinámicamente y sin duplicados
            categoria_obj, _ = Categoria.objects.get_or_create(
                nombre=item['categoria'].strip()
            )
            
            # Crear o actualizar los productos vinculándolos por su SKU único
            producto_obj, creado = Producto.objects.update_or_create(
                sku=item['sku'].strip(),
                defaults={
                    'nombre': item['nombre'].strip(),
                    'precio_usd': item['precio_usd'],
                    'stock': item['stock'],
                    'categoria': categoria_obj
                }
            )
            
            estado = "Registrado" if creado else "Actualizado"
            self.stdout.write(f"[{estado}] {producto_obj.sku} - {producto_obj.nombre}")

        self.stdout.write(self.style.SUCCESS("\n¡Éxito! Tus 53 productos están listos en PostgreSQL."))
