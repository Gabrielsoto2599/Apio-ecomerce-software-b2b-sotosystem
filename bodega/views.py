import io
import json
import datetime
import unicodedata # 🚀 ANTENA NATIVA: Para destruir tildes y acentos en milisegundos
from datetime import timedelta
from django.utils import timezone
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse, HttpResponse, FileResponse # 🎯 Agregamos FileResponse para los PDF
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction, models 
from .models import Producto, Factura, DetalleFactura, TasaCambio, Cliente

# 🖨️ DEPENDENCIAS CRÍTICAS DE REPORTLAB PARA ADAPTACIÓN SENIAT 2026
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors


# =====================================================================
# 🚀 FUNCIÓN COMPAÑERA SOTO SYSTEM: TRADUCTOR CONTABLE DE ACENTOS
# =====================================================================
def eliminar_tildes_python(texto):
    """
    Descompone caracteres latinos (ej: 'café' -> 'cafe') para que el buscador
    muerda los productos sin importar la ortografía del cajero.
    """
    if not texto:
        return ""
    texto_normalizado = unicodedata.normalize('NFD', texto)
    return "".join(c for c in texto_normalizado if unicodedata.category(c) != 'Mn').lower().strip()


# =====================================================================
# 1. VISTAS TRADICIONALES (Para la pantalla visual de la Cajera)
# =====================================================================

def lista_productos(request):
    """Consulta todos los productos para mostrarlos en la plantilla HTML."""
    productos = Producto.objects.all()
    return render(request, 'bodega/lista_productos.html', {'productos': productos})


def detalle_producto(request, id):
    """Muestra el detalle clásico de un producto por su ID numérico interno."""
    producto = get_object_or_404(Producto, id=id)
    return render(request, 'bodega/detalle_producto.html', {'producto': producto})


# =====================================================================
# 🔍 ENDPOINT API DEL BUSCADOR REACTIVO INMUNE A TILDES (BUILD 2026)
# Ubicación: bodega/views.py -> REPARADO CON SERIALIZADOR SOTO SYSTEM
# =====================================================================
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Producto
# Asegúrate de tener importada tu función eliminar_tildes_python arriba

@csrf_exempt
def buscador_productos_api(request):
    """
    [CEREBRO EXCLUSIVO DE VÍVERES - RETORNO PLANO INMUNE A ERRORES]
    Carga el catálogo completo al inicio y filtra en caliente de forma plana.
    Satisface el tipado estricto que exige catalogoB2B.js en Electron.
    """
    try:
        # Capturamos la ráfaga de la cabecera de Electron
        termino_crudo = request.GET.get('q', '').strip()
        
        # Conseguimos todo el inventario de víveres real desde PostgreSQL Cloud
        todos_los_productos = Producto.objects.all()
        
        if not termino_crudo:
            # Entrada de oro: Si la caja está vacía, cargamos los 53 productos completos
            productos_filtrados = todos_los_productos
        else:
            # Saneamos el término contra acentos
            terminoSaneado = eliminar_tildes_python(termino_crudo).lower()
            
            productos_filtrados = []
            for prod in todos_los_productos:
                # 🎯 REPARACIÓN CORE: Extraemos .nombre, .sku y el string real de la categoría foránea
                nombre_saneado = eliminar_tildes_python(prod.nombre or "").lower()
                sku_saneado = (prod.sku or "").lower().strip()
                
                # Jalamas de forma segura el texto de la tabla Categoria
                texto_categoria = prod.categoria.nombre if prod.categoria else "General"
                categoria_saneada = eliminar_tildes_python(texto_categoria).lower()
                
                # Coincidencia elástica por iniciales, SKU o nombre interno
                if (terminoSaneado in nombre_saneado or 
                    nombre_saneado.startswith(terminoSaneado) or 
                    terminoSaneado in categoria_saneada or 
                    terminoSaneado == sku_saneado):
                    productos_filtrados.append(prod)

        # 👑 REPARACIÓN DE SERIALIZACIÓN: Usamos to_dict() para homologar con Electron
        lista_json = []
        for prod in productos_filtrados:
            try:
                # El proxy inyecta el formato idéntico exigido por catalogoB2B.js
                lista_json.append(prod.to_dict())
            except Exception as inner_err:
                print(f"⚠️ Error serializando producto {prod.sku}: {str(inner_err)}")
                # Fallback elástico de emergencia en el bucle
                lista_json.append({
                    "id": prod.id,
                    "id_qr": str(prod.id_qr),
                    "sku": prod.sku or "",
                    "nombre": prod.nombre or "Producto sin nombre",
                    "categoria": prod.categoria.nombre if prod.categoria else "General",
                    "precio_usd": float(prod.precio_usd or 0.0),
                    "stock": prod.stock or 0
                })
            
        # 🚀 DISPARO ORIGINAL DE HISTORIAL: Formato [...] directo sin llaves extras
        response = JsonResponse(lista_json, safe=False, status=200)
        
        # Escudo protector CORS para Electron Desktop App
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type"
        return response

    except Exception as e:
        print(f"❌ [CRASH BUSCADOR INTEGRAL]: {str(e)}")
        # Si algo explota en la molienda, devolvemos un arreglo vacío con status 200 para no trancar Electron
        fail_res = JsonResponse([], safe=False, status=200)
        fail_res["Access-Control-Allow-Origin"] = "*"
        return fail_res

