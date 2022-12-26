<template>
  <div ref="srollRef" class="gm-scroll" @touchstart="onTouchstart" @touchmove="onTouchmove" @touchend="onTouchend">
    <div class="refresh-text">{{refreshText}}</div>
    <div class="scroll-content">
      <div class="empty-text" v-if="showEmpty && isEmpty">
        <div><img src="https://www.mescroll.com/img/mescroll-empty.png" alt="" /></div>
        暂无数据
      </div>
      <template v-else>
        <slot />
        <div v-if="showLoadmoreBtn" class="loading-text">{{loadingText}}</div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'GmScroll'
}
</script>
<script lang="ts" setup>
import { computed, nextTick, onMounted, ref } from 'vue'

const props = defineProps({
  parent: {
    type: Object,
    default: window
  },
  distance: {
    type: Number,
    default: 40,
  },
  showEmpty: {
    type: Boolean,
    default: true,
  }
})

const emits = defineEmits(['upPull', 'downPull'])

defineExpose({
  finishUpPull,
  finishDownPull
})

const srollRef = ref()

const refreshText = ref('下拉刷新')
const loadingText = ref('加载更多')

let startPoint = 0
let endPoint = 0
const distance = ref(0)
let resistance = 0
let canRefresh = false
const isScrollTop = ref(true)
let isRefreshing = false
let isLoading = false
const parentHeight = ref(0)
const parent = computed(() => props.parent)
const showLoadmoreBtn = ref(false)

onMounted(()=>{
	nextTick(()=>{
    parentHeight.value = parent.value instanceof Window ? parent.value.innerHeight : parent.value.clientHeight
    setShowLoadmoreBtn()
    parent.value.addEventListener('scroll', ()=>{
      const scrollTop = parent.value instanceof Window ? parent.value.scrollY : parent.value.scrollTop
      isScrollTop.value = scrollTop === 0
      
      if(srollRef.value.offsetHeight - scrollTop <= parentHeight.value + props.distance){
        if(isLoading) return
        isLoading = true
        loadingText.value = '正在加载......'
        emits('upPull')
      }
    })
  })
})

function finishUpPull(){
  loadingText.value = '加载更多'
  isLoading = false
}

function setShowLoadmoreBtn(){
  showLoadmoreBtn.value = srollRef.value.offsetHeight > parentHeight.value
}

const isEmpty = ref(false)

function finishDownPull(dataLength: number) {
  setTimeout(()=>{
    setShowLoadmoreBtn()
  })
  
  isEmpty.value = dataLength === 0

  setScrollHeight()
  srollRef.value.style.transform = 'translate3d(0,-50px,0)'
  refreshText.value = '下拉刷新'
  isRefreshing = false
  setTimeout(()=>{
    srollRef.value.style.transitionDuration = '0ms'
  }, 300)
}

function setScrollHeight(){
  srollRef.value.style.height = isEmpty.value ? `${parentHeight.value}px` : 'auto'
}

function  onTouchstart(event: any) {
	const touch = event.targetTouches[0]
	startPoint = touch.pageY
	resistance = 0
}

function onTouchmove(event: any) {
	if(!isScrollTop.value) return
	const touch = event.targetTouches[0]
	endPoint = touch.pageY
	distance.value = endPoint - startPoint
	if(distance.value <= 0 ) return
  
	if (event.cancelable) {
    event.preventDefault()
  }

	resistance = distance.value/1.4
  
	if(distance.value > parentHeight.value*0.2) {
		canRefresh = true
		refreshText.value = '释放更新'
	}else{
    canRefresh = false
		refreshText.value = '下拉刷新'
  }
  srollRef.value.style.transitionDuration = '0ms'
	srollRef.value.style.transform = `translateY(${-50 + (distance.value - resistance > 0 ? distance.value - resistance : 0)}px)`
  setScrollHeight()
}

function onTouchend() {
  // 先解除绑定touchmove事件，恢复preventDefault，再重新绑定touchmove事件
	srollRef.value.removeEventListener('touchmove', onTouchmove)
	srollRef.value.addEventListener('touchmove', onTouchmove)
  srollRef.value.style.transitionDuration = '0.3s'

	if(!isScrollTop) return
	if(distance.value <= 0) return (distance.value = 0)
	distance.value = 0
	if (canRefresh) {
    if(isRefreshing) return
    isRefreshing = true
    srollRef.value.style.transform = 'translateY(0)'
		refreshText.value = '加载中......'
    canRefresh = false
    emits('downPull')
	} else {
    srollRef.value.style.transform = 'translateY(-50px)'
		// setTimeout(()=>{
    //   srollRef.value.style.transitionDuration = '0ms'
		// }, 300)
	}
}
</script>