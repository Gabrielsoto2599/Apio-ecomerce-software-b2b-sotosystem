// ====================================================================
// SOTO SYSTEM WINDOWS CHASSIS - RUNTIME DE ESCRITORIO (BUILD DE GALA 2026)
// Ubicación: Ecomerce_B2B_Apio/main.cjs
// ====================================================================
const { app, BrowserWindow, ipcMain, shell } = require('electron'); // 🎯 SOLUCIONADO: Se inyecta 'shell' para pulverizar el ReferenceError
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
    ventana.loadURL('https://apio-ecomerce-software-b2b-sotosystem-production.up.railway.app/');
  }
}

// 🧠 ESCUCHA EL CANAL IPC DESDE LA PASARELA DE LA PANTALLA (home.js)
ipcMain.on('abrir-app-cobro', (_, metodo) => { 
    console.log(`[Apio OS Bridge]: Recibida orden para ejecutar pasarela: ${metodo}`);

    if (metodo === 'cashea') {
        try {
            // 🌐 CASHEA MERCHANT PORTAL: Abre de forma nativa y segura en el navegador predeterminado de Windows
            shell.openExternal('https://merchants.cashea.app/');
            console.log(`[Apio OS Bridge]: Desplegando portal web de Cashea Merchant con éxito.`);
        } catch (err) {
            console.error(`[Apio OS Bridge]: Error al abrir el portal externo de Cashea:`, err.message);
        }
        
    } else if (metodo === 'biopago') {
        console.log(`[Apio OS Bridge]: Invocando Biopago fijando el directorio raíz...`);
        
        // 🎯 Forzamos a PowerShell a iniciar el proceso de forma aislada e independiente de Electron
        const comandoPowerShell = "powershell -Command \"Start-Process 'C:\\BiopagoBDV\\Biopago.exe' -Verb RunAs\"";
        
        // 🛡️ El secreto de ingeniería de Gabriel: Forzamos a Node.js a pararse DENTRO de la carpeta del banco
        exec(comandoPowerShell, { cwd: 'C:\\BiopagoBDV' }, (error) => {
            if (error) {
                console.error(`[Apio OS Bridge]: Error al lanzar el proceso elevado del BDV:`, error);
            } else {
                console.log(`[Apio OS Bridge]: Orden de ejecución despachada correctamente.`);
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
