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
    allowedHosts: ['the-finals.kevyn.fr'],
  }),
  devToolbar: {
    enabled: true,
  },
  server: {
    allowedHosts: ['the-finals.kevyn.fr'],
  },
  vite: {
    server: {
      allowedHosts: ['the-finals.kevyn.fr'],
    },
  },
})
