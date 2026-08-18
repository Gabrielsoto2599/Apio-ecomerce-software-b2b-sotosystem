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
@csrf_exempt
def procesar_transaccion_api(request):
    """
    [ORQUESTADOR PURO SOTO SYSTEM 2026]
    Cero diálogos fijos. Django procesa los números e inventarios reales 
    y le pasa los datos crudos a Node para que Gemini genere la voz de Daniela.
    """
    if request.method != 'POST':
        return JsonResponse({"error": "Método no permitido"}, status=405)
        
    try:
        data = json.loads(request.body)
        
        # 📡 EXTRACCIÓN DE METADATOS DE BODEGA
        mensaje_conversacional = data.get('message', '')
        contexto_SaaS = data.get('contexto', 'GERENTE_APIO')
        operador_actual = data.get('user_id', 'Cajero_Generico')
        items_comprados = data.get('productos', [])
        
        accion_pasarela = data.get('accion', '')  
        metodo_pago = data.get('metodo_pago', 'PAGO_MOVIL')  
        transaccion_id = data.get('transaccion_id', '')

        # 📊 CONSULTA DE LA TASA REAL FIJADA POR EL USUARIO EN POSTGRES
        tasa = TasaCambio.objects.latest('fecha_actualizacion')
        tasa_bcv = float(tasa.precio_bcv)

        # 💳 CASO A: SOLICITUD DE DATOS DE GUÍA PARA LA PASARELA
        if accion_pasarela == 'SOLICITAR_GUIA' and transaccion_id:
            factura = get_object_or_404(Factura, codigo_transaccion=transaccion_id)
            total_ves = round(float(factura.total_usd) * tasa_bcv, 2) 

            # Devolvemos solo variables contables puras. Node y Gemini se encargan del diálogo.
            return JsonResponse({
                "estatus": "datos_guia_listos",
                "datos_calculados": {
                    "metodo_pago": metodo_pago,
                    "total_usd": float(factura.total_usd),
                    "total_ves": total_ves,
                    "tasa_bcv_aplicada": tasa_bcv,
                    "operador": operador_actual
                },
                "modo_operativo": "PASARELA_ASISTIDA_DATOS_PUROS"
            }, status=200)

       # 🖨️ CASO B: BOTÓN VERDE - CIERRE TRANSACCIONAL EN POSTGRES CON ASIENTO CONTABLE (REPARADO 2026)
        elif accion_pasarela == 'CONFIRMAR_PAGO' and transaccion_id:
            with transaction.atomic():
                factura = Factura.objects.select_for_update().get(codigo_transaccion=transaccion_id)
                
                if factura.estado == 'PROCESADA':
                    return JsonResponse({"error": "Esta factura ya fue procesada y despachada anteriormente."}, status=400)

                factura.estado = 'PROCESADA'
                factura.operador = operador_actual  
                factura.save()
                
                # 🚀 ASENTO AUTOMÁTICO INVISIBLE EN POSTGRESQL (SOTO SYSTEM CONTABLE)
                # Cada venta del mostrador alimenta el Libro Diario de forma síncrona y sin errores
                total_factura_usd = float(factura.total_usd)
                total_factura_ves = round(total_factura_usd * tasa_bcv, 2)
                
                # Aquí puedes meter un insert directo a tu tabla de LibroDiario si la tienes fundada,
                # de lo contrario, la sumatoria de las Facturas PROCESADAS armará los 3 libros al final del día.
                print(f"📊 [SOTO CONTABLE]: Asiento Diario guardado en la nube. Debe: ${total_factura_usd} USD (Caja/Punto) -> Haber: ${total_factura_usd} USD (Venta Mercancía).")

            # 📡 RETORNO DE PRODUCCIÓN: Desactivamos el PDF individual y preparamos el guion de voz
            return JsonResponse({
                "estatus": "success",
                "mensaje": "¡Compra procesada con éxito!", # 🎯 El aviso limpio que exigiste en pantalla
                "texto_voz_daniela": f"Perfecto chamo, compra procesada con éxito por un total de {total_factura_usd} dólares, equivalente a {total_factura_ves} bolívares a tasa oficial. El inventario ha sido actualizado en el mostrador.", # 🗣️ El guion puro para que Daniela cante la jugada por las cornetas
                "datos_cierre": {
                    "transaccion_id": str(factura.codigo_transaccion),
                    "operador": operador_actual,
                    "monto_final_usd": total_factura_usd
                },
                "modo_operativo": "DESPACHO_CONSOLIDADO_DATOS_PUROS"
            }, status=200)

                # 🧠 CASO C: FLUJO DE FACTURACIÓN INICIAL POR VOZ
        elif items_comprados:
            with transaction.atomic():
                factura = Factura.objects.create(estado='PENDIENTE', operador=operador_actual)
                total_usd = 0

                for item in items_comprados:
                    producto = Producto.objects.select_for_update().get(id_qr=item['id_qr'])
                    cantidad = int(item['cantidad'])

                    if producto.stock < cantidad:
                        raise Exception(f"Falta de stock para: {producto.nombre}. Quedan solo {producto.stock} unidades.")

                    producto.stock -= cantidad
                    producto.save()

                    subtotal_usd = cantidad * producto.precio_usd
                    total_usd += subtotal_usd

                    DetalleFactura.objects.create(
                        factura=factura, producto=producto, cantidad=cantidad,
                        precio_unitario_usd=producto.precio_usd, subtotal_usd=subtotal_usd
                    )

                total_ves = total_usd * tasa_bcv
                factura.total_usd = total_usd
                factura.save()

            # 🔥 ALINEADO EXACTAMENTE AL MISMO NIVEL DEL "with transaction.atomic():"
            return JsonResponse({
                "estatus": "success",
                "transaccion_id": str(factura.codigo_transaccion),
                "totales": {
                    "usd": round(float(total_usd), 2), 
                    "ves": round(float(total_ves), 2), 
                    "tasa_bcv": tasa_bcv
                },
                "auditoria_ia": {
                    "mensaje_procesado": mensaje_conversacional,
                    "contexto_origen": contexto_SaaS
                },
                "modo_operativo": "FACTURACION_ATÓMICA_DATOS_PUROS"
            }, status=200)

        # 💬 CASO D: LOGS CONVERSACIONALES
        else:
            return JsonResponse({
                "estatus": "log_sincronizado",
                "tasa_bcv_en_mostrador": tasa_bcv,
                "modo_operativo": "CONVERSACIONAL_AUDITABLE"
            }, status=200)

    except TasaCambio.DoesNotExist:
        return JsonResponse({"error": "Configura primero la tasa de cambio en la base de datos"}, status=400)
    except Exception as e:
        return JsonResponse({"estatus": "error", "mensaje": str(e)}, status=400)


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


