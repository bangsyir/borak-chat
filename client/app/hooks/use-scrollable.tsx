import { useEffect, useLayoutEffect, useRef } from "react";
import { useParams } from "react-router";

const scrollPositions = new Map<string, number>()

export function useAutoScroll<T>(deps: T[]) {
  const { friendId } = useParams()
  const containerRef = useRef<HTMLDivElement>(null)
  const messageEndRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const container = containerRef.current
    const saved = scrollPositions.get(friendId!)
    if (saved !== undefined && container) {
      container.scrollTop = saved
    } else {
      messageEndRef.current?.scrollIntoView({ behavior: "auto" })
    }
  }, [friendId])

  useEffect(() => {
    const container = containerRef.current
    return () => {
      if (container) {
        scrollPositions.set(friendId!, container.scrollTop)
      }
    }
  }, [friendId])

  useEffect(() => {
    const container = containerRef.current

    if (!container) return;

    const nearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100

    if (nearBottom) {
      messageEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start"
      })
    }
  }, [deps])

  return { containerRef, messageEndRef }
}
