---
title: gurming/h5-component
---

# {{ $frontmatter.title }}

## 安装

```bash
pnpm add @gurming/h5-component
```

## 使用

全局引入

```ts
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import GmComponent from '@gurming/h5-component'
import '@gurming/h5-component/styles/index.css'

createApp(App).use(GmComponent).mount('#app')
```

按需引入

```ts
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import { GmScroll } from '@gurming/h5-component'
import '@gurming/h5-component/styles/scroll.css'

createApp(App).use(GmScroll).mount('#app')
```
