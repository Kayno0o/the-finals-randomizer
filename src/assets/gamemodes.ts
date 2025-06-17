export const maps = {
  bernal: 'Bernal',
  fortune_stadium: 'Fortune Stadium',
  kyoto: 'Kyoto',
  las_vegas_stadium: 'Las Vegas Stadium',
  las_vegas: 'Las Vegas',
  monaco: 'Monaco',
  nozomi_citadel: 'NOZOMI/CITADEL',
  seoul: 'Seoul',
  skyway_stadium: 'Skyway Stadium',
  sys_horizon: 'SYS$HORIZON',
  p_e_a_c_e_center: 'P.E.A.C.E. Center',
} satisfies Record<string, string>

export const gamemodes: {
  name: string
  arenas: (keyof typeof maps)[]
}[] = [
  {
    name: 'World Tour',
    arenas: [
      'bernal',
      'fortune_stadium',
      'kyoto',
      'las_vegas_stadium',
      'monaco',
      'nozomi_citadel',
      'seoul',
      'skyway_stadium',
      'sys_horizon',
    ],
  },
  {
    name: 'Cashout',
    arenas: [
      'bernal',
      'fortune_stadium',
      'kyoto',
      'las_vegas_stadium',
      'las_vegas',
      'monaco',
      'nozomi_citadel',
      'seoul',
      'skyway_stadium',
      'sys_horizon',
    ],
  },
  {
    name: 'Bank It',
    arenas: [
      'fortune_stadium',
      'kyoto',
      'las_vegas',
      'monaco',
      'seoul',
      'skyway_stadium',
      'sys_horizon',
    ],
  },
  {
    name: 'Power Shift',
    arenas: [
      'kyoto',
      'monaco',
      'seoul',
      'skyway_stadium',
      'sys_horizon',
    ],
  },
  {
    name: 'Terminal Attack',
    arenas: [
      'kyoto',
      'las_vegas',
      'monaco',
      'skyway_stadium',
      'sys_horizon',
    ],
  },
  {
    name: 'Team Deathmatch',
    arenas: [
      'fortune_stadium',
      'kyoto',
      'las_vegas',
      'p_e_a_c_e_center',
      'seoul',
      'skyway_stadium',
      'sys_horizon',
    ],
  },
]
