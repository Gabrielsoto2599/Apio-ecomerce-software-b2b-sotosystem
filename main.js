
// ====================================================================
// SOTO SYSTEM WINDOWS CHASSIS - RUNTIME DE ESCRITORIO (BUILD 2026)
// Ubicación: Ecomerce_B2B_Apio/main.cjs
// ====================================================================
const { app, BrowserWindow } = require('electron');
const path = require('path');

function crearVentanaApio() {
  const ventana = new BrowserWindow({
    width: 1366,
    height: 768,
    autoHideMenuBar: true, // Esconde la barra de herramientas para vista de quiosco limpia
    icon: path.join(__dirname, 'public/assets/daniela.png'), // Mapea el icono en la barra de tareas
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Si la app está empaquetada, carga el index compilado, si no, el local dev de Vite
  if (app.isPackaged) {
    ventana.loadFile(path.join(__dirname, 'dist/index.html'));
  } else {
    ventana.loadURL('http://localhost:5173');
  }
}

app.whenReady().then(() => {
  crearVentanaApio();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) crearVentanaApio();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
