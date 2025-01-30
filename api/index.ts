import { Elysia, t } from 'elysia'
import { Player, Room } from '../src/types'
import { generateLoadout } from '../src/utils/loadoutUtils'

const rooms: Record<string, Room> = {}

const app = new Elysia()
  .ws('/ws', {
    query: t.Object({
      id: t.String(),
      room: t.String(),
      username: t.String(),
    }),
    message(ws, message: string) {
      const { room: roomCode, id } = ws.data.query

      const room = rooms[roomCode]
      if (!room)
        return

      const player = room.getPlayer(id)
      if (!player)
        return

      const [command, ...args] = message.split(';')

      if (command === 'username') {
        if (!player)
          return

        if (player.setName(args[0] ?? player.name))
          room.sendAll('player', player)
      }

      if (command === 'generate') {
        if (!player?.isMaster)
          return

        // generate a single user
        if (args[0]) {
          const playerToGenerate = room.players.find(player => player.publicId === args[0])

          if (playerToGenerate) {
            playerToGenerate.loadout = generateLoadout()

            room.sendAll()
            return
          }
        }

        const players = room.players
        for (const player of players) {
          player.loadout = generateLoadout()
        }

        room.randomizeMap()
        room.sendAll()

        return
      }

      if (command === 'pong') {
        if (!player)
          return

        player.lastPing = Date.now()

        if (player.setAfk(false))
          room.sendAll('player', player)

        return
      }

      if (command === 'quit') {
        room.players = room.players.filter(player => player.id !== id)

        if (!room.players.length) {
          delete rooms[roomCode]
          return
        }

        if (!room.players[0].isMaster) {
          room.players[0].isMaster = true

          room.sendAll('player', room.players[0])
        }
      }
    },
    close(ws) {
      const { id, room: roomCode } = ws.data.query
      const room = rooms[roomCode]
      if (!room)
        return

      const player = room.getPlayer(id)
      if (!player)
        return

      player.lastPing = Date.now()
      player.ws = undefined

      if (player.setAfk(true))
        room.sendAll('player', player)
    },
    open(ws) {
      const { id, room: roomCode, username } = ws.data.query
      rooms[roomCode] ||= new Room()
      const room = rooms[roomCode]

      const player = room.getPlayer(id)

      if (!player) {
        const player = new Player({
          id,
          name: username,
          isMaster: room.players.filter(player => !player.afk).length === 0,
          ws,
        })
        room.players.push(player)

        room.sendAll('player', player)
        return
      }

      player.ws = ws
      player.lastPing = Date.now()

      if (player.setAfk(false))
        room.sendAll('player', player)
      else
        ws.send(room.getMessage(player))
    },
  })
  .listen(import.meta.env.API_PORT)

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)

const afkDelay = 5 * 60 * 1000
const checkDelay = 30 * 1000

setInterval(() => {
  const currentTime = Date.now()

  for (const [key, room] of Object.entries(rooms)) {
    let hasUpdatedUser = false
    for (let i = 0; i < room.players.length; i++) {
      const player = room.players[i]

      if (currentTime - player.lastPing >= afkDelay) {
        if (player.setAfk(true))
          hasUpdatedUser = true
      }
      else {
        rooms[key].players[i].ws?.send('ping')
      }
    }

    console.log('hasUpdatedUser', hasUpdatedUser)
    if (!hasUpdatedUser)
      continue

    if (room.players.some(player => !player.afk)) {
      if (room.players[0].setIsMaster(true))
        room.sendAll()

      continue
    }

    // room has no players online left
    delete rooms[key]
  }

  for (const key of Object.keys(rooms)) {
    if (rooms[key].players.every(player => player.afk))
      delete rooms[key]
  }
}, checkDelay)
