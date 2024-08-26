"use client"

import React, { useState } from "react"
import Announce from "@/app/data/announce.json"

export default function Announcer() {
  const [show, setShow] = useState(true)
  const handleDismiss = () => setShow(false)
  return show && Announce ? (
    <div className="fixed inset-x-0 top-0 p-4 items-center justify-center flex">
      <div className=" lg:w-1/2 relative flex items-center justify-center gap-4 rounded-lg px-4 py-3 text-white shadow-lg bg-f1">
        <p className="text-center text-sm font-medium">
          {Announce.announce}
          {". "}
          <a href={Announce.link} className="inline-block underline">
            Check out the endpoint!
          </a>
        </p>
        <button
          onClick={handleDismiss}
          aria-label="Close"
          className="shrink-0 rounded-lg bg-black/10 p-1 transition hover:bg-black/20"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  ) : null
}
