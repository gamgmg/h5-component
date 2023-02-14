import { containerPreview, componentPreview } from '@vitepress-demo-preview/plugin'

export default {
  title: 'h5-component',
  description: 'Just playing around.',
  base: '/h5-component/',
  themeConfig: {
    siteTitle: 'h5-component',
    nav: [{ text: 'GitHub', link: 'https://github.com/gamgmg/h5-component' }],
    sidebar: [
      {
        text: '组件',
        items: [{ text: 'Scroll', link: '/scroll/' }]
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
