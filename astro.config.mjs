import node from '@astrojs/node'
// @ts-check
import { defineConfig } from 'astro/config'

import UnoCSS from 'unocss/astro'
import { loadEnv } from 'vite'

const { APP_URL } = loadEnv(process.env.NODE_ENV, process.cwd(), '')

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
      allowedHosts: [APP_URL],
    },
  },
})
