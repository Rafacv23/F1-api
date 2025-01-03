import { test, expect } from "@playwright/test"

test.describe("GET /api/current/teams/[teamId]", async () => {
  test("should return team data for a valid teamId and the current year", async ({
    request,
  }) => {
    const response = await request.get(`/api/current/teams/ferrari`)
    expect(response.ok()).toBeTruthy()
    expect(response.status()).toBe(200)

    const data = await response.json()
    expect(data).toMatchObject({
      api: expect.any(String),
      url: expect.any(String),
      total: expect.any(Number),
      team: expect.any(Array),
    })

    if (data.team.length > 0) {
      const team = data.team[0]
      expect(team).toMatchObject({
        teamId: expect.any(String),
        teamName: expect.any(String),
        teamNationality: expect.any(String),
        url: expect.any(String),
      })
      team.firstAppeareance === null
        ? expect(team.firstAppeareance).toBeNull()
        : expect(team.firstAppeareance).toEqual(expect.any(Number))

      team.driversChampionships === null
        ? expect(team.driversChampionships).toBeNull()
        : expect(team.driversChampionships).toEqual(expect.any(Number))

      team.constructorsChampionships === null
        ? expect(team.constructorsChampionships).toBeNull()
        : expect(team.constructorsChampionships).toEqual(expect.any(Number))
    }
  })

  test("should return 404 when no year are found", async ({ request }) => {
    const response = await request.get(`/api/inventedYear/teams/ferrari`)
    expect(response.status()).toBe(404)

    const data = await response.json()
    expect(data).toMatchObject({
      api: expect.any(String),
      url: expect.any(String),
      message: expect.any(String),
      status: 404,
    })
  })

  test("should return 404 when no team are found", async ({ request }) => {
    const response = await request.get(`/api/current/teams/inventedTeam`)
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
