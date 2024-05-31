// sleep
export function sleep(ms: number = 300) {
  return new Promise((resolve) =>
    setTimeout(resolve, ms + Math.random() * 1000)
  )
}
