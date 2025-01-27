import type { IconifyJSON } from '@iconify/types'
// uno.config.ts
import { defineConfig, presetIcons, presetUno, presetWebFonts, transformerVariantGroup } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetWebFonts({
      provider: 'google',
      fonts: {
        sans: 'Poppins:400,500,700',
      },
    }),
    presetIcons({
      collections: {
        // eslint-disable-next-line github/no-then
        'material-symbols': () => import('@iconify-json/material-symbols/icons.json').then(iconSet => iconSet.default as IconifyJSON),
        // eslint-disable-next-line github/no-then
        'material-symbols-light': () => import('@iconify-json/material-symbols-light/icons.json').then(iconSet => iconSet.default as IconifyJSON),
      },
    }),
  ],
  transformers: [
    transformerVariantGroup(),
  ],
  shortcuts: [
    {
      'card': 'relative light:bg-medium bg-card px-4 py-2 rounded-md',
      'content-wrapper': 'container px-6 mx-auto',
      'link': `
        relative text-xl border-solid
        text-light hover:text-accent transition-color duration-300 
        after:(no-content h-px w-0 bg-accent absolute bottom-0.5 inset-x-0 inline-block transition-[width] duration-300)
        hover:after:w-full
      `,
      'h1': 'text-2xl font-medium',
      'input': 'rounded px-4 py-1.5 w-full text-dark placeholder:text-medium placeholder:font-light font-medium bg-light border-none outline-none',
      'btn': 'bg-accent px-5 py-1.5 h-fit rounded-md text-dark font-bold',
      'small-btn': 'bg-accent px-2 py-0 rounded-md text-dark text-sm font-bold',
      'icon-btn': 'bg-accent size-4 rounded-md text-dark font-bold',
      'popper': 'w-full z-50 rounded-md mt-1 bg-medium drop-shadow-lg px-2 py-1',
    },
  ],
  rules: [
    ['no-content', { content: '\'\'' }],
    ['html', {
      'scrollbar-width': 'thin',
      'scrollbar-color': 'var(--color--accent) var(--color--medium)',
    }],
  ],
  theme: {
    colors: {
      medium: 'var(--color--medium)',
      dark: 'var(--color--dark)',
      light: 'var(--color--light)',
      gray: 'var(--color--gray)',
      accent: 'var(--color--accent)',
      card: 'var(--color--card)',
    },
  },
  variants: [
    (matcher) => {
      if (!matcher.match(/^nth-child-[\dn\-]+:/))
        return matcher
      const regexp = /^nth-child-([\dn\-]+):/
      const match = matcher.match(regexp)
      if (!match)
        return matcher
      const n = match[1]!.trim().replace(/^\(|\)$/g, '')
      return {
        matcher: matcher.replace(regexp, ''),
        selector: s => `${s}:nth-child(${n})`,
      }
    },
  ],
})
