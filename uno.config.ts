import type { IconifyJSON } from '@iconify/types'
// uno.config.ts
import { defineConfig, presetIcons, presetUno, presetWebFonts, transformerVariantGroup } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetWebFonts({
      provider: 'google',
      fonts: {
        sans: 'Saira:400,500,700,900',
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
      'content-wrapper': 'container px-6 mx-auto',
      'link': `
        relative text-xl border-solid
        text-light hover:text-primary transition-color duration-300 
        after:(no-content h-px w-0 bg-primary absolute bottom-0.5 inset-x-0 inline-block transition-[width] duration-300)
        hover:after:w-full
      `,
      'h1': 'text-2xl font-medium',
      'input': 'px-4 py-1.5 w-full text-dark placeholder:text-medium placeholder:font-light font-medium bg-light border-none outline-none',
      'btn': 'bg-primary px-5 py-1.5 h-fit text-dark font-bold hover:bg-light',
      'card': 'relative light:bg-card bg-card px-4 py-2 backdrop-light',
    },
    [/backdrop-(\w+)/, ([,c]) => `relative before:(no-content bg-${c} size-full absolute top-2 left-2 -z-2)`],
  ],
  rules: [
    ['no-content', { content: '\'\'' }],
    ['html', {
      'scrollbar-width': 'thin',
      'scrollbar-color': 'var(--color--primary) var(--color--card)',
    }],
  ],
  theme: {
    colors: {
      dark: 'var(--color--dark)',
      light: 'var(--color--light)',
      primary: 'var(--color--primary)',
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
