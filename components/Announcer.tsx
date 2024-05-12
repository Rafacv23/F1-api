import React from "react"
import Announce from "@/app/data/announce.json"

export default function Announcer() {
  return Announce ? (
    <div className="bg-indigo-600 px-4 py-3 text-white fixed top-0 w-full">
      <p className="text-center text-sm font-medium">
        {Announce.announce}
        {". "}
        <a href={Announce.link} className="inline-block underline">
          Check out the endpoint!
        </a>
      </p>
    </div>
  ) : null
}
