<template>
  <div ref="scrollRef" class="gm-scroll" @touchstart="onTouchstart" @touchmove="onTouchmove" @touchend="onTouchend">
    <div class="refresh-text" v-if="useDownPull">{{refreshText}}</div>
    <div class="scroll-content">
      <div class="empty-text" v-if="showEmpty && isEmpty">
        <div><img src="https://www.mescroll.com/img/mescroll-empty.png" alt="" /></div>
        暂无数据
      </div>
      <template v-else>
        <slot />
        <div v-if="useUpPull && showLoadmoreBtn" class="loading-text">{{loadingText}}</div>
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
    default: typeof window !== 'undefined' ? window : null // 当打包docs时，ssr环境下没有window对象会导致打包报错
  },
  distance: {
    type: Number,
    default: 40,
  },
  showEmpty: {
    type: Boolean,
    default: true,
  },
  useUpPull: {
    type: Boolean,
    default: true
  },
  useDownPull: {
    type: Boolean,
    default: true
  }
})

const emits = defineEmits(['upPull', 'downPull'])

defineExpose({
  finishUpPull,
  finishDownPull
})

const scrollRef = ref()

const refreshText = ref('下拉刷新')
const loadingText = ref('加载更多')

let startPoint = 0
let endPoint = 0
let moveDistance = 0 // 记录手指滑动过的距离
let resistance = 0 // 阻力
let canRefresh = false // 当手指滑动距离到达某个阀值时是否可以下拉刷新
let isRefreshing = false // 是否正在下拉刷新
let isLoading = false // 是否正在加载更多
const isScrollTop = ref(true)
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
      
      if(props.useUpPull && scrollRef.value.offsetHeight - scrollTop <= parentHeight.value + props.distance){
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
  showLoadmoreBtn.value = scrollRef.value.offsetHeight > parentHeight.value
}

const isEmpty = ref(false)

function finishDownPull(dataLength: number) {
  setTimeout(()=>{
    setShowLoadmoreBtn()
  })
  
  isEmpty.value = dataLength === 0

  setScrollHeight()
  // 如果把useUpPull设置成false，在手机浏览器下拉刷新之后，底部会有50px的空隙
  // 所以需要先把transform设置成translateY(0)，把空隙消掉，然后400毫秒后再设置回translate3d(0,0,0)
  scrollRef.value.style.transform = 'translateY(0)'

  refreshText.value = '下拉刷新'
  isRefreshing = false
  setTimeout(()=>{
    scrollRef.value.style.transitionDuration = '0ms'
    scrollRef.value.style.transform = 'translate3d(0,0,0)'
  }, 400)
}

function setScrollHeight(){
  scrollRef.value.style.height = isEmpty.value ? `${parentHeight.value}px` : 'auto'
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
	moveDistance = endPoint - startPoint
	if(moveDistance <= 0 ) return

  if(!props.useDownPull) return
  
  // 这里需要等preventDefault事件取消后再重新设置preventDefault
  // 不然重复设置preventDefault，浏览器会有warning
	if (event.cancelable) {
    event.preventDefault()
  }

	resistance = moveDistance/1.4 // 根据手指滑动距离设置阻力
  
	if(moveDistance > parentHeight.value*0.2) {
		canRefresh = true
		refreshText.value = '释放更新'
	}else{
    canRefresh = false
		refreshText.value = '下拉刷新'
  }
  scrollRef.value.style.transitionDuration = '0ms'
	scrollRef.value.style.transform = `translate3d(0, ${0 + (moveDistance - resistance > 0 ? moveDistance - resistance : 0)}px, 0)`
  setScrollHeight()
}

function onTouchend() {
  // 先解除绑定touchmove事件，恢复preventDefault，再重新绑定touchmove事件
	scrollRef.value.removeEventListener('touchmove', onTouchmove)
	scrollRef.value.addEventListener('touchmove', onTouchmove)
  scrollRef.value.style.transitionDuration = '0.3s'

	if(!isScrollTop) return
	if(moveDistance <= 0) return (moveDistance = 0)
	moveDistance = 0
	if (canRefresh) {
    if(isRefreshing) return
    isRefreshing = true
    scrollRef.value.style.transform = 'translate3d(0,50px,0)'
		refreshText.value = '加载中......'
    canRefresh = false
    emits('downPull')
	} else {
    scrollRef.value.style.transform = 'translate3d(0,0,0)'
	}
}
</script>