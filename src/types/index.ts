import type { ElysiaWS } from 'elysia/ws'

export interface LoadoutType {
  class: number
  specialization: number
  weapon: number
  gadgets: number[]
}

export type MinifiedLoadoutType = [string, number]

export interface PlayerType {
  publicId: string
  name: string
  loadout: LoadoutType
  isMaster?: boolean
}

export interface Player {
  publicId: string
  name: string
  loadout: number
  isMaster: boolean
  id: string
  lastPing: number
  ws: ElysiaWS
}

export interface RoomType {
  map: string
  players: Player[]
}
