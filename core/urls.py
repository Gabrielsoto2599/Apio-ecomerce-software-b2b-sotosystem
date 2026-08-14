# =========================================================================
# 📡 ENRUTADOR MAESTRO INTERNACIONAL - CORE DJANGO (RAÍZ DEL PROYECTO)
# Ubicación: CarpetaPrincipalDelProyecto/urls.py
# =========================================================================
from django.contrib import admin
from django.urls import path, include  # 🎯 Asegúrate de importar 'include'

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # 🚀 EL PUENTE INDESTRUCTIBLE: Enganchamos todas las rutas de tu bodega al núcleo
    path('', include('bodega.urls')), 
]
