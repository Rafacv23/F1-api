import { test, expect } from "@playwright/test"

test.describe("GET /api/[year]/[round]/race", async () => {
  test("should return race data for a valid year and round, with default limit and offset", async ({
    request,
  }) => {
    const response = await request.get(`/api/2024/3/race`)
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
      races: expect.any(Object),
    })

    // Verificar una carrera dentro de la respuesta
    if (data.races.length > 0) {
      const race = data.races[0]
      expect(race).toMatchObject({
        round: expect.any(Number),
        date: expect.any(String),
        time: expect.any(String),
        url: expect.any(String),
        raceId: expect.any(String),
        raceName: expect.any(String),
        circuit: expect.any(Object),
        results: expect.any(Array),
      })
    }
  })

  test("should return race data for a valid year and round, with limit and offset", async ({
    request,
  }) => {
    const response = await request.get(`/api/2024/3/race?limit=1&offset=1`)
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
      races: expect.any(Object),
    })

    // Verificar una carrera dentro de la respuesta
    if (data.races.length > 0) {
      const race = data.races[0]
      expect(race).toMatchObject({
        round: expect.any(Number),
        date: expect.any(String),
        time: expect.any(String),
        url: expect.any(String),
        raceId: expect.any(String),
        raceName: expect.any(String),
        circuit: expect.any(Object),
        results: expect.any(Array),
      })
    }
  })

  test("should return 404 when no year are found", async ({ request }) => {
    const response = await request.get(`/api/2099/1/race`)
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
    const response = await request.get(`/api/2024/30/race`)
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
