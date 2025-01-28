import node from '@astrojs/node'

// @ts-check
import { defineConfig } from 'astro/config'
import UnoCSS from 'unocss/astro'

// https://astro.build/config
export default defineConfig({
  integrations: [UnoCSS({
    injectReset: true,
  })],
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  devToolbar: {
    enabled: true,
  },
  vite: {
    server: {
      allowedHosts: ['the-finals.kevyn.fr', 'the-finals-dev.kevyn.fr'],
    },
  },
})
