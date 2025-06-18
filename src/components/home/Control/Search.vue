<template>
  <div class="search-container">
    <div class="search-box">
      <input
        type="text"
        v-model="keyword"
        @keyup.enter="handleSearch"
        placeholder="输入关键字进行搜索"
      />
      <button v-if="keyword" @click="clearSearch" class="clear-btn">×</button>
      <button @click="handleSearch" class="search-btn">搜索</button>
    </div>
    <ul v-show="searchResults.length > 0" class="search-results">
      <li v-for="(result, index) in searchResults" :key="index" @click="jumpToLocation(result)">
        {{ result.name }} - {{ result.address }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Feature } from 'ol'
import { Point } from 'ol/geom'
import { Vector as VectorLayer } from 'ol/layer'
import { Vector as VectorSource } from 'ol/source'
import { Style, Circle, Fill, Stroke } from 'ol/style'
import Coordinate from '@/utils/coordinate'
import { searchPOI } from '@/api/tianditu'

// 接收父组件传递的地图实例
const props = defineProps({
  map: {
    type: Object,
    required: true,
  },
})

// 定义响应式数据
const keyword = ref('')
const searchResults = ref([])

// 使用封装的API服务，不需要直接使用API密钥

// 修改全局变量为数组，存储所有历史标记层
let markerLayers = []

// 清除所有标记层
const clearAllMarkers = () => {
  markerLayers.forEach((layer) => {
    props.map.removeLayer(layer)
    layer.getSource().clear()
  })
  markerLayers = []
  searchResults.value = []
}

const defaultPointStyle = new Style({
  image: new Circle({
    radius: 8, // 点的半径，可调整大小
    fill: new Fill({
      color: 'blue', // 点的填充颜色，可自定义
    }),
    stroke: new Stroke({
      color: 'white', // 点的边框颜色
      width: 2, // 点的边框宽度
    }),
  }),
})
// 添加标记到地图
const addMarkers = (pois) => {
  // 确保 features 初始为空
  let features = []
  features = pois.map((poi) => {
    const [lon, lat] = poi.lonlat.split(',')
    const point = [Number(lon), Number(lat)]

    // 进行坐标转换
    const convertedPoint = Coordinate('EPSG:4326', 'EPSG:3857', point)

    const feature = new Feature({
      geometry: new Point(convertedPoint),
      poiData: poi,
    })
    // 为每个特征应用样式
    feature.setStyle(defaultPointStyle)
    return feature
  })

  const vectorSource = new VectorSource({
    features: features,
  })

  const vectorLayer = new VectorLayer({
    source: vectorSource,
  })
  markerLayers.push(vectorLayer)
  props.map.addLayer(vectorLayer)
}

// 定义选中点的样式
const selectedPointStyle = new Style({
  image: new Circle({
    radius: 12, // 选中点的半径更大
    fill: new Fill({
      color: 'red', // 选中点的填充颜色为红色
    }),
    stroke: new Stroke({
      color: 'white', // 选中点的边框颜色为黄色
      width: 3, // 选中点的边框宽度更宽
    }),
  }),
})

// 点击列表项时地图中心跳转到对应位置
const jumpToLocation = (result) => {
  // 提取经纬度
  const [lon, lat] = result.lonlat.split(',')
  const point = [Number(lon), Number(lat)]
  // 进行坐标转换 to3857
  const convertedPoint = Coordinate('EPSG:4326', 'EPSG:3857', point)

  props.map.getView().setCenter(convertedPoint)

  // 恢复所有点的默认样式
  markerLayers.forEach((layer) => {
    layer
      .getSource()
      .getFeatures()
      .forEach((feature) => {
        feature.setStyle(defaultPointStyle)
      })
  })
  // 找到对应点并改变样式
  markerLayers.forEach((layer) => {
    layer
      .getSource()
      .getFeatures()
      .forEach((feature) => {
        if (feature.get('poiData') === result) {
          feature.setStyle(selectedPointStyle)
        }
      })
  })
}

// 搜索函数
const handleSearch = async () => {
  if (!keyword.value) return

  try {
    clearAllMarkers() // 在搜索前清除所有标记层

    // 使用封装的API服务
    const result = await searchPOI(keyword.value)

    if (result.success) {
      searchResults.value = result.data
      addMarkers(searchResults.value)
      if (searchResults.value.length > 0) {
        jumpToLocation(searchResults.value[0])
      }
    } else {
      alert(result.message || '搜索失败')
    }
  } catch (error) {
    console.error('请求出错:', error)
    alert('搜索请求出错')
  }
}

// 清除搜索结果和输入
const clearSearch = () => {
  keyword.value = ''
  clearAllMarkers()
}
</script>

<style scoped>
.search-container {
  position: absolute;
  left: 80px;
  top: 80px;
  z-index: 1000;
}

.search-box {
  display: flex;
  align-items: center;
  height: 40px;
  width: 320px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  padding: 0 5px;
  z-index: 9999;
  position: relative;
}

.search-box input {
  flex: 1;
  height: 100%;
  border: none;
  outline: none;
  font-size: 15px;
  color: #333;
  padding: 0 10px;
}

.search-box button {
  border: none;
  outline: none;

  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-btn {
  background: none;
  font-size: 20px;
  color: #999;
  padding: 0 5px;
  position: absolute;
  right: 60px;
}

.clear-btn:hover {
  color: #666;
}

.search-btn {
  background-color: #3566b5;
  color: white;
  font-size: 14px;
  padding: 6px 12px;
  border-radius: 3px;
  margin-left: 5px;
}

.search-btn:hover {
  background-color: #3367d6;
}

.search-results {
  width: 320px;
  max-height: 300px;
  overflow-y: auto;
  padding: 0;
  margin: 5px 0 0 0;
  list-style-type: none;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.search-results li {
  padding: 10px 15px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.search-results li:hover {
  background-color: #f5f5f5;
}

.search-results li:last-child {
  border-bottom: none;
}
</style>
