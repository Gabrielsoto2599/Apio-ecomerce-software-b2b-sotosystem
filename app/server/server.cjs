// ====================================================================
// SOTO SYSTEM CORE PROXY - SERVER DE ESCRITORIO UNIFICADO (BUILD 2026)
// Ubicación: software_pc/server.cjs (Versión Indestructible Cloud)
// ====================================================================
const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const { Pool } = require('pg');

const app = express();
const corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://127.0.0.1:5173'
        // Aquí posteriormente agregaremos el dominio
        // de producción del frontend
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());

// 📊 CONEXIÓN MAESTRA AL POSTGRESQL DE RAILWAY DESDE LA PC
// Reutilizamos de forma exacta la contraseña e ID de tu base de datos Cloud
const pool = new Pool({
    connectionString: 'postgresql://postgres:nPYwXvHGDZHhWbtdBJBKOPWejCosEweG@sakura.proxy.rlwy.net:58280/railway',
    ssl: { rejectUnauthorized: false }, // Blindaje SSL exigido por los servidores en la nube
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Creamos el servidor HTTP envolviendo Express para el acoplamiento dual
const server = http.createServer(app);

// 🚀 LEVANTAMOS LA ANTENA WEBSOCKET LOCAL PARA SINTONIZAR EL HOME.JS
const wss = new WebSocket.Server({ noServer: true });

// Diccionario en memoria RAM para las terminales de caja locales
const clientesActivos = new Map();

// Endpoint de telemetría y salud fiscal
app.get('/api/salud-cloud', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ 
            status: 'CONEXIÓN_EXITOSA_A_RAILWAY', 
            modulo: 'Soto System Apio ERP',
            timestamp_nube: result.rows[0].now 
        });
    } catch (err) {
        res.status(500).json({ error: 'FALLO_DE_ANTENA_CLOUD', detalles: err.message });
    }
});

// 🔌 ORQUESTADOR WEBSOCKET: Conecta el Home de la PC con la Nube y las Cornetas
wss.on('connection', (ws, req) => {
    console.log("🔌 [APIO PC SOCKET]: Canal enganchado con el frontend web de la caja.");
    
    ws.on('message', async (message) => {
        try {
            const payload = JSON.parse(message);
            
            // Si llega la orden de reproducir por los altavoces
            if (payload.evento === "REPRODUCIR_VOZ_DANIELA") {
                console.log(`🔊 [SOTO AUDIO]: Transmitiendo diálogo dinámico a las cornetas: "${payload.datos.texto}"`);
                // Retransmitimos la ráfaga al frontend para que active el window.speechSynthesis
                ws.send(JSON.stringify(payload));
            }

        } catch (err) {
            console.error("❌ [APIO SOCKET ERROR]: Payload corrupto:", err.message);
        }
    });

    ws.on('close', () => {
        console.log("🔌 [APIO PC SOCKET]: Canal liberado de la memoria RAM local.");
    });
});

// Interceptor químico para mutar el protocolo de HTTP a WS de alta velocidad
server.on('upgrade', (request, socket, head) => {
    const { URL } = require('url');
    const pathname = new URL(request.url, `http://${request.headers.host}`).pathname;

    if (pathname === '/ws/local') {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
        });
    } else {
        socket.destroy();
    }
});

// 🏁 ARRANCAR ENTORNO CONTABLE Y TELEMÉTRICO
const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log("----------------------------------------------------------------");
    console.log(`🚀 APIO PC SERVER ONLINE - PROXY ROBUSTO DE HARDWARE ACTIVO`);
    console.log(`Conectado de forma indestructible al PostgreSQL de Railway.`);
    console.log(`Escuchando exitosamente en el puerto: ${PORT}`);
    console.log("----------------------------------------------------------------");
});
