# =====================================================================
# 📡 ENRUTADOR DE ACCESOS Y COMPUERTAS API - SUITE SAAS APIO (BUILD 2026)
# Ubicación: bodega/urls.py
# =====================================================================
from django.urls import path
from . import views

urlpatterns = [
    # =====================================================================
    # 1. INTERFAZ VISUAL (Para las pantallas HTML de la Cajera)
    # =====================================================================
    path('productos/', views.lista_productos, name='lista_productos'),
    path('productos/<int:id>/', views.detalle_producto, name='detalle_producto'),

    # =====================================================================
    # 2. ENDPOINTS API REST (Para la Pasarela, el ERP y Daniela IA)
    # =====================================================================
    # Catálogo completo de los 53 productos para la memoria de Daniela IA
    path('api/v1/productos/', views.lista_productos_api, name='api_lista_productos'),
    
    # Consulta de producto individual al pasar un código QR físico en el smartphone
    path('api/v1/productos/<uuid:id_qr>/', views.detalle_producto_api, name='api_detalle_producto'),
    
    # 🧠 BUSCADOR MAESTRO EN TIEMPO REAL (SOTO SYSTEM 2026): Con barra inclinada final obligatoria
    path('api/v1/buscador/', views.buscador_productos_api, name='api_buscador_productos'),

    # 🚀 LA COMPUERTA DE CLIENTES (ONBOARDING CLOUD)
    path('api/v1/clientes/', views.manejar_api_clientes, name='api_clientes'),

    # 👑 ENDPOINT DE REGISTRO INICIAL SAAS COMERCIAL (EL CABLE DEL BOTÓN NARANJA)
    path('api/v1/registro-inicial-saas/', views.registro_inicial_saas_api, name='registro_inicial_saas'),

    # 🎯 REPARACIÓN DE ENRUTADO CORE (Comentado temporalmente para diagnosticar views)
    path('api/v1/procesar-transaccion/', views.procesar_transaccion, name='procesar_transaccion'),

    # 🔒 LA COMPUERTA DEL ERP (Comentado temporalmente para aislar el error del PDF)
    path('api/v1/ejecutar-cierre-pdf/', views.ejecutar_cierre_pdf_api, name='ejecutar_cierre_pdf'),

    # 📈 CAMINOS DE AUDITORÍA OPERATIVA SOTO SYSTEM (BUILD 2026)
    path('api/v1/ejecutar-cierre-semanal/', views.ejecutar_cierre_semanal_pdf_api, name='cierre_semanal_pdf'),
    path('api/v1/ejecutar-cierre-mensual/', views.ejecutar_cierre_mensual_pdf_api, name='cierre_mensual_pdf'),


    # =====================================================================
    # 📱 COMPUERTAS HÍBRIDAS: PAGO MÓVIL QR ASÍNCRONO (NÚCLEO MAYORISTA 2026)
    # =====================================================================
    # A. Interfaz web a la que entra el cliente escaneando el QR con su teléfono
    path('pago-movil-cliente/', views.pago_movil_cliente, name='pago_movil_cliente'),

    # B. API que recibe el capture físico desde el smartphone y lo codifica a Base64 en Postgres
    path('api/v1/subir-capture/<str:tx_id>/', views.subir_capture_api, name='api_subir_capture'),

    # C. API de consulta cíclica a la que Electron (pasarelaPago.js) interroga cada 3 segundos
    path('api/v1/verificar-pago-movil/<str:tx_id>/', views.verificar_pago_movil_api, name='api_verificar_pago_movil'),

    # 🎯 ENDPOINT EXCLUSIVO: Elimina de raíz el error 404 del PDF de Gastos
    path('api/v1/descargar-gastos-pdf/', views.descargar_gastos_pdf_api, name='descargar_gastos_pdf_api'),
    
    # 🎯 ENDPOINT MOROSIDAD: Mánager telemétrico de control de cuentas por cobrar
    path('api/v1/listado-morosidad-api/', views.listado_morosidad_clientes_api, name='listado_morosidad_clientes_api'),
]
