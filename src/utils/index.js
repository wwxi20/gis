/**
 * 工具类
 * 封装常用的工具函数
 */

import Coordinate from './coordinate'

/**
 * 防抖函数
 * @param {Function} func - 需要防抖的函数
 * @param {number} wait - 等待时间
 * @param {boolean} immediate - 是否立即执行
 * @returns {Function} - 防抖后的函数
 */
export const debounce = (func, wait = 300, immediate = false) => {
  let timeout
  return function () {
    const context = this
    const args = arguments
    const later = function () {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}

/**
 * 节流函数
 * @param {Function} func - 需要节流的函数
 * @param {number} wait - 等待时间
 * @returns {Function} - 节流后的函数
 */
export const throttle = (func, wait = 300) => {
  let timeout
  let previous = 0
  return function () {
    const context = this
    const args = arguments
    const now = Date.now()
    const remaining = wait - (now - previous)
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previous = now
      func.apply(context, args)
    } else if (!timeout) {
      timeout = setTimeout(() => {
        previous = Date.now()
        timeout = null
        func.apply(context, args)
      }, remaining)
    }
  }
}

/**
 * 格式化距离
 * @param {number} distance - 距离（米）
 * @returns {string} - 格式化后的距离
 */
export const formatDistance = (distance) => {
  if (distance >= 1000) {
    return (distance / 1000).toFixed(2) + ' km'
  }
  return Math.round(distance) + ' m'
}

/**
 * 格式化时间
 * @param {number} duration - 时间（秒）
 * @returns {string} - 格式化后的时间
 */
export const formatDuration = (duration) => {
  const minutes = Math.floor(duration / 60)
  const seconds = duration % 60
  if (minutes > 0) {
    return `${minutes}分${seconds > 0 ? seconds + '秒' : ''}`
  }
  return `${seconds}秒`
}

/**
 * 格式化面积
 * @param {number} area - 面积（平方米）
 * @returns {string} - 格式化后的面积
 */
export const formatArea = (area) => {
  if (area >= 1000000) {
    return (area / 1000000).toFixed(2) + ' km²'
  } else if (area >= 10000) {
    return (area / 10000).toFixed(2) + ' 公顷'
  }
  return Math.round(area) + ' m²'
}

/**
 * 生成唯一ID
 * @returns {string} - 唯一ID
 */
export const generateUniqueId = () => {
  return 'id_' + Math.random().toString(36).substr(2, 9)
}

/**
 * 导出坐标转换工具
 */
export { Coordinate }

/**
 * 默认导出
 */
export default {
  debounce,
  throttle,
  formatDistance,
  formatDuration,
  formatArea,
  generateUniqueId,
  Coordinate,
}
