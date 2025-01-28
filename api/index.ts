import { Elysia } from 'elysia'

interface Player {
  id: string
  name: string
}

const rooms: Record<string, Player[]> = {}

const app = new Elysia()
  .ws('/ws', {
    message(ws, message) {
      console.log(ws, message)
      ws.send(`got:${message}`)
    },
  })
  .listen(1600)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
)
