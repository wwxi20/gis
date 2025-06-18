<template>
  <div class="app-container">
    <!-- 地图容器 -->
    <div ref="mapContainer" class="map-container"></div>
    <!-- 控制面板 -->
    <div class="control-panel">
      <div class="input-section">
        <div class="input-group">
          <label>起点</label>
          <input v-model="startPoint" type="text" placeholder="请输入起点" />
        </div>
        <div class="input-group">
          <label>终点</label>
          <input v-model="endPoint" type="text" placeholder="请输入终点" />
        </div>
      </div>
      <div class="button-group">
        <button @click="searchBusRoute" :disabled="loadingState !== 'loaded'">
          <i class="fa fa-search"></i>查询公交路线
        </button>
        <button @click="clearRoute" :disabled="loadingState !== 'loaded'">
          <i class="fa fa-eraser"></i>清除路线
        </button>
      </div>
    </div>
    <!-- 路线信息面板 -->
    <div class="route-info-panel">
      <h3>公交路线信息</h3>
      <div v-if="routeInfo.length > 0" class="route-details">
        <div v-for="(route, index) in routeInfo" :key="index">
          <h4>路线 {{ index + 1 }}</h4>
          <div class="route-summary">
            <div>
              <span class="info-label">总距离:</span>
              <span class="info-value">{{ route.distance }} 米</span>
            </div>
            <div>
              <span class="info-label">预计时间:</span>
              <span class="info-value">{{ route.duration }} 分钟</span>
            </div>
          </div>
          <div class="route-steps">
            <h4>导航步骤</h4>
            <div class="steps-list">
              <div v-for="(step, stepIndex) in route.steps" :key="stepIndex" class="step-item">
                <div class="step-number">{{ stepIndex + 1 }}.</div>
                <div class="step-content">
                  <div class="step-action">{{ step.action }}</div>
                  <div class="step-instruction">{{ step.instruction }}</div>
                  <div class="step-details">{{ step.distance }}米，约{{ step.duration }}分钟</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="empty-info">请先查询路线</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, reactive, nextTick } from 'vue'
import { searchBusRoute as searchBusRouteApi } from '@/api/navigation'
import { TIANDITU_KEY } from '@/api/config'
// 地图容器引用
const mapContainer = ref(null)
// 地图对象
let map = null
// 公交路线规划对象
let transitRoute = null
// 加载状态管理
const loadingState = ref('loading')
const loadingMessage = ref('正在加载地图...')
const loadingError = ref('')
// 表单数据
const startPoint = ref('')
const endPoint = ref('')
// 路线信息
const routeInfo = ref([])

// 初始化地图
const initMap = () => {
  try {
    // 创建地图实例
    map = new T.Map(mapContainer.value)
    // 设置地图中心点和缩放级别
    map.centerAndZoom(new T.LngLat(105.403119, 38.028658), 4)
    // 添加地图控件
    map.addControl(new T.Scale())
    map.addControl(new T.NavigationControl())
    // 初始化公交路线规划
    transitRoute = new T.TransitRoute(map, {
      renderOptions: {
        map: map,
        autoViewport: true,
      },
      onSearchComplete: (results) => {
        if (transitRoute.getStatus() === T.STATUS_SUCCESS) {
          const plans = results.getPlans()
          const parsedRoutes = plans.map((plan) => {
            const route = plan.getRoute(0)
            const steps = route.getSteps().map((step) => ({
              action: step.getAction(),
              instruction: step.getInstruction(),
              distance: step.getDistance(),
              duration: Math.round(step.getDuration() / 60),
            }))
            return {
              distance: route.getDistance(),
              duration: Math.round(route.getDuration() / 60),
              steps: steps,
            }
          })
          routeInfo.value = parsedRoutes
        } else {
          alert('公交路线规划失败，请检查起点和终点是否正确')
        }
      },
    })
    loadingState.value = 'loaded'
    loadingMessage.value = '地图加载完成'
  } catch (error) {
    console.error('地图初始化失败:', error)
    loadingState.value = 'error'
    loadingError.value = error.message
    alert(`地图加载失败: ${error.message}`)
  }
}

