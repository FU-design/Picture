export function setSearchCache(key: string, data: unknown) {
  sessionStorage.setItem(`search_${key}`, JSON.stringify(data))
}

export function getSearchCache(key: string) {
  const cache = sessionStorage.getItem(`search_${key}`)
  return cache ? JSON.parse(cache) : null
}

export function clearSearchCache(key: string) {
  sessionStorage.removeItem(`search_${key}`)
}
