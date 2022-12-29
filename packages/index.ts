import { Plugin, App } from 'vue'
export * from './components'
import { default as components } from './components'

const install = (app: App) => {
  for (const component of components) {
    app.use(component)
  }
}

export default {
  install
} as Plugin
