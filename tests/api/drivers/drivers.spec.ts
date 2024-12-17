import { test, expect } from "@playwright/test"

test.describe("GET /api/drivers", async () => {
  test("should return drivers data with default limit and offset", async ({
    request,
  }) => {
    const response = await request.get(`/api/drivers`)
    expect(response.ok()).toBeTruthy()
    expect(response.status()).toBe(200)

    const data = await response.json()
    expect(data).toMatchObject({
      api: expect.any(String),
      url: expect.any(String),
      limit: expect.any(Number),
      offset: expect.any(Number),
      total: expect.any(Number),
      drivers: expect.any(Array),
    })

    // Verificar un circuito dentro de la respuesta
    if (data.drivers.length > 0) {
      const driver = data.drivers[0]
      expect(driver).toMatchObject({
        driverId: expect.any(String),
        name: expect.any(String),
        surname: expect.any(String),
        nationality: expect.any(String),
        birthday: expect.any(String),
        url: expect.any(String),
      })
      driver.number === null
        ? expect(driver.number).toBeNull()
        : expect(driver.number).toEqual(expect.any(Number))

      driver.shortName === null
        ? expect(driver.shortName).toBeNull()
        : expect(driver.shortName).toEqual(expect.any(Number))
    }
  })

  test("should respect limit and offset query parameters", async ({
    request,
  }) => {
    const limit = 5
    const offset = 2
    const response = await request.get(
      `/api/drivers?limit=${limit}&offset=${offset}`
    )
    expect(response.ok()).toBeTruthy()
    expect(response.status()).toBe(200)

    const data = await response.json()
    expect(data.limit).toBe(limit)
    expect(data.offset).toBe(offset)
    expect(data.drivers).toHaveLength(limit)
  })

  test("should return 404 when no drivers are found", async ({ request }) => {
    const response = await request.get(`/api/drivers?offset=3000`)
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
