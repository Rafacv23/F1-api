"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)

    return () => {
      window.removeEventListener("scroll", toggleVisibility)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <div>
      {isVisible && (
        <Button
          onClick={scrollToTop}
          style={{
            position: "fixed",
            bottom: "2rem",
            right: "2rem",
          }}
        >
          ↑
        </Button>
      )}
    </div>
  )
}

export default ScrollToTop
