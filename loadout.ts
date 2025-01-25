import classes from './data.json'
import { getRandomElement, randomInt } from './utils'

interface LoadoutType { playerName: string, class: string, weapon: string, gadgets: string[], specialization: string }
interface ClassType { name: string, specializations: string[], weapons: string[], gadgets: string[] }

export function getClass(className: 'light' | 'medium' | 'heavy'): ClassType {
  return classes.find(c => c.name === className)!
}

export function getSpecialization(className: 'light' | 'medium' | 'heavy') {
  return getRandomElement(getClass(className).specializations)
}

export function getWeapon(className: 'light' | 'medium' | 'heavy') {
  return getRandomElement(getClass(className).weapons)
}

export function getGadget(className: 'light' | 'medium' | 'heavy') {
  return getRandomElement(getClass(className).gadgets)
}

export function generateLoadout(player: string): LoadoutType {
  const playerClass = getRandomElement(classes)
  const specialization = getRandomElement(playerClass.specializations)
  const weapon = getRandomElement(playerClass.weapons)

  const gadgets = [...playerClass.gadgets]
  for (let i = gadgets.length - 1; i > 0; i--) {
    const j = randomInt(0, i + 1)
    ;[gadgets[i], gadgets[j]] = [gadgets[j], gadgets[i]]
  }

  return {
    playerName: player,
    class: playerClass.name,
    specialization,
    weapon,
    gadgets: gadgets.slice(0, 3),
  }
}
