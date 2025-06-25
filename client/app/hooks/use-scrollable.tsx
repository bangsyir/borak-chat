import { useEffect, useRef } from "react";

export function useAutoScroll<T>(deps: T[]) {
  const messageEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({
      behavior: "instant",
      block: "nearest",
      inline: "start"
    })
  }, [deps])

  return messageEndRef
}
