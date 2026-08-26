# =========================================================================
# SOTO SYSTEM ERP - NÚCLEO ESTRUCTURAL DE BASE DE DATOS (POSTGRESQL CLOUD)
# Ubicación: bodega/models.py
# Build: 2026 - Conexión Satelital Autónoma para Suite Apio B2B SaaS
# =========================================================================
import uuid
from django.db import models


class Categoria(models.Model):
    """📂 Segmentación comercial para organizar el catálogo de la bodega."""
    nombre = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.nombre


class Producto(models.Model):
    # ... tus campos actuales (nombre, precio, etc) ...
    tipo_negocio = models.CharField(max_length=20, default="BODEGA", choices=[("BODEGA", "Bodega"), ("ROPA", "Tienda de Ropa")])

    """📦 Inventario mayorista sincronizado en vivo con el instalador de Windows."""
    # db_index=True en campos clave acelera las consultas de la IA exponencialmente
    id_qr = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, db_index=True)
    sku = models.CharField(max_length=30, unique=True, db_index=True)
    nombre = models.CharField(max_length=150)
    precio_usd = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    categoria = models.ForeignKey(Categoria, on_delete=models.PROTECT, related_name='productos')
    actualizado = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.nombre} ({self.sku})"

    def to_dict(self):
        """Evita botes de memoria evaluando el string directo para el proxy de Node."""
        return {
            "id_qr": str(self.id_qr),
            "sku": self.sku,
            "nombre": self.nombre,
            "precio_usd": float(self.precio_usd),
            "stock": self.stock,
            "categoria": str(self.categoria.nombre)
        }


import uuid
from django.db import models

class Factura(models.Model):
    """🧾 Encabezado fiscal del mostrador administrado por el motor dual."""
    ESTADOS = [
        ('PENDIENTE', 'Pendiente por QR'),
        ('PROCESADA', 'Procesada por Daniela'),
        ('ANULADA', 'Anulada'),
    ]
    
    METODOS_PAGO = [
        ('PUNTO', 'Punto de Venta'),
        ('BIOPAGO', 'Biopago BDV'),
        ('CASHEA', 'Cashea'),
        ('PAGO_MOVIL', 'Pago Móvil Real'),  # 🎯 Modificado para el formulario contable
    ]

    # Campos Estándar Originales (Mantenidos para no romper compatibilidad)
    codigo_transaccion = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, db_index=True)
    fecha = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(max_length=15, choices=ESTADOS, default='PENDIENTE')
    metodo_pago = models.CharField(max_length=50, choices=METODOS_PAGO, default='PUNTO') # 💳 Aumentado a 50
    total_usd = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    operador = models.CharField(max_length=100, default='Cajero_Generico')

    # 🚀 EXCLUSIVO PROVIDENCIA SENIAT 2026 & REQUERIMIENTOS DE LARA
    numero_factura = models.CharField(max_length=50, blank=True, null=True, db_index=True)
    cliente_identificacion = models.CharField(max_length=50, default="V-99999999 (Consumidor Final)")
    productos_despachados = models.TextField(blank=True, null=True) # Para las harinas, pastas o ropa
    tasa_bcv = models.DecimalField(max_digits=12, decimal_places=4, default=0.0000)
    total_bs = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    
    # 📱 AUDITORÍA MULTIMONEDA: Aquí se guardan los 5 campos del Pago Móvil en formato de texto
    articulos_json = models.TextField(blank=True, null=True) 

    # =========================================================================
    # 📸 BÚNKER DE CAPTURES MAYORISTAS - STORAGE SEGURO (POSTGRESQL CLOUD)
    # =========================================================================
    # Guarda el string masivo Base64 de la imagen de manera inmutable en Railway
    capture_base64 = models.TextField(blank=True, null=True)
    
    # Interruptor lógico: Cambia a True en milisegundos cuando el cliente hunde "Enviar" en su celular
    capture_recibido = models.BooleanField(default=False)

    def __str__(self):
        return f"Apio Tx: {self.codigo_transaccion} - Metodo: {self.metodo_pago} - Status: {self.estado}"

class DetalleFactura(models.Model):
    """📊 Renglones binarios de las mercancías añadidas al pedido por el cajero."""
    factura = models.ForeignKey(Factura, on_delete=models.CASCADE, related_name='detalles')
    producto = models.ForeignKey(Producto, on_delete=models.PROTECT)
    cantidad = models.PositiveIntegerField()
    precio_unitario_usd = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal_usd = models.DecimalField(max_digits=10, decimal_places=2)

    def save(self, *args, **kwargs):
        # Asegura el cálculo matemático estricto antes de escribir en disco
        self.subtotal_usd = self.cantidad * self.precio_unitario_usd
        super().save(*args, **kwargs)


class TasaCambio(models.Model):
    """💵 Indicador cambiario oficial para transacciones multidivisa en tiempo real."""
    precio_bcv = models.DecimalField(max_digits=10, decimal_places=2)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Tasa BCV: {self.precio_bcv} (Actualizado: {self.fecha_actualizacion})"


