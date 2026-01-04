import { test, expect } from "@playwright/test"

test.describe("GET /api/circuits/active", async () => {
  test("should return active circuits for latest available year when year is not provided", async ({
    request,
  }) => {
    const response = await request.get(`/api/circuits/active`)
    expect(response.ok()).toBeTruthy()
    expect(response.status()).toBe(200)

    const data = await response.json()

    expect(data).toMatchObject({
      api: expect.any(String),
      url: expect.any(String),
      year: expect.any(String),
      total: expect.any(Number),
      circuits: expect.any(Array),
    })

    if (data.circuits.length > 0) {
      const circuit = data.circuits[0]
      expect(circuit).toMatchObject({
        circuitId: expect.any(String),
        circuitName: expect.any(String),
        country: expect.any(String),
        city: expect.any(String),
        url: expect.any(String),
      })
    }
  })

  test("should return active circuits for a specific year", async ({
    request,
  }) => {
    const year = 2023
    const response = await request.get(
      `/api/circuits/active?year=${year}`
    )

    expect(response.ok()).toBeTruthy()
    expect(response.status()).toBe(200)

    const data = await response.json()

    expect(data.year).toBe(String(year))
    expect(Array.isArray(data.circuits)).toBeTruthy()
  })

  test("should return 404 when no races are found for the given year", async ({
    request,
  }) => {
    const invalidYear = 1900
    const response = await request.get(
      `/api/circuits/active?year=${invalidYear}`
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
})