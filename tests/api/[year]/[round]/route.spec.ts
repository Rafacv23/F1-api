import { test, expect } from "@playwright/test"

test.describe("GET /api/[year]/[round]", async () => {
  test("should return race data for a valid year and round", async ({
    request,
  }) => {
    const response = await request.get(`/api/2024/3`)
    expect(response.ok()).toBeTruthy()
    expect(response.status()).toBe(200)

    const data = await response.json()
    expect(data).toMatchObject({
      api: expect.any(String),
      url: expect.any(String),
      total: expect.any(Number),
      season: expect.any(String),
      round: expect.any(String),
      championship: expect.any(Object),
      race: expect.any(Array),
    })

    // Verificar una carrera dentro de la respuesta
    if (data.race.length > 0) {
      const race = data.race[0]
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

  test("should return 404 when no year are found", async ({ request }) => {
    const response = await request.get(`/api/2099/1`)
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
    const response = await request.get(`/api/2024/30`)
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
