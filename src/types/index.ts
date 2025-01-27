export interface LoadoutType {
  playerName: string
  class: number
  specialization: number
  weapon: number
  gadgets: number[]
}

export type MinifiedLoadoutType = [string, number]
