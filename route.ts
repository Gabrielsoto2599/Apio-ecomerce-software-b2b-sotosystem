import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, 
});

// Definimos la interfaz estricta del Cliente para el Backend
interface ClienteDB {
  id_clie: number;
  nombre: string;
  cedula: string;
  fecha: string;
  genero: string;
  estado_civil?: string;
}

// ==================================================================================
// MÉTODO GET: LEE LOS CLIENTES DESDE LA BASE DE DATOS DE APIO SaaS
// ==================================================================================
export async function GET() {
  try {
    const query = 'SELECT * FROM clientes ORDER BY id_clie DESC;';
    const res = await pool.query(query);
    
    return NextResponse.json(res.rows as ClienteDB[], { status: 200 });
  } catch (error) {
    console.error("Error en GET /api/clientes:", error);
    return NextResponse.json(
      { error: 'Error crítico al leer los registros de la base de datos' }, 
      { status: 500 }
    );
  }
}

// ==================================================================================
// MÉTODO POST: INSERTA UN NUEVO CLIENTE SIN USAR REGLAS PL ANYS
// ==================================================================================
export async function POST(request: Request) {
  try {
    // Tipamos el cuerpo como una estructura desconocida primero para procesarla de forma segura
    const body = await request.json() as Partial<ClienteDB>; 
    
    const { nombre, cedula, fecha, genero } = body;

    // Validación básica de campos obligatorios
    if (!nombre || !cedula) {
      return NextResponse.json(
        { error: 'Campos obligatorios faltantes (nombre o cedula)' }, 
        { status: 400 }
      );
    }

    const query = `
      INSERT INTO clientes (nombre, cedula, fecha, genero)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    
    const values = [nombre, cedula, fecha || null, genero || 'M'];
    const res = await pool.query(query, values);

    return NextResponse.json(res.rows[0] as ClienteDB, { status: 201 });
  } catch (error) {
    console.error("Error en POST /api/clientes:", error);
    return NextResponse.json(
      { error: 'Error interno al guardar en Soto System DB' }, 
      { status: 500 }
    );
  }
}
