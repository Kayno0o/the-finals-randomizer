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
  content: {
    pipeline: {
      include: [/\.(vue|svelte|[jt]sx?|mdx?|astro|elm|php|phtml|html)($|\?)/],
    },
  },
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
      'h1': 'text-2xl',
      'input': 'px-4 py-1.5 w-full text-dark placeholder:text-card placeholder:font-light font-medium bg-light border-none outline-none disabled:(bg-card text-white)',
      'btn': 'bg-primary px-5 py-1.5 h-fit text-dark hover:bg-light uppercase',
      'card': 'relative light:bg-card bg-card px-4 py-2 pixel-backdrop-light',
      'label': 'text-lg font-medium',
      'backdrop': `
        relative
        before:(no-content bg-light size-[calc(100%_+_.5rem)] absolute top-0 left-0 -z-2 cut-tr-.5rem)
        after:(no-content bg-light op-20 size-[calc(100%_+_.5rem)] absolute top-0 left-0 -z-2 cut-bl-.5rem)
      `,
    },
    [/pixel-backdrop-(\w+)/, ([,c]) => `relative before:(no-content bg-${c} size-full absolute top-2 left-2 -z-2)`],
  ],
  rules: [
    ['no-content', { content: '\'\'' }],
    ['html', {
      'scrollbar-width': 'thin',
      'scrollbar-color': 'var(--color--primary) var(--color--card)',
    }],
    [/cut-bl-([\w.]+)/, ([,size]) => ({
      'clip-path': `polygon(0 0, 0 calc(100% - ${size}), ${size} 100%, 100% 100%, calc(100% - ${size}) calc(100% - ${size}), 0 0)`,
    })],
    [/cut-tr-([\w.]+)/, ([,size]) => ({
      'clip-path': `polygon(0 0, calc(100% - ${size}) 0, 100% ${size}, 100% 100%, calc(100% - ${size}) calc(100% - ${size}), 0 0)`,
    })],
    ['stroke-text-thin', { '-webkit-stroke-text-width': 'thin' }],
    ['stroke-text-medium', { '-webkit-stroke-text-width': 'medium' }],
    ['stroke-text-thick', { '-webkit-stroke-text-width': 'thick' }],
    ['stroke-text-none', { '-webkit-stroke-text-width': '0px' }],
  ],
  theme: {
    colors: {
      dark: 'var(--color--dark)',
      light: 'var(--color--light)',
      primary: 'var(--color--primary)',
      accent: 'var(--color--accent)',
      card: 'var(--color--card)',
      error: 'var(--color--error)',
    },
  },
  variants: [
    (matcher) => {
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

    (matcher) => {
      const regexp = /^parent\b([^:]+):/
      const match = matcher.match(regexp)
      if (!match)
        return matcher

      const c = match[1]!

      return {
        matcher: matcher.replace(regexp, ''),
        selector: s => `${c.replaceAll('_', ' ')} ${s}`,
      }
    },
  ],
})
