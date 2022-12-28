# Scroll 滚动组件

## 代码演示

<preview path="./index.vue" title="基本使用" description="支持下拉刷新，上拉加载"></preview>

## API

| 属性        |      说明      |  类型 |  默认值 |
| ------------- | ----------- | ---- | ---- |
| parent      | 包裹滚动列表的父级元素 | Window ｜ HTMLElement | window |
| distance      |  设置距离底部多长距离执行加载更多   | Number | 40 |
| showEmpty |   当没有数据时是否显示暂无数据    | Boolean | true |
| useUpPull |   是否开启上拉加载    | Boolean | true |
| useDownPull |   是否开启下拉刷新    | Boolean | true |
