<template>
  <div class="scroll-page">
    <GmScroll ref="scrollRef" :parent="scrollParent" @up-pull="onUpPull" @down-pull="onDownPull">
      <p v-for="(item, key) in list" :key="key">内容{{ key }}</p>
    </GmScroll>
  </div>
</template>
<script setup>
import { GmScroll } from '@gurming/h5-component/es'
import '@gurming/h5-component/styles/scroll.css'

import { onMounted, ref } from 'vue'

const scrollRef = ref()

const scrollParent = ref()
onMounted(() => {
  scrollParent.value = document.querySelector('.scroll-page')
})

const list = ref(new Array(40))

function onUpPull() {
  setTimeout(() => {
    list.value.push(...new Array(10))
    scrollRef.value.finishUpPull()
  }, 1000)
}

function onDownPull() {
  setTimeout(() => {
    list.value = new Array(Math.random() > 0.5 ? 0 : 50)
    scrollRef.value.finishDownPull(list.value.length)
  }, 1000)
}
</script>

<style scoped>
.scroll-page {
  height: 300px;
  overflow: auto;
}
</style>
