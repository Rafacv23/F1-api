import { test, expect } from "@playwright/test"

test.describe("GET /api/[year]/constructors-championship", async () => {
  test("should return teams championships by the year provided", async ({
    request,
  }) => {
    const response = await request.get(`/api/2024/constructors-championship`)
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
      championshipId: expect.any(String),
      constructors_championship: expect.any(Array),
    })

    if (data.constructors_championship.length > 0) {
      const team = data.constructors_championship[0]
      expect(team).toMatchObject({
        classificationId: expect.any(Number),
        teamId: expect.any(String),
        points: expect.any(Number),
        position: expect.any(Number),
        wins: expect.any(Number),
        team: expect.any(Object),
      })
    }
  })

  test("should return 404 when no year are found", async ({ request }) => {
    const response = await request.get(
      `/api/inventedYear/constructors-championship`
    )
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
