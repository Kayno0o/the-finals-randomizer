type BaseClassType = string | undefined | null | boolean
export type ClassType = BaseClassType | (BaseClassType)[]

export function c(...classes: ClassType[]) {
  return classes.flat().filter(c => Boolean(c)).join(' ')
}