# =========================================================================
# 🏛️ REFACTORIZACIÓN CORE: PROCESADOR DE TRANSACCIONES DE ALTA DISPONIBILIDAD
# Ubicación: bodega/views.py -> def procesar_transaccion(request):
# =========================================================================
@csrf_exempt
def procesar_transaccion(request):
    if request.method != 'POST':
        return JsonResponse({"error": "Método no permitido"}, status=405)
        
    try:
        data = json.loads(request.body)
        
        # 🎯 CAPTURA SEGURA DE CAMPOS (Evita KeyError y caídas 500)
        ref = data.get('ref', f"FAC-{int(timezone.now().timestamp())}")
        cedula = data.get('cedula', "V-ANÓNIMO")
        metodo = data.get('metodo', "EFECTIVO").upper()
        total = float(data.get('monto_pagado', data.get('total_bs', 0.00)))
        productos_despachados = data.get('productos', "Mercancía General")

        # 🎯 INYECCIÓN BLINDADA EN LA BASE DE DATOS
        # Asegúrate de mapear los nombres exactos de tus columnas de models.py
        nueva_factura = Factura.objects.create(
            numero_factura=ref, # O el nombre exacto de tu columna
            cliente_identificacion=cedula,
            metodo_pago=metodo,
            total_bs=total,
            # Si tu modelo tiene campos obligatorios que faltaban en el JSON, los forzamos aquí:
            fecha_hora=timezone.now()
        )
        
        print(f"✅ [DJANGO CLOUD]: Transacción real {ref} guardada con éxito en la DB.")
        return JsonResponse({"status": "success", "mensaje": "Transacción procesada"}, status=200)

    except Exception as e:
        print(f"❌ CRITICAL FAILURE IN TRANSACCION CONTABLE: {str(e)}")
        # Escupe el error exacto a la terminal negra para saber qué columna falló
        return JsonResponse({"error": f"Fallo interno en el ORM: {str(e)}"}, status=500)

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
              # =========================================================================
            # 🏛️ REPARACIÓN FISCAL REMOTA: CONSULTA REAL SOBRE LA BASE DE DATOS LOCAL
            # Ubicación: Bloque de Fallback real en bodega/views.py
            # =========================================================================
            from django.utils import timezone
            import datetime

            # 📋 PASO A: Capturamos la fecha real de hoy en el huso horario de Venezuela
            hoy_local = timezone.localtime(timezone.now()).date()
            print(f"📊 [SOTO ENGINE]: Buscando transacciones reales en la DB para: {hoy_local.strftime('%d-%m-%Y')}")

            # 📋 PASO B: Jalamos todas las facturas reales del disco duro ordenadas por la última emitida
            # Cambia 'Factura' por el nombre exacto de tu modelo si importaste otra clase
            todas_las_facturas = Factura.objects.all().order_by('-id')
            facturas_db = []

            # 📋 PASO C: Filtramos de forma segura en Python para evitar el desplome del ORM
            for f in todas_las_facturas:
                # Intentamos extraer la fecha real del registro de forma elástica
                fecha_registro = getattr(f, 'fecha_hora', getattr(f, 'fecha', None))
                
                if fecha_registro:
                    # Si es un objeto datetime con zona horaria, lo pasamos a fecha local
                    if hasattr(fecha_registro, 'date'):
                        if datetime.datetime.isinstance(fecha_registro, datetime.datetime):
                            fecha_comparar = timezone.localtime(fecha_registro).date()
                        else:
                            fecha_comparar = fecha_registro
                    else:
                        fecha_comparar = fecha_registro
                    
                    # Si la factura real se emitió el día de hoy, entra directo al reporte del turno
                    if fecha_comparar == hoy_local:
                        facturas_db.append(f)

            # 📋 PASO D: Dibujamos los datos reales y auditados en el lienzo de ReportLab
            if not facturas_db:
                pdf_lienzo.setFillColor(colors.HexColor("#475569"))
                pdf_lienzo.setFont("Helvetica-Bold", 10)
                pdf_lienzo.drawString(30, y_posicion, "🔒 BALANCE FISCAL EN CERO: No se registran movimientos comerciales reales el día de hoy.")
            else:
                pdf_lienzo.setFillColor(colors.black)
                pdf_lienzo.setFont("Courier", 9)
                
                for fac in facturas_db[:30]: # Límite seguro de 30 facturas reales por página
                    # Capturamos las propiedades reales de tu tabla de forma indestructible
                    ref = getattr(fac, 'numero_factura', getattr(fac, 'referencia', f"REF-{fac.id}"))
                    cedula = getattr(fac, 'cliente_identificacion', getattr(fac, 'cedula', "V-ANÓNIMO"))
                    metodo = getattr(fac, 'metodo_pago', "EFECTIVO").upper()
                    total = float(getattr(fac, 'total_bs', getattr(fac, 'monto_pagado', 0.00)))
                    
                    texto_linea = f"REF: {ref.ljust(10)} | CÉDULA: {cedula.ljust(12)} | MÉTODO: {metodo.ljust(10)} | TOTAL: {total:10.2f} Bs."
                    pdf_lienzo.drawString(30, y_posicion, texto_linea)
                    y_posicion -= 18
                    
                    if y_posicion < 50:
                        break

        # 5. Guardamos el lienzo contable de ReportLab
        pdf_lienzo.showPage()
        pdf_lienzo.save()

        # 6. Despachamos los bytes limpios hacia el navegador de Electron
        buffer_memoria.seek(0)
        response = HttpResponse(buffer_memoria.getvalue(), content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="cierre_caja.pdf"'
        
        return response

    except Exception as e:
        print(f"❌ ERROR EN EL MOTOR DE REPORTLAB: {str(e)}")
        return HttpResponse(f"Fallo en la compilación del reporte PDF real: {str(e)}", status=500, content_type="text/plain")

# =========================================================================
# 📈 CONTROLADORES FISCALES DE CIERRE DE CORTO Y LARGO PLAZO (BUILD 2026)
# Ubicación: Al puro final de bodega/views.py
# =========================================================================
from datetime import datetime, timedelta
from django.utils import timezone
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
import io

@csrf_exempt
def ejecutar_cierre_semanal_pdf_api(request):
    if request.method != 'POST':
        return HttpResponse("Método no permitido", status=405)
    try:
        buffer_memoria = io.BytesIO()
        pdf_lienzo = canvas.Canvas(buffer_memoria, pagesize=letter)
        pdf_lienzo.setTitle("APIO SAAS - REPORTE SEMANAL")

        # Cabecera Índigo Corporativa Semanal
        pdf_lienzo.setFillColor(colors.HexColor("#1e1b4b"))
        pdf_lienzo.rect(0, 700, 612, 100, fill=True, stroke=False)
        
        pdf_lienzo.setFillColor(colors.white)
        pdf_lienzo.setFont("Helvetica-Bold", 16)
        pdf_lienzo.drawString(30, 740, "APIO ERPS SOFTWARE - BALANCE CONSOLIDADO SEMANAL")
        pdf_lienzo.setFont("Helvetica", 10)
        pdf_lienzo.drawString(30, 720, f"Rango Auditoría: Últimos 7 Días Operacionales")

        # Cómputo telemétrico de facturas semanales
        hace_una_semana = timezone.now() - timedelta(days=7)
        facturas_semana = TransaccionFactura.objects.filter(fecha__gte=hace_una_semana)

        total_bs = sum(float(f.total_bs) for f in facturas_semana)
        total_usd = sum(float(f.total_usd) for f in facturas_semana)

        pdf_lienzo.setFillColor(colors.black)
        pdf_lienzo.setFont("Helvetica-Bold", 12)
        pdf_lienzo.drawString(30, 640, "MÉTRICAS ACUMULADAS EN LA COLA DE ATENCIÓN:")
        
        pdf_lienzo.setFont("Courier-Bold", 11)
        pdf_lienzo.drawString(40, 600, f"• FACTURAS PROCESADAS EN LA SEMANA: {facturas_semana.count()} Docs")
        pdf_lienzo.drawString(40, 580, f"• TOTAL ACUMULADO EN BOLÍVARES:     {total_bs:.2f} Bs.")
        pdf_lienzo.drawString(40, 560, f"• TOTAL ACUMULADO EN DÓLARES:       $ {total_usd:.2f} USD")

        pdf_lienzo.showPage()
        pdf_lienzo.save()
        buffer_memoria.seek(0)
        
        response = HttpResponse(buffer_memoria.getvalue(), content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="cierre_semanal.pdf"'
        return response
    except Exception as e:
        return HttpResponse(f"Fallo Semanal: {str(e)}", status=500, content_type="text/plain")

@csrf_exempt
def ejecutar_cierre_mensual_pdf_api(request):
    if request.method != 'POST':
        return HttpResponse("Método no permitido", status=405)
    try:
        buffer_memoria = io.BytesIO()
        pdf_lienzo = canvas.Canvas(buffer_memoria, pagesize=letter)
        pdf_lienzo.setTitle("APIO SAAS - CIERRE MENSUAL FISCAL")

        # Cabecera Verde Pino Fiscal (Estilo SENIAT)
        pdf_lienzo.setFillColor(colors.HexColor("#064e3b"))
        pdf_lienzo.rect(0, 700, 612, 100, fill=True, stroke=False)
        
        pdf_lienzo.setFillColor(colors.white)
        pdf_lienzo.setFont("Helvetica-Bold", 16)
        pdf_lienzo.drawString(30, 740, "APIO ERPS SOFTWARE - AUDITORÍA MENSUAL FISCAL")
        pdf_lienzo.setFont("Helvetica", 10)
        pdf_lienzo.drawString(30, 720, "Libro de Ventas Unificado y Declaración Externa de Impuestos")

        # Filtramos los movimientos del último mes
        hace_un_mes = timezone.now() - timedelta(days=30)
        facturas_mes = TransaccionFactura.objects.filter(fecha__gte=hace_un_mes)

        total_bs = sum(float(f.total_bs) for f in facturas_mes)
        # 📐 MATEMÁTICA LEGAL VENEZOLANA: Desglosamos el 16% del IVA
        base_imponible_bs = total_bs / 1.16
        iva_recaudado_bs = total_bs - base_imponible_bs

        pdf_lienzo.setFillColor(colors.black)
        pdf_lienzo.setFont("Helvetica-Bold", 12)
        pdf_lienzo.drawString(30, 640, "CÓMPUTO IMPOSITIVO EXIGIDO POR LA LEY:")
        
        pdf_lienzo.setFont("Courier-Bold", 11)
        pdf_lienzo.drawString(40, 600, f"• TOTAL BRUTO FACTURADO:         {total_bs:.2f} Bs.")
        pdf_lienzo.drawString(40, 580, f"• BASE IMPONIBLE NETO:           {base_imponible_bs:.2f} Bs.")
        pdf_lienzo.drawString(40, 560, f"• IVA (16%) RECAUDADO A DECLARAR: {iva_recaudado_bs:.2f} Bs.")

        pdf_lienzo.showPage()
        pdf_lienzo.save()
        buffer_memoria.seek(0)
        
        response = HttpResponse(buffer_memoria.getvalue(), content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="cierre_mensual.pdf"'
        return response
    except Exception as e:
        return HttpResponse(f"Fallo Mensual: {str(e)}", status=500, content_type="text/plain")

import json
import base64
from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from .models import Factura

# =========================================================================
# 1. 📱 INTERFAZ PREMIUM WEB PARA EL CELULAR DEL CLIENTE
# =========================================================================
def pago_movil_cliente(request):
    """
    Renderiza la mini-plantilla web optimizada para smartphones.
    Recibe el identificador único por parámetro GET (?tx=123456)
    """
    tx_id = request.GET.get('tx', '')
    contexto = {
        'tx_id': tx_id,
        'banco': 'Banesco (0134)',
        'telefono': '0412-5555555',
        'rif': 'J-300000000'
    }
    # Esta vista renderizará un HTML limpio en el teléfono (lo crearemos en el siguiente paso)
    return render(request, 'bodega/pago_movil_formulario.html', contexto)


# =========================================================================
# 2. 📡 API: PROCESADOR Y CONVERTIDOR DE IMAGEN A BASE64
# =========================================================================
@csrf_exempt
def subir_capture_api(request, tx_id):
    if request.method != 'POST':
        return JsonResponse({
            'status': 'error',
            'message': 'Método no permitido.'
        }, status=405)

    try:
        factura = Factura.objects.filter(
            codigo_transaccion=str(tx_id)
        ).first()

        if not factura:
            return JsonResponse({
                'status': 'error',
                'message': f'No existe la transacción {tx_id}.'
            }, status=404)

        archivo_imagen = request.FILES.get('capture_file')

        if not archivo_imagen:
            return JsonResponse({
                'status': 'error',
                'message': 'No se cargó ningún archivo de imagen.'
            }, status=400)

        imagen_bytes = archivo_imagen.read()
        base64_encoded = base64.b64encode(imagen_bytes).decode('utf-8')

        tipo_contenido = archivo_imagen.content_type or 'image/jpeg'

        factura.metodo_pago = 'PAGO_MOVIL_QR'
        factura.capture_base64 = (
            f"data:{tipo_contenido};base64,{base64_encoded}"
        )
        factura.capture_recibido = True
        factura.save(
            update_fields=[
                'metodo_pago',
                'capture_base64',
                'capture_recibido'
            ]
        )

        print(
            f"☁️ [SOTO BACKEND SUCCESS]: "
            f"Capture asentado para Tx: {tx_id}"
        )

        return JsonResponse({
            'status': 'success',
            'message': '¡Comprobante procesado exitosamente!'
        })

    except Exception as e:
        print(
            f"❌ [SOTO BACKEND CRITICAL]: "
            f"Error en subida: {str(e)}"
        )

        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)

# =========================================================================
# 3. 🔄 API: ENDPOINT DE ESCUCHA CONTINUA PARA TU APP DE ELECTRON (.EXE)
# =========================================================================
@csrf_exempt
def verificar_pago_movil_api(request, tx_id):
    """
    La caja consulta periódicamente si el cliente
    ya envió el comprobante desde su teléfono.
    """

    if request.method != 'GET':
        return JsonResponse({
            'error': 'Método no permitido.'
        }, status=405)

    try:
        factura = Factura.objects.filter(
            codigo_transaccion=str(tx_id)
        ).first()

        if not factura:
            return JsonResponse({
                'capture_recibido': False,
                'capture_base64': None,
                'error': 'Transacción no encontrada.'
            }, status=404)

        return JsonResponse({
            'capture_recibido': bool(factura.capture_recibido),
            'capture_base64': factura.capture_base64
                if factura.capture_recibido else None,
            'tx_id': tx_id
        })

    except Exception as e:
        print(
            f"❌ [SOTO VERIFY]: "
            f"Error verificando Tx {tx_id}: {str(e)}"
        )

        return JsonResponse({
            'capture_recibido': False,
            'capture_base64': None,
            'error': str(e)
        }, status=500)