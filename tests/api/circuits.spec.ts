import { test, expect } from "@playwright/test"

test.describe("GET /api/circuits", async () => {
  test("should return circuits data with default limit and offset", async ({
    request,
  }) => {
    const response = await request.get(`/api/circuits`)
    expect(response.ok()).toBeTruthy()
    expect(response.status()).toBe(200)

    const data = await response.json()
    expect(data).toMatchObject({
      api: expect.any(String),
      url: expect.any(String),
      limit: expect.any(Number),
      offset: expect.any(Number),
      total: expect.any(Number),
      circuits: expect.any(Array),
    })

    // Verificar un circuito dentro de la respuesta
    if (data.circuits.length > 0) {
      const circuit = data.circuits[0]
      expect(circuit).toMatchObject({
        circuitId: expect.any(String),
        circuitName: expect.any(String),
        country: expect.any(String),
        city: expect.any(String),
        circuitLength: expect.any(Number),
        numberOfCorners: expect.any(Number),
        firstParticipationYear: expect.any(Number),
        lapRecord: expect.any(String),
        fastestLapDriverId: expect.any(String),
        fastestLapTeamId: expect.any(String),
        fastestLapYear: expect.any(Number),
        url: expect.any(String),
      })
    }
  })

  test("should respect limit and offset query parameters", async ({
    request,
  }) => {
    const limit = 5
    const offset = 2
    const response = await request.get(
      `/api/circuits?limit=${limit}&offset=${offset}`
    )
    expect(response.ok()).toBeTruthy()
    expect(response.status()).toBe(200)

    const data = await response.json()
    expect(data.limit).toBe(limit)
    expect(data.offset).toBe(offset)
    expect(data.circuits).toHaveLength(limit) // Ajusta si la base de datos no tiene suficientes datos
  })

  test("should return 404 when no circuits are found", async ({ request }) => {
    const limit = 0 // Forzamos un límite inválido
    const response = await request.get(`/api/circuits?limit=${limit}`)
    expect(response.status()).toBe(404)

    const data = await response.json()
    expect(data).toMatchObject({
      api: expect.any(String),
      url: expect.any(String),
      message: expect.any(String),
      status: 404,
    })
  })

  test("should handle server errors gracefully", async ({ request }) => {
    // Simula un caso donde el endpoint lanza un error, por ejemplo, manipulando datos inválidos o desconectando la DB
    const response = await request.get(`/api/circuitsinvalida`)
    expect(response.status()).toBe(500)
  })
})
