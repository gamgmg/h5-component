import '@vue/runtime-core'

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    GmScroll: typeof import('@gurming/h5-component')['GmScroll']
  }
}

export {}
