export function randomInt(minOrMax: number, max?: number | boolean) {
  const getRandomValue = Math.random

  const min = (typeof max !== 'number') ? 0 : minOrMax
  const range = (typeof max !== 'number') ? minOrMax : max - minOrMax

  return Math.floor(getRandomValue() * range) + min
}

export function getRandomElement<T>(values: T[]): T {
  const index = randomInt(0, values.length)
  return values[index]
}
