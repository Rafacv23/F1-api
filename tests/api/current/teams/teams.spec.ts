import { test, expect } from "@playwright/test"

test.describe("GET /api/current/teams", async () => {
  test("should return teams data with default limit and offset and a the current year", async ({
    request,
  }) => {
    const response = await request.get(`/api/current/teams`)
    expect(response.ok()).toBeTruthy()
    expect(response.status()).toBe(200)

    const data = await response.json()
    expect(data).toMatchObject({
      api: expect.any(String),
      url: expect.any(String),
      limit: expect.any(Number),
      offset: expect.any(Number),
      total: expect.any(Number),
      teams: expect.any(Array),
    })

    // Verificar un circuito dentro de la respuesta
    if (data.teams.length > 0) {
      const team = data.teams[0]
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

  test("should respect limit and offset query parameters", async ({
    request,
  }) => {
    const limit = 5
    const offset = 2
    const response = await request.get(
      `/api/current/teams?limit=${limit}&offset=${offset}`
    )
    expect(response.ok()).toBeTruthy()
    expect(response.status()).toBe(200)

    const data = await response.json()
    expect(data.limit).toBe(limit)
    expect(data.offset).toBe(offset)
    expect(data.teams).toHaveLength(limit) // Ajusta si la base de datos no tiene suficientes datos
  })

  test("should return 404 when no teams are found", async ({ request }) => {
    const response = await request.get(`/api/inventedYear/teams`)
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