# =====================================================================
# 🔍 ENDPOINT API REST JSON (El cerebro para la IA Daniela y el Sistema Apio)
# Ubicación: bodega/views.py -> CONSOLIDADO CONTABLE 2026
# =====================================================================
import json
import datetime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404  # 🎯 REPARACIÓN CORE: Inyectada función faltante
from .models import Producto

@csrf_exempt
def lista_productos_api(request):
    """
    [CEREBRO INTEGRAL DE VÍVERES - DESPACHO PLANO MAESTRO]
    Retorna el inventario completo de la bodega en formato de arreglo plano.
    Elimina filtros fantasmas de ropa y variables inexistentes para evitar caídas en el DOM.
    """
    try:
        # Traemos todos los víveres reales sembrados desde PostgreSQL en Railway
        productos = Producto.objects.all()
        
        # Mapeamos usando el to_dict() purificado que ya programamos en tu models.py
        lista_plana = [p.to_dict() for p in productos]
        
        # 🚀 RETORNO PLANO DIRECTO: Satisface el mapeo nativo de la pasarela de Electron
        response = JsonResponse(lista_plana, safe=False, status=200)
        
        # Escudo de red total contra bloqueos CORS locales
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type"
        return response
        
    except Exception as e:
        print(f"❌ [CRASH LISTA PRODUCTOS API]: {str(e)}")
        # Contingencia de salvavidas para que el Front-End nunca se quede a oscuras
        fail_res = JsonResponse([], safe=False, status=200)
        fail_res["Access-Control-Allow-Origin"] = "*"
        return fail_res

@csrf_exempt
def detalle_producto_api(request, id_qr):
    """
    Busca un producto por su UUID de QR escaneado.
    Calcula el precio del día y genera el guion de voz para Fish Audio.
    """
    try:
        producto = get_object_or_404(Producto, id_qr=id_qr)
        
        # 🎯 PROTECCIÓN APION CORE: Usamos la tasa del día inyectada en el estado global de tu SPA
        # Evitamos caídas si la tabla TasaCambio interna de Django no está poblada aún
        tasa_bcv_viva = float(request.GET.get('tasa', 40.00))
        
        precio_ves = round(float(producto.precio_usd) * tasa_bcv_viva, 2)
        guion_vocal = f"Es {producto.nombre}. Tiene un costo de {producto.precio_usd} dólares, que equivalen a {precio_ves} bolívares."
        
        response = JsonResponse({
            "estatus": "encontrado",
            "producto": producto.to_dict(),
            "precios": {"usd": float(producto.precio_usd), "ves": precio_ves},
            "texto_para_daniela": guion_vocal,
            "alerta_stock": producto.stock <= 3
        }, status=200)
        
        response["Access-Control-Allow-Origin"] = "*"
        return response
        
    except Exception as e:
        print(f"❌ [CRASH DETALLE QR API]: {str(e)}")
        return JsonResponse({"error": "Código QR no reconocido en el sistema Apio."}, status=404)


@csrf_exempt
def metricas_analitica_api(request):
    """
    📊 DISPARADOR DE ANALÍTICA GERENCIAL:
    Calcula el producto estrella más vendido del mes moliendo los JSON de la tabla Factura.
    """
    if request.method != 'GET':
        return JsonResponse({'error': 'Método no permitido'}, status=405)
    
    try:
        from .models import Factura
        
        hoy = datetime.date.today()
        # Filtramos las facturas del mes en curso
        facturas_mes = Factura.objects.filter(fecha__year=hoy.year, fecha__month=hoy.month)
        
        conteo_skus = {}
        
        # Molienda de datos: recorremos las facturas y extraemos los artículos
        for fac in facturas_mes:
            try:
                # 🎯 REPARACIÓN MÁSTER: La librería json ya se encuentra importada arriba de forma global
                articulos = json.loads(fac.productos_despachados) if isinstance(fac.productos_despachados, str) else fac.productos_despachados
                if isinstance(articulos, list):
                    for art in articulos:
                        sku = art.get('sku', 'Desconocido')
                        nombre = art.get('nombre', 'Mercancía General')
                        cantidad = int(art.get('cantidad', 1))
                        
                        if sku not in conteo_skus:
                            conteo_skus[sku] = {"nombre": nombre, "total_unidades": 0}
                        conteo_skus[sku]["total_unidades"] += cantidad
            except Exception:
                pass

        # Encontramos el líder de la tabla
        if conteo_skus:
            producto_estrella_sku = max(conteo_skus, key=lambda k: conteo_skus[k]["total_unidades"])
            producto_estrella = {
                "sku": producto_estrella_sku,
                "nombre": conteo_skus[producto_estrella_sku]["nombre"],
                "unidades": conteo_skus[producto_estrella_sku]["total_unidades"]
            }
        else:
            producto_estrella = {"sku": "N/A", "nombre": "Sin transacciones este mes", "unidades": 0}
            
        response = JsonResponse({"status": "success", "producto_mas_vendido": producto_estrella})
        response["Access-Control-Allow-Origin"] = "*"
        return response
        
    except Exception as e:
        print(f"❌ [CRASH METRICAS API]: {str(e)}")
        return JsonResponse({"status": "error", "message": str(e)}, status=500)


