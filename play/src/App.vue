<script setup lang="ts">
import { ref } from "vue";

const scrollRef = ref();

const list = ref(new Array(40));

function onUpPull() {
  setTimeout(() => {
    list.value.push(...new Array(10));
    scrollRef.value.finishUpPull();
  }, 1000);
}

function onDownPull() {
  setTimeout(() => {
    list.value = new Array(Math.random() > 0.5 ? 0 : 50);
    scrollRef.value.finishDownPull(list.value.length);
  }, 1000);
}
</script>

<template>
  <div class="wrapper">
    <GmScroll ref="scrollRef" @up-pull="onUpPull" @down-pull="onDownPull">
      <p v-for="(item, key) in list" :key="key">内容{{ key }}</p>
    </GmScroll>
  </div>
</template>
