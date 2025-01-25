import { generateLoadout } from './loadout'

const players = process.argv.slice(2)
if (!players.length)
  throw new Error('No players given')

const loadouts = players.map(generateLoadout)
for (const loadout of loadouts) {
  console.log(`## ${loadout.playerName}`)
  console.log(`### ${loadout.class} - ${loadout.specialization}`)
  for (const gadget of loadout.gadgets) {
    console.log(`- ${gadget}`)
  }
}