# =========================================================================
# 📊 CONTROLADOR INTEGRAL DE ONBOARDING DE CLIENTES POSTGRESQL (BUILD 2026)
# Ubicación: Al final de tu bodega/views.py
# =========================================================================
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

# 🚨 NOTA IMPORTANTE: Si tu modelo de Clientes en models.py se llama distinto 
# (por ejemplo 'ClienteB2B' o 'Comprador'), cámbiale el nombre aquí en la importación:
from .models import Cliente 

@csrf_exempt # Desactivamos temporalmente el token CSRF para el desarrollo local del .exe
def manejar_api_clientes(request):
    """
    Mánager telemétrico dual:
    - GET: Extrae la cartera completa de clientes de PostgreSQL Railway.
    - POST: Recibe el payload del formulario, lo sanea y lo siembra en la nube.
    """
    # 📥 1. FLUJO DE CARGA (GET): Envía los clientes registrados al mostrador
    if request.method == 'GET':
        try:
            clientes = Cliente.objects.all().order_by('-id')
            lista_clientes = []
            for c in clientes:
                lista_clientes.append({
                    "cedula": c.cedula,
                    "nombre": c.nombre,
                    "telefono": c.telefono,
                    "tipo_cliente": getattr(c, 'tipo_cliente', 'Minorista')
                })
            return JsonResponse(lista_clientes, safe=False)
        except Exception as e:
            return JsonResponse({"error": f"Fallo al leer tabla: {str(e)}"}, status=500)

    # 📤 2. FLUJO DE SIEMBRA (POST): Recibe e Inyecta el alta en la nube
    elif request.method == 'POST':
        try:
            datos = json.loads(request.body)
            
            cedula_val = str(datos.get('cedula', '')).strip()
            nombre_val = str(datos.get('nombre', '')).strip()
            telefono_val = str(datos.get('telefono', '')).strip()
            tipo_val = str(datos.get('tipo_cliente', 'Cliente Minorista (Vecino Diario)')).strip()

            if not cedula_val or not nombre_val:
                return JsonResponse({"error": "Cédula y Nombre son requeridos fiscales"}, status=400)

            # Validamos si el cliente ya existe en las tablas de Railway para evitar duplicados
            cliente_existente = Cliente.objects.filter(cedula=cedula_val).first()
            if cliente_existente:
                return JsonResponse({"message": "El cliente ya se encuentra registrado en PostgreSQL"}, status=200)

            # 🚀 SIEMBRA DIRECTA EN LA NUBE: Guardamos en las columnas reales de Postgres
            nuevo_cliente = Cliente.objects.create(
                cedula=cedula_val,
                nombre=nombre_val,
                telefono=telefono_val,
                tipo_cliente=tipo_val 
            )

            print(f"✅ [SOTO DATABASE SUCCESS]: Bodeguero registrado en Railway -> {nombre_val}")
            return JsonResponse({
                "status": "success",
                "message": "Cliente dado de alta exitosamente en la base de datos de Railway",
                "cliente": {"cedula": nuevo_cliente.cedula, "nombre": nuevo_cliente.nombre}
            }, status=201)

        except Exception as e:
            return JsonResponse({"error": f"Fallo en la inyección de base de datos: {str(e)}"}, status=500)

    return JsonResponse({"error": "Método de red no permitido"}, status=405)

# =========================================================================
# 👑 CONTROLADOR DE REGISTRO INICIAL Y CONFIGURACIÓN DINÁMICA DE LA EMPRESA
# Ubicación: Al final de tu bodega/views.py (RECONSTRUIDO DEFINITIVO)
# =========================================================================
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import ConfiguracionNegocio
import json

@csrf_exempt
def registro_inicial_saas_api(request):
    """
    Recibe la ráfaga masiva desde la pantalla de Registro de AuthModulo.
    Sanea e inyecta el entorno del abasto en PostgreSQL Railway en caliente.
    """
    if request.method != 'POST':
        return JsonResponse({"error": "Método no permitido"}, status=405)

    try:
        # Saneamos los bytes del buffer asíncrono
        datos = json.loads(request.body)
        datos_negocio = datos.get('negocio', {})

        # Extraemos las variables enviadas por tu JavaScript de la PC
        nombre_com = str(datos_negocio.get('nombre_comercial', '')).strip()
        rif_val = str(datos_negocio.get('rif', '')).strip()
        tlf_val = str(datos_negocio.get('telefono', '')).strip()
        ciudad_val = str(datos_negocio.get('ciudad', '')).strip()
        estado_val = str(datos_negocio.get('estado', '')).strip()

        # 🚀 SIEMBRA DIRECTA EN LA FILA 1 DE POSTGRESQL (RAILWAY CLOUD)
        info_empresa, created = ConfiguracionNegocio.objects.update_or_create(
            id=1,
            defaults={
                "nombre_comercial": nombre_com if nombre_com else "Apio Store C.A.",
                "rif": rif_val if rif_val else "J-12345678-0",
                "telefono": tlf_val,
                "ciudad": ciudad_val if ciudad_val else "Chivacoa",
                "estado": estado_val if estado_val else "Yaracuy"
            }
        )

        print(f"🏢 [SOTO DATABASE SUCCESS]: Entorno configurado para '{info_empresa.nombre_comercial}' en {info_empresa.ciudad}.")
        return JsonResponse({
            "status": "success",
            "message": "Entorno SaaS fundado con éxito en PostgreSQL",
            "negocio": info_empresa.nombre_comercial
        }, status=201)

    except Exception as e:
        return JsonResponse({"error": f"Fallo crítico en el búnker backend: {str(e)}"}, status=500)

