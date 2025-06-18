/**
 * 导航服务API
 * 封装路线规划相关功能
 */

import { get } from './http'
import { TIANDITU_KEY, TIANDITU_API } from './config'

/**
 * 公交路线规划
 * @param {string} startPoint - 起点
 * @param {string} endPoint - 终点
 * @returns {Promise} - 返回路线规划结果
 */
export const searchBusRoute = async (startPoint, endPoint) => {
  try {
    const params = {
      postStr: JSON.stringify({
        orig: startPoint,
        dest: endPoint,
        mid: [],
        style: 0,
      }),
      type: 'search',
      tk: TIANDITU_KEY,
    }

    const response = await get(TIANDITU_API.TRANSIT_URL, params)
    const result = response.data

    if (result.status === 0) {
      // 解析路线规划结果
      const plans = result.results.map((plan) => {
        const route = plan.routes[0]
        const steps = route.steps.map((step) => ({
          action: step.action,
          instruction: step.instructions,
          distance: step.distance,
          duration: Math.round(step.duration / 60),
        }))

        return {
          distance: route.distance,
          duration: Math.round(route.duration / 60),
          steps: steps,
        }
      })

      return {
        success: true,
        data: plans,
      }
    } else {
      return {
        success: false,
        message: result.message || '公交路线规划失败',
      }
    }
  } catch (error) {
    console.error('公交路线规划失败:', error)
    return {
      success: false,
      message: error.message || '请求出错',
      error,
    }
  }
}

/**
 * 驾车路线规划
 * @param {string} startPoint - 起点
 * @param {string} endPoint - 终点
 * @param {Array} waypoints - 途经点
 * @returns {Promise} - 返回路线规划结果
 */
export const searchDriveRoute = async (startPoint, endPoint, waypoints = []) => {
  try {
    const params = {
      postStr: JSON.stringify({
        orig: startPoint,
        dest: endPoint,
        mid: waypoints,
        style: 0,
      }),
      type: 'search',
      tk: TIANDITU_KEY,
    }

    const response = await get(TIANDITU_API.DRIVE_URL, params)
    const result = response.data

    if (result.status === 0) {
      // 解析路线规划结果
      const routes = result.results.map((route) => ({
        distance: route.distance,
        duration: Math.round(route.duration / 60),
        steps: route.steps.map((step) => ({
          instruction: step.instructions,
          distance: step.distance,
          duration: Math.round(step.duration / 60),
          roadName: step.roadName,
          startLocation: step.startLocation,
          endLocation: step.endLocation,
        })),
      }))

      return {
        success: true,
        data: routes,
      }
    } else {
      return {
        success: false,
        message: result.message || '驾车路线规划失败',
      }
    }
  } catch (error) {
    console.error('驾车路线规划失败:', error)
    return {
      success: false,
      message: error.message || '请求出错',
      error,
    }
  }
}

/**
 * 步行路线规划
 * @param {string} startPoint - 起点
 * @param {string} endPoint - 终点
 * @returns {Promise} - 返回路线规划结果
 */
export const searchWalkingRoute = async (startPoint, endPoint) => {
  try {
    const params = {
      postStr: JSON.stringify({
        orig: startPoint,
        dest: endPoint,
      }),
      type: 'search',
      tk: TIANDITU_KEY,
    }

    const response = await get(TIANDITU_API.WALKING_URL, params)
    const result = response.data

    if (result.status === 0) {
      // 解析路线规划结果
      const route = result.results[0]
      const walkingRoute = {
        distance: route.distance,
        duration: Math.round(route.duration / 60),
        steps: route.steps.map((step) => ({
          instruction: step.instructions,
          distance: step.distance,
          duration: Math.round(step.duration / 60),
          roadName: step.roadName,
          startLocation: step.startLocation,
          endLocation: step.endLocation,
        })),
      }

      return {
        success: true,
        data: walkingRoute,
      }
    } else {
      return {
        success: false,
        message: result.message || '步行路线规划失败',
      }
    }
  } catch (error) {
    console.error('步行路线规划失败:', error)
    return {
      success: false,
      message: error.message || '请求出错',
      error,
    }
  }
}
