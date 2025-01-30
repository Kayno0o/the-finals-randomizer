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

            room.sendAll('player', playerToGenerate)
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

        room.sendAll('removePlayer', player.publicId)

        if (room.players[0]?.setIsMaster(true))
          room.sendAll('player', room.players[0])

        return
      }

      if (command === 'removePlayer') {
        if (!player?.isMaster)
          return

        const playerId = args[0]
        if (!playerId)
          return

        room.sendAll('removePlayer', playerId)
        room.players = room.players.filter(player => player.publicId !== playerId)
        return
      }

      if (command === 'reloadMap') {
        room.randomizeMap()
        room.sendAll('map', room.map)
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

      if (player.setAfk(true)) {
        room.sortPlayers()

        room.sendAll('player', player)

        if (room.players[0].setIsMaster(true))
          room.sendAll('player', room.players[0])
      }
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

        // send player to all before adding player to room to avoid player to receive two data at the same time
        room.sendAll('player', player)
        room.players.push(player)

        ws.send(room.getMessage(player))

        return
      }

      player.ws = ws
      player.lastPing = Date.now()

      ws.send(room.getMessage(player))

      if (player.setAfk(false))
        room.sendAll('player', player)
    },
  })
  .listen(import.meta.env.API_PORT)

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)

const afkDelay = 30 * 1000
const checkDelay = 30 * 1000

setInterval(() => {
  const currentTime = Date.now()

  for (const [key, room] of Object.entries(rooms)) {
    let hasOnlinePlayer = false

    for (const player of room.players) {
      if (player.afk)
        continue

      if (currentTime - player.lastPing >= afkDelay) {
        player.setAfk(true)
        player.setIsMaster(false)
        continue
      }

      player.ws?.send('ping')
      hasOnlinePlayer = true
    }

    if (!hasOnlinePlayer) {
      // room has no players online left
      delete rooms[key]

      continue
    }

    room.sortPlayers()

    if (room.players[0].setIsMaster(true))
      room.sendAll()
  }
}, checkDelay)
