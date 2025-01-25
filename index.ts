import { getRandomElement, randomInt } from '@kaynooo/utils'
import colors from 'ansi-colors'
import classes from './data.json'

const players = process.argv.slice(2)
if (!players.length)
  throw new Error('No players given')

for (const player of players) {
  const playerClass = getRandomElement(classes, true)
  const specialization = getRandomElement(playerClass.specializations, true)

  console.log(`# ${colors.bold(player)}`)
  console.log(`### ${playerClass.name} - ${specialization}`)

  const weapon = getRandomElement(playerClass.weapons, true)
  console.log(`- ${weapon}`)

  const gadgets: string[] = JSON.parse(JSON.stringify(playerClass.gadgets))
  for (let i = 0; i < 3; ++i) {
    const gadget = gadgets.splice(randomInt(gadgets.length, true), 1)[0]
    console.log(`- ${gadget}`)
  }
}