// 查询公交路线
const searchBusRoute = async () => {
  if (loadingState.value !== 'loaded') {
    alert('地图尚未加载完成，请稍候再试')
    return
  }
  if (!startPoint.value || !endPoint.value) {
    alert('请输入起点和终点')
    return
  }

  try {
    // 使用封装的API服务
    const result = await searchBusRouteApi(startPoint.value, endPoint.value)

    if (result.success) {
      routeInfo.value = result.data
      // 使用天地图API在地图上绘制路线
      transitRoute.search(startPoint.value, endPoint.value)
    } else {
      alert(result.message || '公交路线规划失败')
    }
  } catch (error) {
    console.error('公交路线规划失败:', error)
    alert('公交路线规划请求出错')
  }
}

// 清除路线
const clearRoute = () => {
  routeInfo.value = []
  // 清除地图上的路线覆盖物
  map.removeOverlays()
}

// 生命周期钩子
onMounted(() => {
  loadingState.value = 'loading'
  loadingMessage.value = '正在加载天地图API...'
  // 动态加载天地图 API
  const script = document.createElement('script')
  script.src = `https://api.tianditu.gov.cn/api?v=4.0&tk=${TIANDITU_KEY}`
  script.onload = () => {
    console.log('天地图API加载完成')
    nextTick(() => {
      initMap()
    })
  }
  script.onerror = () => {
    loadingState.value = 'error'
    loadingError.value = '天地图API加载失败，请检查网络连接或API密钥'
    alert(loadingError.value)
  }
  document.body.appendChild(script)
})

onUnmounted(() => {
  // 清理地图资源
  if (map) {
    map.destroy()
    map = null
  }
  transitRoute = null
})
</script>

<style scoped>
/* 基础样式 */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: Arial, sans-serif;
}

.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

/* 地图容器 */
.map-container {
  flex: 1;
  width: 100%;
  background-color: #f0f0f0;
  position: relative;
}

/* 控制面板 */
.control-panel {
  padding: 15px;
  background-color: white;
  border-bottom: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.input-section {
  display: flex;
  gap: 10px;
}

.input-group {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.input-group label {
  font-size: 14px;
  margin-bottom: 5px;
  color: #333;
}

.input-group input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.button-group {
  display: flex;
  gap: 10px;
}

.search-button,
.clear-button {
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  transition: background-color 0.2s;
}

.search-button {
  background-color: #4285f4;
}

.search-button:disabled {
  background-color: #a6c8ff;
  cursor: not-allowed;
}

.clear-button {
  background-color: #6c757d;
}

.clear-button:disabled {
  background-color: #b8c2cc;
  cursor: not-allowed;
}

/* 路线信息面板 */
.route-info-panel {
  padding: 15px;
  background-color: white;
  border-top: 1px solid #ddd;
  max-height: 300px;
  overflow-y: auto;
}

.route-info-panel h3 {
  font-size: 16px;
  margin-bottom: 10px;
  color: #333;
}

.empty-info {
  font-size: 14px;
  color: #666;
  font-style: italic;
}

.route-details {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.route-summary {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  font-size: 14px;
}

.route-summary div {
  display: flex;
  gap: 5px;
}

.info-label {
  color: #666;
}

.info-value {
  font-weight: bold;
}

.route-steps h4 {
  font-size: 15px;
  margin-bottom: 8px;
  color: #333;
}

.steps-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.step-item {
  display: flex;
  gap: 8px;
  padding: 8px;
  border: 1px solid #eee;
  border-radius: 4px;
}

.step-number {
  font-weight: bold;
  color: #4285f4;
  min-width: 20px;
}

.step-content {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.step-action {
  font-weight: bold;
  color: #333;
}

.step-instruction {
  color: #666;
  font-size: 13px;
}

.step-details {
  color: #888;
  font-size: 12px;
}

/* 响应式设计 */
@media (max-width: 600px) {
  .input-section {
    flex-direction: column;
  }

  .route-summary {
    grid-template-columns: 1fr;
  }
}
</style>
