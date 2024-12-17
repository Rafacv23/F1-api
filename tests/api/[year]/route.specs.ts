import { test, expect } from "@playwright/test"

test.describe("GET /api/[2024]", async () => {
  test("should return season races data with default limit and offset", async ({
    request,
  }) => {
    const response = await request.get(`/api/2024`)
    expect(response.ok()).toBeTruthy()
    expect(response.status()).toBe(200)

    const data = await response.json()
    expect(data).toMatchObject({
      api: expect.any(String),
      url: expect.any(String),
      limit: expect.any(Number),
      offset: expect.any(Number),
      total: expect.any(Number),
      season: expect.any(String),
      championship: expect.any(String),
      races: expect.any(Array),
    })

    // Verificar un circuito dentro de la respuesta
    if (data.races.length > 0) {
      const race = data.races[0]
      expect(race).toMatchObject({
        raceId: expect.any(String),
        raceName: expect.any(String),
        schedule: expect.any(Object),
        laps: expect.any(Number),
        round: expect.any(Number),
        url: expect.any(String),
        fast_lap: expect.any(Object),
        circuit: expect.any(Object),
        winner: expect.any(Object),
        teamWinner: expect.any(Object),
      })
    }
  })

  test("should respect limit and offset query parameters", async ({
    request,
  }) => {
    const limit = 5
    const offset = 2
    const response = await request.get(
      `/api/2024?limit=${limit}&offset=${offset}`
    )
    expect(response.ok()).toBeTruthy()
    expect(response.status()).toBe(200)

    const data = await response.json()
    expect(data.limit).toBe(limit)
    expect(data.offset).toBe(offset)
    expect(data.races).toHaveLength(limit) // Ajusta si la base de datos no tiene suficientes datos
  })

  test("should return 404 when no circuits are found", async ({ request }) => {
    const response = await request.get(`/api/2030`)
    expect(response.status()).toBe(404)

    const data = await response.json()
    expect(data).toMatchObject({
      api: expect.any(String),
      url: expect.any(String),
      message: expect.any(String),
      status: 404,
    })
  })

  // test("should handle server errors gracefully", async ({ request }) => {
  //   // Simula un caso donde el endpoint lanza un error, por ejemplo, manipulando datos inválidos o desconectando la DB
  //   const response = await request.get(`/api/circuitsinvalida`)
  //   expect(response.status()).toBe(500)
  // })
})
