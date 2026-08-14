# utils/finanzas.py
from decimal import Decimal, InvalidOperation

def calcular_precio_ves(precio_usd, tasa_cambio):
    """
    Calcula el precio en Bolívares basándose en la tasa del día de forma exacta.
    """
    try:
        # Convertimos a Decimal para evitar pérdidas de centavos en PostgreSQL
        usd = Decimal(str(precio_usd))
        tasa = Decimal(str(tasa_cambio))
        return round(usd * tasa, 2)
    except (ValueError, TypeError, InvalidOperation):
        return Decimal('0.00')

def calcular_margen_ganancia(precio_costo, precio_venta):
    """
    Calcula el margen de beneficio en porcentaje basado en costo y venta.
    """
    try:
        costo = Decimal(str(precio_costo))
        venta = Decimal(str(precio_venta))
        
        if costo <= 0:
            return 0.0
            
        margen = ((venta - costo) / costo) * 100
        return round(float(margen), 2)
    except (ValueError, TypeError, InvalidOperation):
        return 0.0
