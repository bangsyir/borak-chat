import React from "react";

export function useMessagesAutoScroll(dept: any) {
  const [isInitialLoad, setIsInitialLoad] = React.useState(true);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // instant scroll to bottom (animation)
  const scrollToBottomInstant = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        block: "end",
        inline: "nearest",
      });
    }
  };
  // smooth scroll to bottom (with animation) - only for new messages
  const scrollToBottomSmooth = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  };
  // handle scrolling base on context
  React.useEffect(() => {
    if (dept.length > 0) {
      const timeoutId1 = setTimeout(() => {
        scrollToBottomInstant();
      }, 0);
      const timeoutId2 = setTimeout(() => {
        scrollToBottomInstant();
        // setIsInitialLoad(false);
      }, 100);
      return () => {
        clearTimeout(timeoutId1);
        clearTimeout(timeoutId2);
      };
    }
  }, [dept, isInitialLoad]);
  return {
    messagesEndRef,
    scrollToBottomInstant,
    scrollToBottomSmooth,
    isInitialLoad,
    setIsInitialLoad,
  };
}
