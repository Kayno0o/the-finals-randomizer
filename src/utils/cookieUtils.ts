export function useCookie(name: string, defaultValue: string) {
  const getCookies = (): Record<string, string> => {
    return document.cookie.split('; ').reduce(
      (acc, curr) => {
        const [key, value] = curr.split('=')
        acc[key] = value
        return acc
      },
      {} as Record<string, string>,
    )
  }

  const cookies = getCookies()

  return {
    get value() {
      return cookies[name] || defaultValue
    },
    set value(newValue: string) {
      document.cookie = `${name}=${newValue}; path=/; max-age=31536000`
    },
  }
}