class Cliente(models.Model):
    """🏢 ESTRUCTURA FISCAL CORPORATIVA PARA ONBOARDING B2B (SOTO SYSTEM 2026)
    Centraliza la cartera de clientes y bodegueros directamente en PostgreSQL Railway.
    """
    cedula = models.CharField(max_length=30, unique=True, db_index=True)
    nombre = models.CharField(max_length=150)
    telefono = models.CharField(max_length=50, blank=True, null=True)
    tipo_cliente = models.CharField(max_length=100, default='Cliente Minorista (Vecino Diario)')
    registrado_el = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nombre} ({self.cedula}) - {self.tipo_cliente}"
class ConfiguracionNegocio(models.Model):
    nombre_comercial = models.CharField(max_length=150, default="Apio Store C.A.")
    rif = models.CharField(max_length=30, default="J-12345678-0")
    telefono = models.CharField(max_length=50, default="0414-1234567")
    ciudad = models.CharField(max_length=100, default="Chivacoa")
    estado = models.CharField(max_length=100, default="Yaracuy")
    moneda_base = models.CharField(max_length=10, default="USD")

    def __str__(self):
        return f"Configuración: {self.nombre_comercial} ({self.ciudad})"

# =========================================================================
# 📊 MATRIZ TRANSACCIONAL UNIFICADA Y HISTORIAL DEL ERP (EL PLAN DE GABRIEL 2026)
# Ubicación: bodega/models.py
# =========================================================================
from django.db import models

class TransaccionFactura(models.Model):
    # Definimos la matriz de cobro del abasto venezolano
    METODOS_PAGO = [
        ('BIOPAGO', 'Biopago BDV'),
        ('PUNTO', 'Punto de Venta'),
        ('PAGO_MOVIL', 'Pago Móvil Inmediato'),
    ]

    numero_factura = models.CharField(max_length=20, unique=True)
    fecha = models.DateTimeField(auto_now_add=True)
    operador = models.CharField(max_length=100, default="Gabriel - Administrador Central")
    
    # 🎯 CORE REPAIR: Aseguramos que la base de datos guarde el valor por defecto como MINORISTA o Consumidor Final
    cliente_identificacion = models.CharField(max_length=50, default="V-99999999 (Consumidor Final)")
    productos_despachados = models.TextField(default="Mercancía General")
    metodo_pago = models.CharField(max_length=20, default='BIOPAGO')
    
    # 📐 Campos fiscales basados en la tasa de cambio reaccionaria
    tasa_bcv = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    total_usd = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    total_bs = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    
    # Mantenemos el campo JSON de respaldo por integridad de software
    articulos_json = models.TextField(blank=True, default="[]") 

    def __str__(self):
        return f"{self.numero_factura} - {self.cliente_identificacion} ({self.total_bs} Bs.)"

import datetime
from django.db import models
from django.contrib.auth.models import User

# =========================================================================
# 💸 MODELO: EGRESOS OPERATIVOS Y GASTOS DE CAJA (SOTO SYSTEM 2026)
# =========================================================================
class GastoExpress(models.Model):
    descripcion = models.CharField(max_length=255, verbose_name="Concepto del Egreso")
    monto = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Monto en USD")
    fecha = models.DateField(default=datetime.date.today, verbose_name="Fecha de Registro")
    creado_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Gasto Express"
        verbose_name_plural = "Gastos Express"
        ordering = ['-fecha', '-creado_at']

    def __str__(self):
        return f"{self.descripcion} (-${self.monto})"


# =========================================================================
# 🚨 MODELO: CONTROL DE MOROSIDAD Y CUENTAS POR COBRAR (CLIENTES FIAR)
# =========================================================================
class CuentaPorCobrar(models.Model):
    ESTADOS = (
        ('PENDIENTE', 'Pendiente / Fiar Activo'),
        ('MOROSO', 'Moroso / Alerta de Retraso'),
        ('PAGADO', 'Liquidado / Solvente'),
    )
    
    # Vinculamos al cliente que tienes en tu tabla original
    cliente_nombre = models.CharField(max_length=255, verbose_name="Vecino / Comprador")
    cedula_rif = models.CharField(max_length=20, verbose_name="Cédula o RIF")
    nro_factura_origen = models.CharField(max_length=50, verbose_name="Factura Origen")
    monto_deuda = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Saldo Deudor ($)")
    fecha_fiado = models.DateField(default=datetime.date.today)
    fecha_limite = models.DateField(verbose_name="Fecha Límite de Pago")
    estado = models.CharField(max_length=20, choices=ESTADOS, default='PENDIENTE')
    
    class Meta:
        verbose_name = "Cuenta Por Cobrar"
        verbose_name_plural = "Cuentas Por Cobrar"
        ordering = ['fecha_limite']

    @property
    def dias_retraso(self):
        """Calcula dinámicamente los días de morosidad si superó la fecha límite"""
        if self.estado != 'PAGADO' and datetime.date.today() > self.fecha_limite:
            return (datetime.date.today() - self.fecha_limite).days
        return 0

    def to_dict(self):
        return {
            "id": self.id,
            "cliente": self.cliente_nombre,
            "cedula": self.cedula_rif,
            "factura": self.nro_factura_origen,
            "deuda": float(self.monto_deuda),
            "retraso": self.dias_retraso,
            "estado": self.estado,
            "fecha_limite": self.fecha_limite.strftime('%Y-%m-%d')
        }



