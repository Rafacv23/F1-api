import React from "react"
import { SITE_NAME, SITE_URL } from "@/lib/constants"

export default function Terms() {
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Terms & Conditions</h1>
      <p>
        {SITE_NAME} is an experimental web service that provides a historical
        record of motor racing data for non-commercial purposes.
      </p>
      <p>By using this API, you agree to the following terms and conditions:</p>
      <h2 className="text-xl font-bold mb-2 mt-4">Terms Of Use</h2>
      <p>
        You may use this API for personal, non-commercial applications and
        services, including educational and research purposes. Use by websites
        and applications supported by advertising is permitted. However, you
        must not charge for any application or service that uses this API or for
        any data obtained from it.
      </p>
      <h2 className="text-xl font-bold mb-2 mt-4">Attribution</h2>
      <p>
        You are not required to attribute this site in applications or services
        using this API. However, an attribution would be appreciated when
        addressing a technical audience. A reference to the “Ergast API” with a
        link to: {SITE_URL} is ideal.
      </p>
      <h2 className="text-xl font-bold mb-2 mt-4">Disclaimer</h2>
      <p>
        The author disclaims all responsibility for any loss or damage arising
        from the use of this API. The author cannot guarantee the continuing
        availability of the API or the accuracy of the data.
      </p>
    </main>
  )
}
