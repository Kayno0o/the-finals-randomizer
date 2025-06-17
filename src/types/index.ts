import type { ElysiaWS } from 'elysia/ws'
import { getRandomElement, randomString } from '@kaynooo/utils'
import { generateLoadout } from '../utils/loadoutUtils'

export interface LoadoutType {
  class: number
  specialization: number
  weapon: number
  gadgets: number[]
}

export type MinifiedLoadoutType = [string, number]

export interface PublicPlayerType {
  publicId: string
  name: string
  loadout: LoadoutType
  isMaster: boolean
  afk: boolean
}

export class Player {
  id: string
  publicId: string

  constructor(obj: {
    id: string
  }) {
    this.id = obj.id
    this.publicId = randomString(8)
  }
}

export class RoomPlayer {
  name: string
  isMaster: boolean
  id: string
  ws?: ElysiaWS

  publicId: string
  loadout: number
  afk = false
  lastPing: number

  constructor(obj: {
    id: string
    publicId: string
    name: string
    isMaster: boolean
    ws?: ElysiaWS
  }) {
    this.id = obj.id
    this.publicId = obj.publicId
    this.name = obj.name
    this.isMaster = obj.isMaster
    this.ws = obj.ws

    this.lastPing = Date.now()
    this.loadout = generateLoadout()
  }

  /** @return {boolean} true if value has changed */
  setAfk(value: boolean): boolean {
    const previousAfk = this.afk
    this.afk = value

    if (this.afk)
      this.ws = undefined

    return this.afk !== previousAfk
  }

  /** @return {boolean} true if value has changed */
  setName(value: string): boolean {
    const previousName = this.name
    this.name = value

    return this.name !== previousName
  }

  /** @return {boolean} true if value has changed */
  setIsMaster(value: boolean): boolean {
    const previousIsMaster = this.isMaster
    this.isMaster = value

    return this.isMaster !== previousIsMaster
  }

  toString() {
    return [
      this.publicId,
      this.name,
      Number(this.isMaster),
      Number(this.afk),
      this.loadout,
    ].join(':')
  }
}

const maps = ['bernal', 'fortune stadium', 'kyoto', 'las vegas', 'monaco', 'seoul', 'skyway stadium', 'sys$horizon']

export class Room {
  map: string
  players: RoomPlayer[] = []

  constructor() {
    this.map = getRandomElement(maps)
  }

  sortPlayers() {
    this.players.sort((a, b) => {
      if (a.isMaster)
        return -1
      if (b.isMaster)
        return 1
      if (a.afk)
        return 1
      if (b.afk)
        return -1
      return 0
    })
  }

  getMessage(player: RoomPlayer) {
    return `room;${this.map};${player.publicId};${this.players.map(String).join(';')}`
  }

  randomizeMap() {
    this.map = getRandomElement(maps)
  }

  sendAll(): void
  sendAll(command: string, message: any): void
  sendAll(command?: string, message?: any) {
    const str = (command && message) ? `${command};${Array.isArray(message) ? message.join(';') : message}` : null

    for (const player of this.players) {
      player.ws?.send(str ?? this.getMessage(player))
    }
  }

  getPlayer(id: string) {
    return this.players?.find(player => player.id === id) ?? undefined
  }
}
