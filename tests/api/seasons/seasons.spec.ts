import { test, expect } from "@playwright/test"

test.describe("GET /api/seasons", async () => {
  test("should return seasons data with default limit and offset", async ({
    request,
  }) => {
    const response = await request.get(`/api/seasons`)
    expect(response.ok()).toBeTruthy()
    expect(response.status()).toBe(200)

    const data = await response.json()
    expect(data).toMatchObject({
      api: expect.any(String),
      url: expect.any(String),
      limit: expect.any(Number),
      offset: expect.any(Number),
      total: expect.any(Number),
      championships: expect.any(Array),
    })

    // Verificar un circuito dentro de la respuesta
    if (data.championships.length > 0) {
      const championship = data.championships[0]
      expect(championship).toMatchObject({
        championshipId: expect.any(String),
        championshipName: expect.any(String),
        url: expect.any(String),
        year: expect.any(Number),
      })
    }
  })

  test("should respect limit and offset query parameters", async ({
    request,
  }) => {
    const limit = 5
    const offset = 2
    const response = await request.get(
      `/api/seasons?limit=${limit}&offset=${offset}`
    )
    expect(response.ok()).toBeTruthy()
    expect(response.status()).toBe(200)

    const data = await response.json()
    expect(data.limit).toBe(limit)
    expect(data.offset).toBe(offset)
    expect(data.championships).toHaveLength(limit)
  })

  test("should return 404 when no seasons are found", async ({ request }) => {
    const offset = 1000 // Forzamos un offset inválido
    const response = await request.get(`/api/seasons?offset=${offset}`)
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
