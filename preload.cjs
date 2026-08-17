// ====================================================================
// SOTO SYSTEM SECURITY BRIDGE - CONECTOR DE CONTEXTO SEGURO
// Ubicación: Ecomerce_B2B_Apio/preload.cjs
// ====================================================================
const { contextBridge, ipcRenderer } = require('electron');

// Exponemos de manera segura la API al objeto global 'window' del frontend
contextBridge.exposeInMainWorld('electronAPI', {
    abrirAppCobroLocal: (metodo) => ipcRenderer.send('abrir-app-cobro', metodo)
});