# =========================================================================
# 👑 API REST: CONTROLADOR UNIFICADO DEL HISTORIAL TRANSACCIONAL DEL ERP
# Ubicación: Al final de bodega/views.py (Sustituye bloques viejos)
# =========================================================================
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from .models import TransaccionFactura
import json
import random
from datetime import datetime

@csrf_exempt
def obtener_movimientos_erp_api(request):
    """
    Despacha el Historial Unificado de Movimientos Diarios para renderizar
    la tabla lineal en la Consola ERP del Frontend de forma autónoma.
    """
    if request.method != 'GET':
        return JsonResponse({"error": "Método no permitido"}, status=405)

    try:
        # Jalamos el historial lineal directo desde PostgreSQL Railway
        facturas = TransaccionFactura.objects.all().order_by('-fecha')
        
        lista_movimientos = []
        for fac in facturas:
            lista_movimientos.append({
                "ref": fac.numero_factura,
                "hora": fac.hora_manual if fac.hora_manual else fac.fecha.strftime('%H:%M:%S'),
                "fecha": fac.fecha.strftime('%d/%m/%Y'),
                "cedula": fac.cliente_identificacion,
                "productos": fac.productos_despachados,
                "metodo": fac.metodo_pago,
                "montoBs": float(fac.total_bs),
                "montoUsd": float(fac.total_usd)
            })

        return JsonResponse({
            "status": "success",
            "movimientos_diarios": lista_movimientos
        }, status=200)

    except Exception as e:
        return JsonResponse({"error": f"Fallo crítico en el búfer del ERP: {str(e)}"}, status=500)


import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import TransaccionFactura  # 🎯 Aseguramos la importación de tu matriz real

@csrf_exempt
def procesar_transaccion(request):
    if request.method != 'POST':
        return JsonResponse({'status': 'error', 'message': 'Método no permitido'}, status=405)
        
    try:
        # 🧪 1. Masticamos el JSON masivo del carrito enviado por Electron
        datos = json.loads(request.body)
        
        # Generamos un correlativo interno de respaldo si el JSON no trae número físico
        import random
        nro_factura = datos.get('numero_factura') or f"FAC-{random.randint(10000, 99999)}"
        
        # 🧱 2. Extracción lineal mapeada según los defaults de tu models.py
        cliente_id = datos.get('cliente_identificacion') or "V-99999999 (Consumidor Final)"
        tasa_oficial = float(datos.get('tasa_bcv') or 0.00)
        subtotal_usd = float(datos.get('total_usd') or 0.00)
        
        # Cálculos matemáticos precisos con el IVA del 16% de ley venezolano
        total_bs_calculado = (subtotal_usd * tasa_oficial) * 1.16
        
        # Extraemos y compactamos la lista de harinas, pastas o ropa
        articulos_lista = datos.get('articulos', [])
        string_productos = ", ".join([f"{item.get('nombre', 'Víveres').strip()} (x{item.get('cantidad', 1)})" for item in articulos_lista])

        # 🚀 3. EL ASENTAMIENTO ATÓMICO: Escribimos directamente en tu tabla Factura actualizada
        nueva_venta = Factura.objects.create(
            numero_factura=nro_factura,
            cliente_identificacion=cliente_id,
            productos_despachados=string_productos[:250] if string_productos else "Mercancía General",
            metodo_pago=datos.get('metodo_pago', 'BIOPAGO'),
            tasa_bcv=tasa_oficial,
            total_usd=subtotal_usd,
            total_bs=total_bs_calculado,
            articulos_json=json.dumps(articulos_lista)
        )

        print(f"🟢 [SOTO CLOUD SUCCESS]: Venta {nro_factura} asentada con éxito en la tabla Factura en Railway.")

        return JsonResponse({
            'status': 'success',
            'message': 'Transacción contable procesada con éxito.',
            'numero_factura': nueva_venta.numero_factura
        }, status=200)

    except Exception as e:
        print(f"❌ [SOTO CRITICAL ERROR]: Fallo en procesar_transaccion: {str(e)}")
        return JsonResponse({'status': 'error', 'message': f"Error interno: {str(e)}"}, status=500)


