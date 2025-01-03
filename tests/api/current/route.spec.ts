import { test, expect } from "@playwright/test"

test.describe("GET /api/current", async () => {
  test("should return races data for the current year", async ({ request }) => {
    const response = await request.get(`/api/current`)
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
      races: expect.any(Array),
    })

    // Verificar una carrera dentro de la respuesta
    if (data.races.length > 0) {
      const race = data.races[0]
      expect(race).toMatchObject({
        raceId: expect.any(String),
        championshipId: expect.any(String),
        raceName: expect.any(String),
        schedule: expect.any(Object),
        laps: expect.any(Number),
        round: expect.any(Number),
        fast_lap: expect.any(Object),
        url: expect.any(String),
        circuit: expect.any(Object),
        winner: expect.any(Object),
        teamWinner: expect.any(Object),
      })
    }
  })

  test("should return 404 when no races are found", async ({ request }) => {
    const response = await request.get(`/api/2099`)
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
