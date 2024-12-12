"use client"

import React, { useEffect, useId, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useOutsideClick } from "@/hooks/use-outside-click"
import { buttonVariants } from "./button"
import { Cross } from "lucide-react"
import { SITE_URL } from "@/lib/constants"

export function ExpandableCardList({
  cards,
}: {
  cards: Array<{
    title: string
    description: string
    params: string
    default?: number
    url: string
    value: string
  }>
}) {
  const [activeCard, setActiveCard] = useState<{ data: any; card: any } | null>(
    null
  )

  const handleCardClick = async (card: any) => {
    try {
      const response = await fetch(`http://localhost:3000${card.url}`)
      const data = await response.json()

      setActiveCard({ data, card })
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  return (
    <>
      <AnimatePresence>
        {activeCard && (
          <ExpandableCard
            card={activeCard.card}
            data={activeCard.data}
            onClose={() => setActiveCard(null)}
          />
        )}
      </AnimatePresence>
      <ul className=" mx-auto w-full gap-4">
        {cards.map((card) => (
          <ExpandableCardItem
            key={card.title}
            card={card}
            onClick={() => handleCardClick(card)}
          />
        ))}
      </ul>
    </>
  )
}

function ExpandableCard({
  card,
  data,
  onClose,
}: {
  card: {
    title: string
    description: string
    src: string
    url: string
    params: string
    default: number
    content: () => React.ReactNode
  }
  data: any
  onClose: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const id = useId()
  const [isLoading, setIsLoading] = useState(true)
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose()
      }
    }

    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKeyDown)

    return () => {
      document.body.style.overflow = "auto"
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [onClose])

  useOutsideClick(ref, onClose)

  useEffect(() => {
    if (data) {
      setIsLoading(false)
    }
  }, [data])

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(SITE_URL + card.url)
      .then(() => {
        setIsCopied(true)
        setTimeout(() => {
          setIsCopied(false) // Restablecer el estado después de 2 segundos
        }, 2000)
      })
      .catch((error) => {
        console.error("Failed to copy: ", error)
      })
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/20 h-full w-full z-10"
      />
      <div className="fixed inset-0 grid place-items-center z-[100]">
        <motion.button
          layout
          className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
          onClick={onClose}
        >
          <Cross />
        </motion.button>
        <motion.div
          layoutId={`card-${card.title}-${id}`}
          ref={ref}
          className="w-full max-w-3xl h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
        >
          <div>
            <div className="flex justify-between items-start p-4">
              <div>
                <motion.h3
                  layoutId={`title-${card.title}-${id}`}
                  className="font-bold text-neutral-700 dark:text-neutral-200"
                >
                  {card.title}
                </motion.h3>
                <motion.p
                  layoutId={`description-${card.description}-${id}`}
                  className="text-neutral-600 dark:text-neutral-400"
                >
                  {card.description}
                </motion.p>
                <motion.p
                  layoutId={`description-${card.description}-${id}`}
                  className="text-neutral-600 dark:text-neutral-400"
                >
                  params: {card.params}, default: {card.default}
                </motion.p>
              </div>
              <motion.button
                onClick={handleCopyLink}
                className={buttonVariants({ variant: "default" })}
              >
                {isCopied ? "Copied!" : "Copy link"}
              </motion.button>
            </div>
            <div className="pt-4 relative px-4">
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400 [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
              >
                <div className="overflow-y-auto max-h-96">
                  {!isLoading ? (
                    <pre>{JSON.stringify(data, null, 2)}</pre>
                  ) : (
                    "Loading..."
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}

function ExpandableCardItem({
  card,
  onClick,
}: {
  card: {
    title: string
    description: string
  }
  onClick: () => void
}) {
  const id = useId()

  return (
    <motion.div
      layoutId={`card-${card.title}-${id}`}
      onClick={onClick}
      className="p-4 flex flex-col md:flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
    >
      <div className="flex gap-4 flex-col md:flex-row">
        <div>
          <motion.h3
            layoutId={`title-${card.title}-${id}`}
            className="font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left"
          >
            {card.title}
          </motion.h3>
          <motion.p
            layoutId={`description-${card.description}-${id}`}
            className="text-neutral-600 dark:text-neutral-400 text-center md:text-left"
          >
            {card.description}
          </motion.p>
        </div>
      </div>
      <motion.button
        layoutId={`button-${card.title}-${id}`}
        className={buttonVariants({ variant: "outline" })}
      >
        Try
      </motion.button>
    </motion.div>
  )
}
