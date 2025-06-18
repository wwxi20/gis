# API 服务封装

本目录包含了项目中所有API服务的封装，提供了统一的接口和使用方式。

## 目录结构

```
api/
├── config.js       # 配置文件，包含API密钥和其他配置信息
├── http.js         # HTTP请求封装，统一处理请求和响应
├── index.js        # API服务入口文件，统一导出所有API服务
├── map.js          # 地图API服务，封装与地图操作相关的功能
├── navigation.js   # 导航服务API，封装路线规划相关功能
├── tianditu.js     # 天地图API服务，封装所有与天地图相关的API调用
└── README.md       # 说明文档
```

## 使用方法

### 导入API服务

```javascript
// 导入所有API服务
import { tiandituApi, mapApi, navigationApi, httpService, config } from '@/api'

// 或者导入特定的API服务
import { tiandituApi } from '@/api'
```

### 天地图API服务

```javascript
// 搜索POI
const searchResult = await tiandituApi.searchPOI('北京大学')
if (searchResult.success) {
  console.log('搜索结果:', searchResult.data)
}

// 逆地理编码 - 根据坐标获取地址
const addressResult = await tiandituApi.getAddressFromCoordinates([116.3, 39.9])
if (addressResult.success) {
  console.log('地址信息:', addressResult.address)
}

// 地理编码 - 根据地址获取坐标
const coordinatesResult = await tiandituApi.getCoordinatesFromAddress('北京市海淀区中关村')
if (coordinatesResult.success) {
  console.log('坐标信息:', coordinatesResult.coordinates)
}
```

### 地图API服务

```javascript
// 创建地图实例
const map = mapApi.createMap(
  'mapDom',
  {
    center: [12758612.973162018, 3562849.0216611675],
    zoom: 15,
  },
  {
    vec_c: true,
    img_c: false,
    cva_c: true,
  },
)

// 重置地图视图
mapApi.resetMapView(map)

// 设置图层可见性
mapApi.setLayersVisibility(map, {
  vec_c: false,
  img_c: true,
  cva_c: true,
})

// 坐标转换
const transformedCoords = mapApi.transformCoordinates([116.3, 39.9], 'EPSG:4326', 'EPSG:3857')
```

### 导航服务API

```javascript
// 公交路线规划
const busRouteResult = await navigationApi.searchBusRoute('北京大学', '天安门')
if (busRouteResult.success) {
  console.log('公交路线:', busRouteResult.data)
}

// 驾车路线规划
const driveRouteResult = await navigationApi.searchDriveRoute('北京大学', '天安门')
if (driveRouteResult.success) {
  console.log('驾车路线:', driveRouteResult.data)
}

// 步行路线规划
const walkingRouteResult = await navigationApi.searchWalkingRoute('北京大学', '天安门')
if (walkingRouteResult.success) {
  console.log('步行路线:', walkingRouteResult.data)
}
```

### HTTP请求封装

```javascript
import { httpService } from '@/api'

// GET请求
const getResult = await httpService.get('https://api.example.com/data', { id: 1 })

// POST请求
const postResult = await httpService.post('https://api.example.com/create', { name: 'test' })

// 使用axios实例
const customResult = await httpService.default.request({
  url: 'https://api.example.com/custom',
  method: 'get',
  params: { id: 1 },
})
```

### 配置信息

```javascript
import { config } from '@/api'

// 使用天地图密钥
console.log('天地图密钥:', config.TIANDITU_KEY)

// 使用天地图API URL
console.log('天地图搜索API:', config.TIANDITU_API.SEARCH_URL)

// 使用天地图图层URL
console.log('天地图矢量图层URL:', config.TIANDITU_LAYER_URLS.VEC_C)
```

## 返回结果格式

所有API调用都会返回统一格式的结果：

```javascript
// 成功时
{
  success: true,
  data: {...},  // 返回的数据
  [其他字段]     // 可能包含的其他字段
}

// 失败时
{
  success: false,
  message: '错误信息',  // 错误描述
  error: {...}         // 原始错误对象（可选）
}
```

## 注意事项

1. 所有API调用都应该使用异步/await方式处理
2. 所有API调用都应该进行错误处理
3. 天地图API密钥有使用限制，请合理使用
4. 坐标系转换时请注意源坐标系和目标坐标系的正确性