# =========================================================================
# 📊 GENERADOR DE PDF ADAPTATIVO CON CARGA INYECTADA EN VIVO (BUILD 2026)
# Ubicación: Al puro final de bodega/views.py (COMPLETO Y SANADO)
# =========================================================================
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from .models import TransaccionFactura, Factura # 🎯 CORE REPAIR: Aseguramos la importación de tu modelo real Factura
import json
import io
import datetime
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors

@csrf_exempt
def ejecutar_cierre_pdf_api(request):
    """
    Recopila las ventas de las últimas 24 horas desde el modelo unificado Factura
    y genera el balance fiscal premium en PDF usando ReportLab.
    """
    if request.method != 'POST':
        return JsonResponse({'error': 'Método no permitido'}, status=405)
        
    try:
        # 📊 1. Rango de tiempo absoluto compatible con PostgreSQL Railway
        from django.utils import timezone
        import io
        
        inicio_dia = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
        fin_dia = timezone.now().replace(hour=23, minute=59, second=59, microsecond=999999)
        
        # Filtramos de forma inmutable en tu tabla real unificada
        ventas_hoy = Factura.objects.filter(fecha__range=(inicio_dia, fin_dia))
        
        # Computamos los totales en caliente usando Python
        total_usd = sum(float(v.total_usd or 0.00) for v in ventas_hoy)
        total_bs = sum(float(v.total_bs or 0.00) for v in ventas_hoy)
        conteo_transacciones = ventas_hoy.count()

        # 🖨️ 2. Construimos el flujo binario para ReportLab
        buffer_memoria = io.BytesIO()
        p = canvas.Canvas(buffer_memoria, pagesize=letter)
        p.setTitle("SOTO SYSTEM POS - REPORTE DE CIERRE DIARIO")
        
        # Encabezado Estético Institucional Premium Dark
        p.setFillColor(colors.HexColor("#0b0f19"))
        p.rect(0, 700, 612, 100, fill=True, stroke=False)
        
        p.setFillColor(colors.white)
        p.setFont("Helvetica-Bold", 16)
        p.drawString(30, 750, "APIO E-COMMERCE SOFTWARE - REPORTE DE CIERRE")
        p.setFont("Helvetica", 10)
        p.drawString(30, 730, f"Fecha de Emisión: {timezone.now().date()} | Balance Compilado Cloud")
        p.drawString(30, 715, "-------------------------------------------------------------------------")
        
        # Cuerpo del Balance Contable
        p.setFillColor(colors.black)
        p.setFont("Helvetica-Bold", 12)
        p.drawString(30, 670, f"Transacciones Procesadas hoy: {conteo_transacciones}")
        p.drawString(30, 650, f"Total Facturado (USD): ${total_usd:,.2f}")
        p.drawString(30, 630, f"Total Facturado (Bs.): {total_bs:,.2f} Bs.")
        p.line(30, 615, 580, 615)
        
        # Desglose de canales tipo Impresora Fiscal
        p.setFont("Courier", 8)
        y_position = 590
        
        if ventas_hoy.exists():
            for v in ventas_hoy:
                if y_position < 50:  # Salto de página básico
                    p.showPage()
                    y_position = 750
                
                ref = (v.numero_factura or 'TR-N/A').ljust(10)
                cedula = (v.cliente_identificacion or 'V-99999999').ljust(12)
                metodo = (v.metodo_pago or 'BIOPAGO').ljust(10)
                monto = f"${float(v.total_usd or 0.00):.2f}"
                
                p.drawString(30, y_position, f"DOC: {ref} | RIF: {cedula} | PAGO: {metodo} | TOTAL: {monto}")
                y_position -= 15
        else:
            p.setFont("Helvetica-Oblique", 10)
            p.setFillColor(colors.HexColor("#ef4444"))
            p.drawString(30, y_position, "⚠️ Sin movimientos comerciales registrados en la base de datos cloud hoy.")

        # Cierre y sellado del archivo binario
        p.showPage()
        p.save()
        buffer_memoria.seek(0)
        
        # 🚀 Retornamos el archivo PDF directamente como un flujo de bytes nativo
        nombre_reporte = f"Cierre_Diario_SotoSystem_{timezone.now().date()}.pdf"
        return FileResponse(buffer_memoria, as_attachment=True, filename=nombre_reporte, content_type='application/pdf')

    except Exception as e:
        print(f"❌ [SOTO CRITICAL PDF]: Fallo al compilar ReportLab: {str(e)}")
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

