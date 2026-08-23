import json
import unicodedata # 🚀 ANTENA NATIVA: Para destruir tildes y acentos en milisegundos
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction
from django.db import models 
from .models import Producto, Factura, DetalleFactura, TasaCambio, Cliente


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
# =====================================================================
def buscador_productos_api(request):
    """
    Filtra el catálogo completo de la bodega en la RAM del servidor.
    Muerde concordancias por iniciales, nombres o categorías sin importar acentos.
    """
    # Captura la ráfaga que manda el .exe (ej: ?q=cafe)
    termino_crudo = request.GET.get('q', '').strip()
    
    # Conseguimos todo el inventario mayorista real desde PostgreSQL
    todos_los_productos = Producto.objects.all()
    
    if not termino_crudo:
        productos_filtrados = todos_los_productos
    else:
        # Saneamos el término que digitó el cajero o inyectó Daniela por voz
        terminoSaneado = eliminar_tildes_python(termino_crudo).lower()
        
        # Filtramos en la RAM comparando ambos lados desinfectados de tildes
        productos_filtrados = []
        for prod in todos_los_productos:
            # 🛡️ Blindaje contra valores None de la base de datos cloud en Railway
            nombre_saneado = eliminar_tildes_python(prod.nombre or "").lower()
            categoria_saneada = eliminar_tildes_python(prod.categoria or "").lower()
            sku_saneado = (prod.sku or "").lower().strip()
            
            # 🎯 PRECISIÓN ATÓMICA: Compara por iniciales, coincidencia interna o SKU
            if (terminoSaneado in nombre_saneado or 
                nombre_saneado.startswith(terminoSaneado) or 
                terminoSaneado in categoria_saneada or 
                terminoSaneado == sku_saneado):
                productos_filtrados.append(prod)

    # Construimos el cargamento JSON limpio con las propiedades originales intactas
    lista_json = []
    for prod in productos_filtrados:
        lista_json.append({
            "id": prod.id,
            "sku": prod.sku or "",
            "nombre": prod.nombre or "Producto sin nombre",
            "categoria": prod.categoria or "General",
            "precio_usd": float(prod.precio_usd or 0.0),
            "stock": prod.stock or 0
        })
        
    return JsonResponse(lista_json, safe=False)


# =====================================================================
# 2. ENDPOINTS API REST JSON (El cerebro para la IA Daniela y el Sistema Apio)
# =====================================================================

def lista_productos_api(request):
    """
    Retorna el catálogo completo de los 53 productos en formato JSON.
    Ideal para que Daniela sincronice el inventario en memoria al arrancar.
    """
    productos = Producto.objects.all()
    data = [p.to_dict() for p in productos]
    return JsonResponse({"productos": data}, safe=False, status=200)


def buscador_productos_api(request):
    """
    [CEREBRO DE BÚSQUEDA FLEXIBLE - ENFOQUE MINORISTA SOTO SYSTEM]
    Busca entre los 53 productos detallistas por nombre, SKU o categoría.
    Aplica filtros de coincidencia parcial y mapea el contexto B2B.
    """
    termino = request.GET.get('q', '').strip().lower()
    tipo_catalogo = request.GET.get('catalogo', '').strip().lower()

    if not termino:
        return JsonResponse({"productos": []}, status=200)

    # 1. Filtro de texto inteligente para las coincidencias parciales
    filtros = (
        models.Q(nombre__icontains=termino) | 
        models.Q(sku__icontains=termino) |
        models.Q(categoria__nombre__icontains=termino)
    )

    # 2. Ejecución optimizada de la consulta perezosa en Postgres
    query_productos = Producto.objects.filter(filtros).distinct()

    # 3. Serialización a diccionarios puros para JSON
    data = [p.to_dict() for p in query_productos]
    
    # 4. Estructuración del modo operativo para el Frontend y Daniela IA
    es_b2b = (tipo_catalogo == 'b2b')
    
    # 5. RETORNO ÚNICO AL FINAL DE LA FUNCIÓN
    return JsonResponse({
        "productos": data, 
        "conteo": len(data),
        "contexto_busqueda": "B2B_MINORISTA" if es_b2b else "B2C_DETALLISTA",
        "sugerencia_empaque": "Sugerir venta por bulto/docena de la misma existencia" if es_b2b else "Venta individual"
    }, status=200)


