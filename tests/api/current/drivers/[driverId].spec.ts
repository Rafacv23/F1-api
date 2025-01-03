import { test, expect } from "@playwright/test"

test.describe("GET /api/current/drivers/[driverId]", async () => {
  test("should return driver data for a valid driverId and the current year", async ({
    request,
  }) => {
    const response = await request.get(`/api/current/drivers/alonso`)
    expect(response.ok()).toBeTruthy()
    expect(response.status()).toBe(200)

    const data = await response.json()
    expect(data).toMatchObject({
      api: expect.any(String),
      url: expect.any(String),
      total: expect.any(Number),
      driver: expect.any(Object),
    })

    if (data.driver.length > 0) {
      const driver = data.driver[0]
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
        : expect(driver.shortName).toEqual(expect.any(String))
    }
  })

  test("should return 404 when no driver are found", async ({ request }) => {
    const response = await request.get(`/api/current/drivers/inventedDriver`)
    expect(response.status()).toBe(404)

    const data = await response.json()
    expect(data).toMatchObject({
      api: expect.any(String),
      url: expect.any(String),
      message: expect.any(String),
      status: 404,
    })
  })

  test("should return 404 when no year found", async ({ request }) => {
    const response = await request.get(`/api/inventedYear/drivers/alonso`)
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
