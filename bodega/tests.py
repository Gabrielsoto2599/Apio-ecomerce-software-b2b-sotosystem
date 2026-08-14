from django.test import TestCase, Client
from django.urls import reverse
from .models import Categoria, Producto, TasaCambio, Factura
import json

class SistemaApioTestCase(TestCase):
    def setUp(self):
        """Configuración inicial del entorno de pruebas de la bodega."""
        self.client = Client()
        
        # 1. Crear categoría y tasa de cambio del día base
        self.categoria = Categoria.objects.create(nombre="Harinas")
        self.tasa = TasaCambio.objects.create(precio_bcv=45.00)
        
        # 2. Crear producto de prueba con su SKU y stock controlado
        self.producto = Producto.objects.create(
            sku="HAR-PAN-023",
            nombre="Harina Pan",
            precio_usd=1.90,
            stock=10,
            categoria=self.categoria
        )
        
        # Extraemos el UUID generado automáticamente para la simulación del QR
        self.id_qr_str = str(self.producto.id_qr)
        self.url_transaccion = reverse('api_procesar_transaccion')

    def test_calculo_y_guion_daniela_exitoso(self):
        """Prueba que Daniela procese el QR, calcule Bs y genere el guion de voz correcto."""
        # Simulamos el payload JSON exacto que envía el puente QR
        payload = {
            "productos": [
                {"id_qr": self.id_qr_str, "cantidad": 2}
            ]
        }
        
        response = self.client.post(
            self.url_transaccion,
            data=json.dumps(payload),
            content_type='application/json'
        )
        
        # Validaciones de la API REST
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["estatus"], "success")
        
        # Verificación matemática estricta: 2 unidades * $1.90 = $3.80
        self.assertEqual(data["totales"]["usd"], 3.80)
        # $3.80 * 45.00 (Tasa) = 171.00 Bolívares
        self.assertEqual(data["totales"]["ves"], 171.00)
        
        # Verificar que el guion para Fish Audio contenga los montos exactos
        self.assertIn("3.8", data["texto_para_daniela"])
        self.assertIn("171.0", data["texto_para_daniela"])
        
        # Verificar que el stock se haya descontado en PostgreSQL (10 - 2 = 8)
        self.producto.refresh_from_db()
        self.assertEqual(self.producto.stock, 8)

    def test_bloqueo_stock_insuficiente(self):
        """Prueba que el sistema rechace la venta de Daniela si el stock es insuficiente."""
        # Intentamos comprar 15 Harinas PAN, pero solo hay 10 en stock
        payload = {
            "productos": [
                {"id_qr": self.id_qr_str, "cantidad": 15}
            ]
        }
        
        response = self.client.post(
            self.url_transaccion,
            data=json.dumps(payload),
            content_type='application/json'
        )
        
        # Validaciones de seguridad
        self.assertEqual(response.status_code, 400)
        data = response.json()
        self.assertEqual(data["estatus"], "error")
        self.assertIn("Lo siento, solo nos quedan", data["mensaje"])
        
        # El stock debe permanecer intacto en 10 debido al rollback atómico
        self.producto.refresh_from_db()
        self.assertEqual(self.producto.stock, 10)
        
        # No se debió generar ninguna factura huérfana en la base de datos
        self.assertEqual(Factura.objects.count(), 0)
