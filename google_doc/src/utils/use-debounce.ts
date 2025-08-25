import { useCallback, useRef } from 'react'

export default function useDebounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  callBack: T,
  delay: number = 500,
) {
  const timeOutref = useRef<NodeJS.Timeout>(null)
  return useCallback(
    (...args: Parameters<T>) => {
      if (timeOutref.current) {
        clearTimeout(timeOutref.current)
      }
      timeOutref.current = setTimeout(() => {
        callBack(...args)
      }, delay)
    },
    [callBack, delay],
  )
}
