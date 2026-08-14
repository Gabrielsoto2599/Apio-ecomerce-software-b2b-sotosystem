from django.contrib import admin
from .models import Categoria, Producto, Factura, DetalleFactura, TasaCambio

class DetalleFacturaInline(admin.TabularInline):
    model = DetalleFactura
    extra = 0
    readonly_fields = ['producto', 'cantidad', 'precio_unitario_usd', 'subtotal_usd']

@admin.register(Factura)
class FacturaAdmin(admin.ModelAdmin):
    list_display = ['codigo_transaccion', 'fecha', 'estado', 'total_usd']
    list_filter = ['estado', 'fecha']
    inlines = [DetalleFacturaInline]
    readonly_fields = ['codigo_transaccion', 'total_usd']

@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ['sku', 'nombre', 'precio_usd', 'stock', 'categoria', 'id_qr']
    search_fields = ['nombre', 'sku']
    list_filter = ['categoria']
    readonly_fields = ['id_qr']  # Protegemos el UUID para que nadie lo altere a mano

admin.site.register(Categoria)
admin.site.register(TasaCambio)
