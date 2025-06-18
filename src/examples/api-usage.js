/**
 * API使用示例
 * 展示如何使用封装后的API
 */

// 导入API服务
import { tiandituApi, mapApi, navigationApi } from '@/api'
import { debounce, formatDistance } from '@/utils'

/**
 * 地图初始化示例
 */
const initMapExample = () => {
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

  return map
}

/**
 * POI搜索示例
 */
const searchPOIExample = async (keyword) => {
  try {
    // 使用防抖函数包装搜索
    const debouncedSearch = debounce(async () => {
      const result = await tiandituApi.searchPOI(keyword)
      if (result.success) {
        console.log('搜索结果:', result.data)
        return result.data
      } else {
        console.error('搜索失败:', result.message)
        return []
      }
    }, 300)

    return await debouncedSearch()
  } catch (error) {
    console.error('搜索出错:', error)
    return []
  }
}

/**
 * 逆地理编码示例
 */
const reverseGeocodeExample = async (coordinates) => {
  try {
    const result = await tiandituApi.getAddressFromCoordinates(coordinates)
    if (result.success) {
      console.log('地址信息:', result.address)
      return result.address
    } else {
      console.error('获取地址失败:', result.message)
      return '未知地址'
    }
  } catch (error) {
    console.error('获取地址出错:', error)
    return '未知地址'
  }
}

/**
 * 公交路线规划示例
 */
const searchBusRouteExample = async (startPoint, endPoint) => {
  try {
    const result = await navigationApi.searchBusRoute(startPoint, endPoint)
    if (result.success) {
      console.log('公交路线:', result.data)
      // 处理路线数据
      const routes = result.data.map((route) => ({
        ...route,
        formattedDistance: formatDistance(route.distance),
      }))
      return routes
    } else {
      console.error('路线规划失败:', result.message)
      return []
    }
  } catch (error) {
    console.error('路线规划出错:', error)
    return []
  }
}

/**
 * 驾车路线规划示例
 */
const searchDriveRouteExample = async (startPoint, endPoint) => {
  try {
    const result = await navigationApi.searchDriveRoute(startPoint, endPoint)
    if (result.success) {
      console.log('驾车路线:', result.data)
      return result.data
    } else {
      console.error('路线规划失败:', result.message)
      return null
    }
  } catch (error) {
    console.error('路线规划出错:', error)
    return null
  }
}

/**
 * 步行路线规划示例
 */
const searchWalkingRouteExample = async (startPoint, endPoint) => {
  try {
    const result = await navigationApi.searchWalkingRoute(startPoint, endPoint)
    if (result.success) {
      console.log('步行路线:', result.data)
      return result.data
    } else {
      console.error('路线规划失败:', result.message)
      return null
    }
  } catch (error) {
    console.error('路线规划出错:', error)
    return null
  }
}

// 导出示例函数
export {
  initMapExample,
  searchPOIExample,
  reverseGeocodeExample,
  searchBusRouteExample,
  searchDriveRouteExample,
  searchWalkingRouteExample,
}
