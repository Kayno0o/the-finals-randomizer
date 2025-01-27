import type { LoadoutType, MinifiedLoadoutType } from '../types'
import { randomInt, range } from '@kaynooo/utils'
import json from '../assets/data.json'

export function decodeLoadouts(encoded: string): LoadoutType[] {
  const decodedString = atob(encoded)

  return decodedString.split(';').map((player) => {
    const items = player.split(',')
    const loadoutData = Number.parseInt(items[1], 10)

    // extract the class (2 bits)
    const classIndex = (loadoutData >> 18) & 3

    // extract the specialization (2 bits)
    const specializationIndex = (loadoutData >> 16) & 3

    // extract the weapon (4 bits)
    const weaponIndex = (loadoutData >> 12) & 15

    // extract the gadgets (4 bits each for 3 gadgets)
    const gadgets: number[] = []
    for (let i = 0; i < 3; i++) {
      gadgets.push((loadoutData >> (8 - i * 4)) & 15)
    }

    return {
      playerName: items[0],
      class: classIndex,
      specialization: specializationIndex,
      weapon: weaponIndex,
      gadgets,
    }
  })
}

export function generateLoadout(playerName: string): MinifiedLoadoutType {
  const classIndex = randomInt(json.length)
  const classData = json[classIndex]
  const specializationIndex = randomInt(classData.specializations.length)
  const weaponIndex = randomInt(classData.weapons.length)
  const gadgetsData = range(classData.gadgets.length)
  const gadgets: number[] = []

  for (let i = 0; i < 3; i++) {
    const randomIndex = randomInt(gadgetsData.length)
    gadgets.push(gadgetsData.splice(randomIndex, 1)[0])
  }

  let loadoutData = 0
  // class 2 bits (max 3 values)
  loadoutData |= (classIndex & 3) << 18
  // specialization 2 bits (max 4 values)
  loadoutData |= (specializationIndex & 3) << 16
  // weapon 4 bits (max 12 values)
  loadoutData |= (weaponIndex & 15) << 12

  // gadgets 3×4 bits (max 16 values)
  for (let idx = 0; idx < gadgets.length; idx++) {
    const gadget = gadgets[idx]
    loadoutData |= (gadget & 15) << (8 - idx * 4)
  }

  return [playerName, loadoutData]
}

export function encodeLoadouts(loadouts: MinifiedLoadoutType[]) {
  const minified = loadouts.map(l => l.join(','))
  return btoa(minified.join(';'))
}
