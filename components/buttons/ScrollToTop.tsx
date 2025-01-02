"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface ScrollToTopProps extends React.HTMLAttributes<HTMLButtonElement> {
  className?: string
}

const ScrollToTop = ({ className }: ScrollToTopProps) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      window.scrollY > 300 ? setIsVisible(true) : setIsVisible(false)
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

  return isVisible ? (
    <Button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 ${className}`}
    >
      ↑
    </Button>
  ) : null
}

export default ScrollToTop
