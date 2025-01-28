import type { Player, RoomType } from '../src/types'
import { getRandomElement, randomString } from '@kaynooo/utils'
import { Elysia, t } from 'elysia'
import { generateLoadout } from '../src/utils/loadoutUtils'

const rooms: Record<string, RoomType> = {}

function getRoomMessage(player: Player, room: RoomType) {
  return `room;${room.map};${player.publicId};${room.players.map(player => `${player.publicId}:${player.name}:${String(player.isMaster ?? false)}:${player.loadout}`).join(';')}`
}

function getPlayerIndex(id: string, roomCode: string) {
  return rooms[roomCode]?.players?.findIndex(player => player.id === id) ?? -1
}

function getPlayer(id: string, roomCode: string) {
  return rooms[roomCode]?.players?.find(player => player.id === id) ?? undefined
}

const maps = ['bernal', 'fortune stadium', 'kyoto', 'las vegas', 'monaco', 'seoul', 'skyway stadium', 'sys$horizon']

function getRandomMap() {
  return getRandomElement(maps)
}

const app = new Elysia()
  .ws('/ws', {
    query: t.Object({
      id: t.String(),
      room: t.String(),
      username: t.String(),
    }),
    message(ws, message: string) {
      const { room, id } = ws.data.query

      const player = getPlayer(id, room)

      const [command, ...args] = message.split(';')

      if (command === 'getRoom') {
        player?.ws.send(getRoomMessage(player, rooms[room]))
        return
      }

      if (command === 'username') {
        if (!player)
          return

        player.name = args[0] ?? player.name
        for (const player of rooms[room].players) {
          player.ws.send(getRoomMessage(player, rooms[room]))
        }
      }

      if (command === 'generate') {
        const players = rooms[room].players
        for (const player of players) {
          player.loadout = generateLoadout()
        }

        rooms[room].map = getRandomMap()

        for (const player of rooms[room].players) {
          player.ws.send(getRoomMessage(player, rooms[room]))
        }
      }

      if (command === 'pong') {
        if (!player)
          return

        player.lastPing = Date.now()
      }

      if (command === 'quit') {
        rooms[room].players = rooms[room].players.filter(player => player.id !== id)

        if (!rooms[room].players.length) {
          delete rooms[room]
          return
        }

        rooms[room].players[0].isMaster = true

        for (const player of rooms[room].players) {
          player.ws.send(getRoomMessage(player, rooms[room]))
        }
      }
    },
    close(ws) {
      const { id, room } = ws.data.query
      if (!rooms[room])
        return

      const playerIndex = getPlayerIndex(id, room)
      if (playerIndex < 0)
        return

      rooms[room].players[playerIndex].lastPing = Date.now()
    },
    open(ws) {
      const { id, room, username } = ws.data.query
      rooms[room] ||= {
        map: getRandomMap(),
        players: [],
      }

      const playerIndex = getPlayerIndex(id, room)
      if (playerIndex < 0) {
        const publicId = randomString(8)
        rooms[room].players.push({
          id,
          publicId,
          name: username,
          loadout: generateLoadout(),
          isMaster: rooms[room].players.length === 0,
          ws,
          lastPing: Date.now(),
        })

        for (const player of rooms[room].players) {
          player.ws.send(getRoomMessage(player, rooms[room]))
        }

        return
      }

      const player = rooms[room].players[playerIndex]

      player.ws = ws
      player.lastPing = Date.now()

      ws.send(getRoomMessage(rooms[room].players[playerIndex], rooms[room]))
    },
  })
  .listen(1600)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
)

const closeDelay = 60 * 1000

setInterval(() => {
  const currentTime = Date.now()

  for (const [key, room] of Object.entries(rooms)) {
    let hasRemovedUser = false
    for (let i = 0; i < room.players.length; i++) {
      const player = room.players[i]

      if (player.lastPing && currentTime - player.lastPing >= closeDelay) {
        rooms[key].players.splice(i, 1)
        i--
        hasRemovedUser = true
      }
      else {
        rooms[key].players[i].ws.send('ping')
      }
    }

    if (!hasRemovedUser)
      continue

    if (room.players.length) {
      rooms[key].players[0].isMaster = true

      for (const player of rooms[key].players) {
        player.ws.send(getRoomMessage(player, rooms[key]))
      }

      continue
    }

    // room has no players left
    delete rooms[key]
  }

  for (const key of Object.keys(rooms)) {
    if (!rooms[key]?.players.length)
      delete rooms[key]
  }
}, 30 * 1000)
