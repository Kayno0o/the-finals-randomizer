import node from '@astrojs/node'
import tailwindcss from '@tailwindcss/vite'

import icon from 'astro-icon'

// @ts-check
import { defineConfig } from 'astro/config'

import { loadEnv } from 'vite'

const { APP_URL } = loadEnv(process.env.NODE_ENV, process.cwd(), '')

// https://astro.build/config
export default defineConfig({
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

    plugins: [tailwindcss()],
  },

  integrations: [icon()],
})