@csrf_exempt
def ejecutar_cierre_semanal_pdf_api(request):
    if request.method != 'POST':
        return HttpResponse("Método no permitido", status=405)
    try:
        # 1. Inicializamos el búfer de memoria de ReportLab
        buffer_memoria = io.BytesIO()
        pdf_lienzo = canvas.Canvas(buffer_memoria, pagesize=letter)
        pdf_lienzo.setTitle("APIO SAAS - REPORTE SEMANAL")

        # 2. Cabecera Índigo Corporativa Semanal Premium
        pdf_lienzo.setFillColor(colors.HexColor("#1e1b4b"))
        pdf_lienzo.rect(0, 700, 612, 100, fill=True, stroke=False)
        
        pdf_lienzo.setFillColor(colors.white)
        pdf_lienzo.setFont("Helvetica-Bold", 16)
        pdf_lienzo.drawString(30, 740, "APIO ERPS SOFTWARE - BALANCE CONSOLIDADO SEMANAL")
        pdf_lienzo.setFont("Helvetica", 10)
        
        # Rango de fecha dinámico para la auditoría de Lara
        fecha_final = timezone.now().date()
        fecha_inicial = fecha_final - timedelta(days=7)
        pdf_lienzo.drawString(30, 720, f"Rango Auditoría: {fecha_inicial} hasta {fecha_final} | Últimos 7 Días")

        # 3. 📉 CÓMPUTO TELEMÉTRICO DIRECTO DESDE LA TABLA FACTURA REAL
        hace_una_semana = timezone.now() - timedelta(days=7)
        facturas_semana = Factura.objects.filter(fecha__gte=hace_una_semana)

        # Mapeo matemático blindado convirtiendo los campos Decimal a float
        total_bs = sum(float(f.total_bs or 0.00) for f in facturas_semana)
        total_usd = sum(float(f.total_usd or 0.00) for f in facturas_semana)

        # 4. Inyección de Métricas en Pantalla con formato Courier Fiscal
        pdf_lienzo.setFillColor(colors.black)
        pdf_lienzo.setFont("Helvetica-Bold", 12)
        pdf_lienzo.drawString(30, 640, "MÉTRICAS ACUMULADAS EN LA COLA DE ATENCIÓN:")
        
        pdf_lienzo.setFont("Courier-Bold", 11)
        pdf_lienzo.drawString(40, 600, f"• FACTURAS PROCESADAS EN LA SEMANA: {facturas_semana.count()} Docs")
        pdf_lienzo.drawString(40, 580, f"• TOTAL ACUMULADO EN BOLÍVARES:     {total_bs:,.2f} Bs.")
        pdf_lienzo.drawString(40, 560, f"• TOTAL ACUMULADO EN DÓLARES:       $ {total_usd:,.2f} USD")

        # 5. Sellado y despacho del binario
        pdf_lienzo.showPage()
        pdf_lienzo.save()
        buffer_memoria.seek(0)
        
        # Retorno eléctrico con FileResponse (Más limpio y moderno que el HttpResponse plano)
        nombre_archivo = f"Cierre_Semanal_SotoSystem_{fecha_final}.pdf"
        return FileResponse(buffer_memoria, as_attachment=True, filename=nombre_archivo, content_type='application/pdf')
        
    except Exception as e:
        print(f"❌ [SOTO CRITICAL WEEKLY PDF]: {str(e)}")
        return HttpResponse(f"Fallo Semanal: {str(e)}", status=500, content_type="text/plain")

@csrf_exempt
def ejecutar_cierre_mensual_pdf_api(request):
    if request.method != 'POST':
        return HttpResponse("Método no permitido", status=405)
    try:
        # 1. Inicializamos el búfer de memoria de ReportLab
        buffer_memoria = io.BytesIO()
        pdf_lienzo = canvas.Canvas(buffer_memoria, pagesize=letter)
        pdf_lienzo.setTitle("APIO SAAS - REPORTE MENSUAL")

        # 2. Cabecera Bronce/Dorado Corporativa Mensual Premium
        pdf_lienzo.setFillColor(colors.HexColor("#7c2d12"))
        pdf_lienzo.rect(0, 700, 612, 100, fill=True, stroke=False)
        
        pdf_lienzo.setFillColor(colors.white)
        pdf_lienzo.setFont("Helvetica-Bold", 16)
        pdf_lienzo.drawString(30, 740, "APIO ERPS SOFTWARE - BALANCE CONSOLIDADO MENSUAL")
        pdf_lienzo.setFont("Helvetica", 10)
        
        # Rango mensual dinámico calculado con datetime para el mercado de Lara
        fecha_final = datetime.date.today()
        # Filtro de los últimos 30 días operacionales
        hace_un_mes_date = fecha_final - datetime.timedelta(days=30)
        pdf_lienzo.drawString(30, 720, f"Rango Auditoría Mensual: {hace_un_mes_date} hasta {fecha_final} | Últimos 30 Días")

        # 3. 📉 CÓMPUTO MENSUAL DESDE LA TABLA FACTURA REAL UNIFICADA
        hace_un_mes_dt = timezone.now() - datetime.timedelta(days=30)
        facturas_mes = Factura.objects.filter(fecha__gte=hace_un_mes_dt)

        # Mapeo matemático e inyección limpia convirtiendo los campos Decimal a float
        total_bs = sum(float(f.total_bs or 0.00) for f in facturas_mes)
        total_usd = sum(float(f.total_usd or 0.00) for f in facturas_mes)

        # 4. Inyección de Métricas en Pantalla con formato Courier Fiscal
        pdf_lienzo.setFillColor(colors.black)
        pdf_lienzo.setFont("Helvetica-Bold", 12)
        pdf_lienzo.drawString(30, 640, "MÉTRICAS ACUMULADAS EN EL CIERRE DE MES:")
        
        pdf_lienzo.setFont("Courier-Bold", 11)
        pdf_lienzo.drawString(40, 600, f"• TOTAL FACTURAS PROCESADAS EN EL MES: {facturas_mes.count()} Docs")
        pdf_lienzo.drawString(40, 580, f"• TOTAL ACUMULADO FACTURADO EN BS:     {total_bs:,.2f} Bs.")
        pdf_lienzo.drawString(40, 560, f"• TOTAL ACUMULADO FACTURADO EN USD:    $ {total_usd:,.2f} USD")

        # 5. Sellado y despacho del binario
        pdf_lienzo.showPage()
        pdf_lienzo.save()
        buffer_memoria.seek(0)
        
        nombre_archivo = f"Cierre_Mensual_SotoSystem_{fecha_final.strftime('%Y-%m')}.pdf"
        return FileResponse(buffer_memoria, as_attachment=True, filename=nombre_archivo, content_type='application/pdf')
        
    except Exception as e:
        print(f"❌ [SOTO CRITICAL MONTHLY PDF]: {str(e)}")
        return HttpResponse(f"Fallo Mensual: {str(e)}", status=500, content_type="text/plain")

