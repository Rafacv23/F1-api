import { test, expect } from "@playwright/test"

test.describe("GET /api/circuits/[circuitId]", async () => {
  test("should return circuit data for a valid circuitId", async ({
    request,
  }) => {
    const response = await request.get(`/api/circuits/monza`)
    expect(response.ok()).toBeTruthy()
    expect(response.status()).toBe(200)

    const data = await response.json()
    expect(data).toMatchObject({
      api: expect.any(String),
      url: expect.any(String),
      total: expect.any(Number),
      circuit: expect.any(Array),
    })

    // Verificar un circuito dentro de la respuesta
    if (data.circuit.length > 0) {
      const circuit = data.circuit[0]
      expect(circuit).toMatchObject({
        circuitId: expect.any(String),
        circuitName: expect.any(String),
        country: expect.any(String),
        city: expect.any(String),
        circuitLength: expect.any(Number),
        numberOfCorners: expect.any(Number),
        firstParticipationYear: expect.any(Number),
        lapRecord: expect.any(String),
        fastestLapDriverId: expect.any(String),
        fastestLapTeamId: expect.any(String),
        fastestLapYear: expect.any(Number),
        url: expect.any(String),
      })
    }
  })

  test("should return 404 when no circuit are found", async ({ request }) => {
    const response = await request.get(`/api/circuits/falseCircuit`)
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
