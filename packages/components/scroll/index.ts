import { Plugin, App } from 'vue'
import Scroll from './Scroll.vue'

// 添加install方法，使其可以通过app.use(Component)的方式注册全局组件
Scroll.install = (app: App) => {
  app.component(Scroll.name, Scroll)
}

const GmScroll = Scroll as typeof Scroll & Plugin

export default GmScroll