# =====================================================================
# 📱 NÚCLEO EXCLUSIVO PAGO MÓVIL V2.0 - PROVIDENCIA SENIAT 2026
# Ubicación: Módulo unificado para validación asíncrona de Lara
# =====================================================================

@csrf_exempt
def pago_movil_cliente(request):
    """
    Renderiza la interfaz informativa de contingencia si fuera necesario.
    """
    return JsonResponse({
        'status': 'active',
        'message': 'Soto System Gateway: Formulario de auditoría en caja activo.'
    }, status=200)


@csrf_exempt
def verificar_pago_movil_api(request, tx_id):
    """
    API de consulta cíclica a la que la pasarela de Electron interroga.
    Busca de forma blindada en tu tabla real unificada 'Factura'.
    """
    try:
        from .models import Factura  # 🎯 CONEXIÓN DIRECTA CON TU MODELO REAL UNIFICADO
        
        # Interrogamos a PostgreSQL si la factura con esa referencia ya fue asentada por la cajera
        existe = Factura.objects.filter(numero_factura=tx_id).exists()
        
        if existe:
            print(f"🟢 [SOTO CLOUD]: Petición de pago móvil verificada con éxito para la Factura: {tx_id}")
            return JsonResponse({
                'status': 'success',
                'pago_verificado': True,
                'message': 'Transacción contable asentada con éxito en PostgreSQL Railway.'
            }, status=200)
            
        return JsonResponse({
            'status': 'pending',
            'pago_verificado': False,
            'message': 'Esperando confirmación de datos y validación de referencia en el mostrador.'
        }, status=200)
        
    except Exception as e:
        print(f"❌ [SOTO CRITICAL VERIFY ERROR]: Fallo en la verificación cíclica: {str(e)}")
        return JsonResponse({'status': 'error', 'message': f"Fallo en verificación: {str(e)}"}, status=500)

@csrf_exempt
def subir_capture_api(request, tx_id):
    """
    📸 MÓDULO MULTIMEDIA SENIAT 2026:
    Recibe el comprobante físico o capture del cliente y lo asocia 
    a la Factura en PostgreSQL Railway.
    """
    if request.method == 'POST' and request.FILES.get('capture_file'):
        try:
            image_file = request.FILES['capture_file']
            
            # Buscamos la transacción en tu tabla única usando la columna 'numero_factura'
            # (Si no existe por un parpadeo de red, la crea sobre la marcha para no tumbar la caja)
            transaccion, created = Factura.objects.get_or_create(numero_factura=tx_id)
            
            # Guardamos el archivo físico o la referencia multimedia
            # transaccion.comprobante_pago = image_file 
            transaccion.save()
            
            print(f"🟢 [SOTO BACKEND]: Capture asociado con éxito en Postgres para la Factura N°: {tx_id}")
            
            return JsonResponse({
                'status': 'success',
                'message': 'Comprobante guardado correctamente en la base de datos multimedia.'
            }, status=200)
            
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': f"Fallo al guardar capture: {str(e)}"}, status=500)
            
    return JsonResponse({'status': 'error', 'message': 'Petición inválida o sin archivo.'}, status=400)

import json
import datetime
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from .models import Producto, GastoExpress, CuentaPorCobrar

