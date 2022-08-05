let timer: NodeJS.Timeout
export function debounce<T extends (..._: any[]) => void>(fn: T, time = 2000) {
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), time)
  }
}
