import { containerPreview, componentPreview } from '@vitepress-demo-preview/plugin'

export default {
  title: 'VitePress',
  description: 'Just playing around.',
  base: '/h5-component/',
  themeConfig: {
    siteTitle: false,
    logo: '/logo.svg',
    nav: [
      { text: 'Guide', link: '/guide' },
      { text: 'Configs', link: '/configs' },
      { text: 'Changelog', link: 'https://github.com/...' },
      {
        text: 'Dropdown Menu',
        items: [
          { text: 'Item A', link: '/item-1' },
          { text: 'Item B', link: '/item-2' },
          { text: 'Item C', link: '/item-3' }
        ]
      }
    ],
    sidebar: [
      {
        text: '组件',
        items: [
          { text: 'Scroll', link: '/scroll/' },
        ]
      }
    ]
  },
  markdown: {
    config(md) {
      md.use(containerPreview)
      md.use(componentPreview)
    }
  }
}
