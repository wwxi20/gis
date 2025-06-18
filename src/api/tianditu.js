/**
 * 天地图API服务
 * 封装所有与天地图相关的API调用
 */

import Coordinate from '@/utils/coordinate'
import { get } from './http'
import { TIANDITU_KEY, TIANDITU_API } from './config'

/**
 * 搜索POI
 * @param {string} keyword - 搜索关键词
 * @param {Object} options - 搜索选项
 * @returns {Promise} - 返回搜索结果
 */
export const searchPOI = async (keyword, options = {}) => {
  try {
    const defaultOptions = {
      level: 12,
      mapBound: '113.39,29.58,115.10,31.22',
      queryType: 4,
      start: 0,
      count: 100,
    }

    const mergedOptions = { ...defaultOptions, ...options }

    const postStr = JSON.stringify({
      keyWord: keyword,
      level: mergedOptions.level,
      mapBound: mergedOptions.mapBound,
      queryType: mergedOptions.queryType,
      start: mergedOptions.start,
      count: mergedOptions.count,
    })

    const response = await get(TIANDITU_API.SEARCH_URL, {
      postStr,
      type: 'query',
      tk: TIANDITU_KEY,
    })

    if (response.data.status !== null) {
      if (response.data.suggests) {
        return {
          success: true,
          data: response.data.suggests,
        }
      } else {
        return {
          success: false,
          message: '无法找到该地址',
        }
      }
    } else {
      return {
        success: false,
        message: response.data.msg || '搜索失败',
      }
    }
  } catch (error) {
    console.error('POI搜索请求出错:', error)
    return {
      success: false,
      message: error.message || '请求出错',
      error,
    }
  }
}

/**
 * 逆地理编码 - 根据坐标获取地址
 * @param {Array} coordinates - 坐标 [lon, lat]
 * @param {string} fromProjection - 源坐标系
 * @param {string} toProjection - 目标坐标系
 * @returns {Promise} - 返回地址信息
 */
export const getAddressFromCoordinates = async (
  coordinates,
  fromProjection = 'EPSG:3857',
  toProjection = 'EPSG:4326',
) => {
  try {
    // 进行坐标转换
    const convertedPoint = Coordinate(fromProjection, toProjection, coordinates)
    const [lon, lat] = convertedPoint

    const params = {
      postStr: JSON.stringify({
        lon: lon,
        lat: lat,
        ver: 1,
      }),
      type: 'geocode',
      tk: TIANDITU_KEY,
    }

    const response = await get(TIANDITU_API.GEOCODER_URL, params)
    const result = response.data

    if (result.msg === 'ok') {
      return {
        success: true,
        address: result.result.formatted_address,
        data: result.result,
      }
    } else {
      return {
        success: false,
        message: '地址信息获取失败',
        data: result,
      }
    }
  } catch (error) {
    console.error('获取地址信息失败:', error)
    return {
      success: false,
      message: error.message || '获取地址信息失败',
      error,
    }
  }
}

/**
 * 地理编码 - 根据地址获取坐标
 * @param {string} address - 地址
 * @returns {Promise} - 返回坐标信息
 */
export const getCoordinatesFromAddress = async (address) => {
  try {
    const params = {
      ds: JSON.stringify({
        keyWord: address,
      }),
      type: 'geocode',
      tk: TIANDITU_KEY,
    }

    const response = await get(TIANDITU_API.GEOCODER_URL, params)
    const result = response.data

    if (result.msg === 'ok' && result.result && result.result.length > 0) {
      return {
        success: true,
        coordinates: [result.result[0].lonlat.lon, result.result[0].lonlat.lat],
        data: result.result,
      }
    } else {
      return {
        success: false,
        message: '无法获取坐标信息',
        data: result,
      }
    }
  } catch (error) {
    console.error('获取坐标信息失败:', error)
    return {
      success: false,
      message: error.message || '获取坐标信息失败',
      error,
    }
  }
}
