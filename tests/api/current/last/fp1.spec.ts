import { test, expect } from "@playwright/test"

test.describe("GET /api/current/last/fp1", async () => {
  test("should return fp1 race data for the current year and round, with default limit and offset", async ({
    request,
  }) => {
    const response = await request.get(`/api/current/last/fp1`)
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
      races: expect.any(Object),
    })

    // Verificar una carrera dentro de la respuesta
    if (data.races.length > 0) {
      const race = data.races[0]
      expect(race).toMatchObject({
        round: expect.any(Number),
        fp1Time: expect.any(String),
        fp1Date: expect.any(String),
        url: expect.any(String),
        raceId: expect.any(String),
        raceName: expect.any(String),
        circuit: expect.any(Object),
        fp1Results: expect.any(Array),
      })
    }
  })

  test("should return fp1 race data for the current year and round, with limit and offset", async ({
    request,
  }) => {
    const response = await request.get(`/api/current/last/fp1?limit=1&offset=1`)
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
      races: expect.any(Object),
    })

    // Verificar una carrera dentro de la respuesta
    if (data.races.length > 0) {
      const race = data.races[0]
      expect(race).toMatchObject({
        round: expect.any(Number),
        fp1Time: expect.any(String),
        fp1Date: expect.any(String),
        url: expect.any(String),
        raceId: expect.any(String),
        raceName: expect.any(String),
        circuit: expect.any(Object),
        fp1Results: expect.any(Array),
      })
    }
  })

  test("should return 404 when no year are found", async ({ request }) => {
    const response = await request.get(`/api/2099/1/fp1`)
    expect(response.status()).toBe(404)

    const data = await response.json()
    expect(data).toMatchObject({
      api: expect.any(String),
      url: expect.any(String),
      message: expect.any(String),
      status: 404,
    })
  })

  test("should return 404 when no round are found", async ({ request }) => {
    const response = await request.get(`/api/current/30/fp1`)
    expect(response.status()).toBe(404)

    const data = await response.json()
    expect(data).toMatchObject({
      api: expect.any(String),
      url: expect.any(String),
      message: expect.any(String),
      status: 404,
    })
  })
})
