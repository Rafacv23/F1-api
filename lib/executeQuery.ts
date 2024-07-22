// Función para ejecutar una consulta SQL con parámetros preparados
import { client } from "@/lib/turso"
export async function executeQuery(
  sql: string,
  args: any[] = []
): Promise<any> {
  try {
    const data = await client.execute({ sql: sql, args: args })
    return data.rows
  } catch (error: any) {
    throw new Error("Error executing SQL query: " + error.message)
  }
}