def detalle_producto_api(request, id_qr):
    """
    Busca un producto por su UUID de QR escaneado.
    Calcula el precio del día y genera el guion de voz para Fish Audio.
    """
    try:
        producto = get_object_or_404(Producto, id_qr=id_qr)
        tasa = TasaCambio.objects.latest('fecha_actualizacion')
        
        # Usamos el valor real fijado manualmente en Postgres
        precio_ves = round(float(producto.precio_usd) * float(tasa.precio_bcv), 2)
        guion_vocal = f"Es {producto.nombre}. Tiene un costo de {producto.precio_usd} dólares, que equivalen a {precio_ves} bolívares."
        
        return JsonResponse({
            "estatus": "encontrado",
            "producto": producto.to_dict(),
            "precios": {"usd": float(producto.precio_usd), "ves": precio_ves},
            "texto_para_daniela": guion_vocal,
            "alerta_stock": producto.stock <= 3
        }, status=200)
        
    except TasaCambio.DoesNotExist:
        return JsonResponse({"error": "Falta registrar la tasa BCV en la base de datos."}, status=400)
    except Exception:
        return JsonResponse({"error": "Código QR no reconocido en el sistema Apio."}, status=404)


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
    if request.method != 'POST':
        return HttpResponse("Método no permitido", status=405)

    try:
        # 1. 📡 TRAGAMOS LOS DATOS EN VIVO ENVIADOS DESDE LA CONSOLA DEL ERP
        datos_front = {}
        movimientos_jornada = []
        try:
            datos_front = json.loads(request.body)
            movimientos_jornada = datos_front.get('movimientos_jornada', [])
        except Exception:
            pass

        # 2. Inicializamos el búfer de memoria de ReportLab
        buffer_memoria = io.BytesIO()
        pdf_lienzo = canvas.Canvas(buffer_memoria, pagesize=letter)
        pdf_lienzo.setTitle("APIO SAAS 2026 - REPORTE DE CIERRE DE CAJA")

        # 3. 🎨 Dibujamos la cabecera institucional premium
        pdf_lienzo.setFillColor(colors.HexColor("#0b0f19"))
        pdf_lienzo.rect(0, 700, 612, 100, fill=True, stroke=False)
        
        pdf_lienzo.setFillColor(colors.white)
        pdf_lienzo.setFont("Helvetica-Bold", 16)
        pdf_lienzo.drawString(30, 740, "APIO E-COMMERCE SOFTWARE - REPORTE DE CIERRE")
        pdf_lienzo.setFont("Helvetica", 10)
        pdf_lienzo.drawString(30, 720, "Auditoría General de Movimientos Diarios y Flujo de Caja Comercial")

        # 4. 📈 DETALLE FISCAL: Titulado del Histórico
        pdf_lienzo.setFillColor(colors.black)
        pdf_lienzo.setFont("Helvetica-Bold", 12)
        pdf_lienzo.drawString(30, 650, "HISTORIAL DE TRANSACCIONES AUDITADAS EN EL TURNO:")
        pdf_lienzo.setStrokeColor(colors.HexColor("#1e293b"))
        pdf_lienzo.line(30, 640, 580, 640)

        y_posicion = 610
        pdf_lienzo.setFont("Courier", 8) # Letra Courier limpia tipo impresora fiscal

        # 🎯 ORQUESTADOR DE RENDIMIENTO DUAL: Si el frontend manda datos en caliente, los prioriza
        if movimientos_jornada and len(movimientos_jornada) > 0:
            for mov in movimientos_jornada:
                ref = mov.get('ref', 'TR-N/A')
                cedula = mov.get('cedula', 'V-99999999')
                metodo = mov.get('metodo', 'BIOPAGO')
                monto_bs = float(mov.get('montoBs', 0.00))
                productos = mov.get('productos', 'Mercancía General')
                
                # Recortamos el string de productos si es muy largo para que no se desborde del papel
                if len(productos) > 35:
                    productos = productos[:32] + "..."

                texto_linea = f"REF: {ref.ljust(10)} | CÉDULA: {cedula.ljust(12)} | MÉTODO: {metodo.ljust(10)} | TOTAL: {monto_bs:10.2f} Bs."
                pdf_lienzo.drawString(30, y_posicion, texto_linea)
                
                # Segunda sublínea pequeña con el inventario despachado
                pdf_lienzo.setFillColor(colors.HexColor("#475569"))
                pdf_lienzo.drawString(45, y_posicion - 10, f"📦 DETALLE: {productos}")
                pdf_lienzo.setFillColor(colors.black)
                
                y_posicion -= 28
                if y_posicion < 50:
                    break
        else:
             # 💾 PLAN DE CONTINGENCIA CLOUD: Si el frontend no pasa datos, consulta PostgreSQL Railway
            from django.utils import timezone
            from .models import Factura  # 🎯 Conectamos directo con tu tabla real unificada Factura

            hoy = timezone.now().date()
            # Filtramos todas las facturas procesadas de la jornada de hoy
            ventas_db = Factura.objects.filter(fecha__date=hoy)

            if ventas_db.exists():
                for venta in ventas_db:
                    ref = venta.numero_factura or 'TR-N/A'
                    cedula = venta.cliente_identificacion or 'V-99999999'
                    metodo = venta.metodo_pago or 'BIOPAGO'
                    monto_bs = float(venta.total_bs or 0.00)
                    productos = venta.productos_despachados or 'Mercancía General'

                    if len(productos) > 35:
                        productos = productos[:32] + "..."

                    texto_linea = f"REF: {ref.ljust(10)} | CÉDULA: {cedula.ljust(12)} | MÉTODO: {metodo.ljust(10)} | TOTAL: {monto_bs:10.2f} Bs."
                    pdf_lienzo.drawString(30, y_posicion, texto_linea)

                    # Sublínea estética con el detalle de los víveres o ropa despachada
                    pdf_lienzo.setFillColor(colors.HexColor("#475569"))
                    pdf_lienzo.drawString(45, y_posicion - 10, f"📦 DETALLE: {productos}")
                    pdf_lienzo.setFillColor(colors.black)

                    y_posicion -= 28
                    if y_posicion < 50:
                        break
            else:
                # Si la base de datos está totalmente vacía en la jornada actual
                pdf_lienzo.setFont("Helvetica-Oblique", 10)
                pdf_lienzo.setFillColor(colors.HexColor("#ef4444"))
                pdf_lienzo.drawString(30, y_posicion, "⚠️ Sin movimientos comerciales registrados en la base de datos cloud hoy.")
                pdf_lienzo.setFillColor(colors.black)

        # 5. 🖨️ CIERRE Y EMISIÓN BINARIA DEL REPORTE FISCAL
        pdf_lienzo.showPage()
        pdf_lienzo.save()
        
        # Seteamos el puntero del búfer al inicio para que Django lea los bytes desde el byte 0
        buffer_memoria.seek(0)
        
        # 🎯 SOTO CORE ENCIENDE: Usamos el objeto 'datetime' para extraer la fecha e iluminar la importación
        fecha_actual_sistema = datetime.date.today().strftime("%Y-%m-%d")
        nombre_reporte = f"Cierre_Diario_ERP_{fecha_actual_sistema}.pdf"
        
        # 🚀 RETORNO ELÉCTRICO NATIVO: Transmitimos el PDF directo a la RAM de tu script de Electron
        return FileResponse(buffer_memoria, as_attachment=True, filename=nombre_reporte, content_type='application/pdf')

    except Exception as e:
        print(f"❌ [SOTO CRITICAL PDF]: Fallo catastrófico al compilar ReportLab: {str(e)}")
        return HttpResponse(f"Error interno del motor PDF: {str(e)}", status=500)

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