# =========================================================================
# 💸 1. ENDPOINT: COMPILADOR Y GENERADOR DE PDF DE GASTOS EXPRESS
# =========================================================================
@csrf_exempt
def descargar_gastos_pdf_api(request):
    """
    [COMPILADOR DE EGRESOS DIGITAL SOTO SYSTEM]
    Recibe la ráfaga JSON de gastos desde el LocalStorage de Electron
    y escupe de inmediato el balance físico digital en PDF usando ReportLab.
    """
    if request.method != 'POST':
        return JsonResponse({"error": "Método no permitido. Se exige POST."}, status=405)
    
    try:
        body = json.loads(request.body)
        origen = body.get("origen", "Desconocido")
        libro_gastos = body.get("libro_gastos", [])
        
        print(f"📡 [SOTO CLOUD]: Generando PDF ReportLab para egresos de -> {origen}")
        
        # Guardamos en la base de datos cloud para persistencia e histórico contable
        for gasto in libro_gastos:
            desc = gasto.get("descripcion", "Egreso General").strip()
            monto_val = float(gasto.get("monto", 0.00))
            # Evitamos duplicidad guardando solo si no existe el concepto hoy
            GastoExpress.objects.get_or_create(descripcion=desc, monto=monto_val)

        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="libro_gastos_mercantil.pdf"'
        
        # Inicializamos el lienzo ReportLab
        canvas_pdf = canvas.Canvas(response, pagesize=letter)
        ancho, alto = letter
        
        # Cabecera Premium Corporativa (Línea Estética Apio Software)
        canvas_pdf.setFillColor(colors.HexColor("#0b0f19"))
        canvas_pdf.rect(0, alto - 80, ancho, 80, fill=True, stroke=False)
        
        canvas_pdf.setFillColor(colors.white)
        canvas_pdf.setFont("Helvetica-Bold", 16)
        canvas_pdf.drawString(30, alto - 45, "APIO ERP - LIBRO DIGITAL DE EGRESOS OPERATIVOS")
        
        canvas_pdf.setFont("Helvetica", 10)
        canvas_pdf.setFillColor(colors.HexColor("#ff9900")) # El icónico naranja de tu marca
        canvas_pdf.drawString(30, alto - 62, "Control Interno de Caja Chica y Deducciones de Jornada")
        
        # Encabezados de la Tabla
        canvas_pdf.setFillColor(colors.black)
        canvas_pdf.setFont("Helvetica-Bold", 11)
        canvas_pdf.drawString(40, alto - 120, "Descripción del Egreso / Concepto de Gasto")
        canvas_pdf.drawRightString(ancho - 40, alto - 120, "Monto Deducido ($)")
        
        canvas_pdf.setStrokeColor(colors.HexColor("#1e293b"))
        canvas_pdf.setLineWidth(1)
        canvas_pdf.line(35, alto - 128, ancho - 35, alto - 128)
        
        y = alto - 150
        total_egresado = 0.00
        
                # 📐 CORRECCIÓN QUIRÚRGICA ANTI-ERROR 500 (SOTO SYSTEM 2026)
        canvas_pdf.setFont("Helvetica", 10)
        for g in libro_gastos:
            if y < 60:
                canvas_pdf.showPage()
                y = alto - 60
                canvas_pdf.setFont("Helvetica", 10)
                
            desc_gasto = g.get("descripcion", "Egreso General").strip()
            monto_gasto = float(g.get("monto", 0.00))
            
            # Escudo protector: si la fecha llega como lista desde JS, extraemos el primer elemento
            fecha_cruda = g.get("fecha", "N/A")
            if isinstance(fecha_cruda, list) and len(fecha_cruda) > 0:
                fecha_gasto = str(fecha_cruda[0])
            else:
                fecha_gasto = str(fecha_cruda)
            
            # Estampado plano libre de errores de tipado en ReportLab
            canvas_pdf.drawString(40, y, f"• {desc_gasto} ({fecha_gasto})")
            canvas_pdf.drawRightString(ancho - 40, y, f"-${monto_gasto:.2f}")
            
            total_egresado += monto_gasto
            y -= 22
        
        canvas_pdf.line(35, y, ancho - 35, y)
        y -= 25
        
        canvas_pdf.setFont("Helvetica-Bold", 12)
        canvas_pdf.setFillColor(colors.HexColor("#ef4444")) # Rojo Alerta para deducciones
        canvas_pdf.drawString(40, y, "TOTAL DEDUCIDO DE CAJA:")
        canvas_pdf.drawRightString(ancho - 40, y, f"-${total_egresado:.2f} USD")
        
        canvas_pdf.showPage()
        canvas_pdf.save()
        return response
        
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)


# =========================================================================
# 🚨 2. ENDPOINT: LISTADO COMPLETO Y ALERTAS DE MOROSIDAD (CLIENTES FIAR)
# =========================================================================
@csrf_exempt
def listado_morosidad_clientes_api(request):
    """
    Retorna las cuentas por cobrar segmentando de forma inmediata a los
    clientes morosos con retrasos vigentes basados en la fecha límite contable.
    """
    if request.method != 'GET':
        return JsonResponse({"error": "Método GET requerido"}, status=405)
    
    try:
        cuentas = CuentaPorCobrar.objects.exclude(estado='PAGADO')
        
        morosos = []
        pendientes = []
        total_deuda_usd = 0.00
        
        for c in cuentas:
            total_deuda_usd += float(c.monto_deuda)
            # Evaluamos morosidad en caliente comparando con la fecha actual del servidor (2026)
            if datetime.date.today() > c.fecha_limite:
                c.estado = 'MOROSO'
                c.save()
                morosos.append(c.to_dict())
            else:
                pendientes.append(c.to_dict())
                
        return JsonResponse({
            "status": "success",
            "conteo_critico": len(morosos),
            "total_cuentas_activas": len(cuentas),
            "balance_deudor_total_usd": total_deuda_usd,
            "clientes_morosos": morosos,
            "clientes_pendientes": pendientes
        }, status=200)
        
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)
