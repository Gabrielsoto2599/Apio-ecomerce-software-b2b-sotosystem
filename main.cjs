// ====================================================================
// SOTO SYSTEM WINDOWS CHASSIS - RUNTIME DE ESCRITORIO (BUILD 2026)
// Ubicación: Ecomerce_B2B_Apio/main.cjs
// ====================================================================
const { app, BrowserWindow, ipcMain } = require('electron'); 
const path = require('path');
const { exec } = require('child_process'); // ⚙️ Módulo de Node para levantar ejecutables de Windows

function crearVentanaApio() {
  const ventana = new BrowserWindow({
    width: 1366,
    height: 768,
    autoHideMenuBar: true, 
    icon: path.join(__dirname, 'public/assets/daniela.png'), 
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      // 🛡️ ENLACE DE CONTEXTO: Vincula el archivo puente para hablar con home.js de forma segura
      preload: path.join(__dirname, 'preload.cjs') 
    }
  });

  if (app.isPackaged) {
    ventana.loadFile(path.join(__dirname, 'dist/index.html'));
  } else {
    ventana.loadURL('http://localhost:5173');
  }
}

// 🧠 ESCUCHA EL CANAL IPC DESDE LA PASARELA DE LA PANTALLA (home.js)
ipcMain.on('abrir-app-cobro', (_, metodo) => { // 🎯 Usamos "_" para indicar que el evento se ignora
    console.log(`[Apio OS Bridge]: Recibida orden para ejecutar pasarela: ${metodo}`);

    if (metodo === 'cashea') {
        // 🌐 CASHEA WEB MERCHANT: Abre la plataforma oficial en el navegador predeterminado de la PC
        shell.openExternal('https://merchants.cashea.app/');
        console.log(`[Apio OS Bridge]: Desplegando portal web de Cashea Merchant.`);
        
    } else if (metodo === 'biopago') {
        console.log(`[Apio OS Bridge]: Invocando ejecutable nativo de Biopago BDV...`);
        
        // ☝️ RUTA EXACTA DETECTADA EN LA AUDITORÍA DE PROPIEDADES
        const rutaRealBiopago = '"C:\\BiopagoBDV\\Biopago.exe"'; 
        
        exec(rutaRealBiopago, (error) => {
            if (error) {
                console.error(`[Apio OS Bridge]: Error al levantar Biopago. Verifique los permisos del sistema:`, error);
            } else {
                console.log(`[Apio OS Bridge]: ¡Biopago BDV ejecutado con éxito de forma nativa!`);
            }
        });
    }
});

app.whenReady().then(() => {
  crearVentanaApio();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) crearVentanaApio();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
