import cookies from '@/helpers/cookies'

export const persist = (key, value, duration = null) => {
  return new Promise((resolve) => {
    cookies.set(key, value, duration)
    window.localStorage.setItem(key, value)
    window.localStorage.setItem(`${key}:duration`, duration)
    resolve()
  })
}

export const destroy = (key) => {
  return new Promise((resolve) => {
    cookies.remove(key)
    window.sessionStorage.clear()
    window.localStorage.clear()
    resolve()
  })
}
