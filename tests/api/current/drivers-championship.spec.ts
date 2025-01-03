import { test, expect } from "@playwright/test"

test.describe("GET /api/current/drivers-championship", async () => {
  test("should return drivers championships by the current year", async ({
    request,
  }) => {
    const response = await request.get(`/api/current/drivers-championship`)
    expect(response.ok()).toBeTruthy()
    expect(response.status()).toBe(200)

    const data = await response.json()
    expect(data).toMatchObject({
      api: expect.any(String),
      url: expect.any(String),
      limit: expect.any(Number),
      offset: expect.any(Number),
      total: expect.any(Number),
      season: expect.any(Number),
      championshipId: expect.any(String),
      drivers_championship: expect.any(Array),
    })

    if (data.drivers_championship.length > 0) {
      const driver = data.drivers_championship[0]
      expect(driver).toMatchObject({
        classificationId: expect.any(Number),
        driverId: expect.any(String),
        teamId: expect.any(String),
        points: expect.any(Number),
        position: expect.any(Number),
        wins: expect.any(Number),
        driver: expect.any(Object),
        team: expect.any(Object),
      })
    }
  })

  test("should return 404 when no year are found", async ({ request }) => {
    const response = await request.get(`/api/inventedYear/drivers-championship`)
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
