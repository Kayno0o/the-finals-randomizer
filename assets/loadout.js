// data.json
const data_default = [
  {
    name: 'Light',
    specializations: ['Cloaking Device', 'Evasive Dash', 'Grappling Hook'],
    weapons: ['93R', 'Dagger', 'LH1', 'M11', 'M26 Matter', 'Recursive Bow', 'SH1900', 'SR-84', 'Sword', 'Throwing Knives', 'V9S', 'XP-54'],
    gadgets: ['Breach Charge', 'Flashbang', 'Frag Grenade', 'Gas Grenade', 'Gateway', 'Glitch Grenade', 'Goo Grenade', 'Pyro Grenade', 'Smoke Grenade', 'Sonar Grenade', 'Stun Gun', 'Thermal Bore', 'Thermal Vision', 'Tracking Dart', 'Vanishing Bomb', 'Gravity Vortex'],
  },
  {
    name: 'Medium',
    specializations: ['Dematerializer', 'Guardian Turret', 'Healing Beam'],
    weapons: ['AKM', 'Cerberus 12GA', 'CL-40', 'Dual Blades', 'Famas', 'Fcar', 'Model 1887', 'Pike-556', 'R .357', 'Riot Shield'],
    gadgets: ['APS Turret', 'Data Reshaper', 'Defibrillator', 'Explosive Mine', 'Flashbang', 'Frag Grenade', 'Gas Grenade', 'Gas Mine', 'Glitch Trap', 'Goo Grenade', 'Jump Pad', 'Proximity Sensor', 'Pyro Grenade', 'Smoke Grenade', 'Zipline'],
  },
  {
    name: 'Heavy',
    specializations: ['Charge \'n\' Slam', 'Goo Gun', 'Mesh Shield', 'Winch Claw'],
    weapons: ['.50 Akimbo', 'Flamethrower', 'KS-23', 'Lewis Gun', 'M60', 'MGL32', 'SA1216', 'Shak-50', 'Sledgehammer', 'Spear'],
    gadgets: ['Anti-Gravity Cube', 'Barricade', 'C4', 'Dome Shield', 'Explosive Mine', 'Flashbang', 'Frag Grenade', 'Gas Grenade', 'Goo Grenade', 'Lockbolt', 'Proximity Sensor', 'Pyro Grenade', 'Pyro Mine', 'RPG-7', 'Smoke Grenade'],
  },
]

window.data_default = data_default

// utils.ts
function randomInt(minOrMax, max) {
  const getRandomValue = Math.random
  const min = typeof max !== 'number' ? 0 : minOrMax
  const range = typeof max !== 'number' ? minOrMax : max - minOrMax
  return Math.floor(getRandomValue() * range) + min
}

// loadout.ts
function getClass(className) {
  return data_default.findIndex(c => c.name === className)
}
function getSpecialization(classIndex) {
  return randomInt(data_default[classIndex].specializations.length)
}
function getWeapon(classIndex) {
  return randomInt(data_default[classIndex].weapons.length)
}
function getGadget(classIndex) {
  return randomInt(data_default[classIndex].gadgets.length)
}
function generateLoadout(player) {
  const classIndex = randomInt(3)
  const classObj = data_default[classIndex]
  const specialization = randomInt(classObj.specializations.length)
  const weapon = randomInt(classObj.weapons.length)
  const gadgets = Object.keys([...new Array(classObj.gadgets.length)])
  for (let i = gadgets.length - 1; i > 0; i--) {
    const j = randomInt(0, i + 1);
    [gadgets[i], gadgets[j]] = [gadgets[j], gadgets[i]]
  }
  return {
    playerName: player,
    class: classIndex,
    specialization,
    weapon,
    gadgets: gadgets.slice(0, 3),
  }
}

window.getWeapon = getWeapon
window.getSpecialization = getSpecialization
window.getGadget = getGadget
window.getClass = getClass
window.generateLoadout = generateLoadout
