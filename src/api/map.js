/**
 * 地图API服务
 * 封装所有与地图操作相关的功能
 */

import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import { ScaleLine } from 'ol/control'
import Coordinate from '@/utils/coordinate'

// 天地图API密钥
const TIANDITU_KEY = window.cxApp?.tianKey || 'e2d035db12beacb76df2c1efc7ec03ab'

/**
 * 创建地图图层配置
 * @returns {Array} 图层配置数组
 */
export const createLayerOptions = () => {
  return [
    {
      key: 'img_c',
      title: '天地图影像',
      option: {
        projection: 'EPSG:4326',
        url: `http://t{0-7}.tianditu.gov.cn/img_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${TIANDITU_KEY}`,
      },
    },
    {
      key: 'vec_c',
      title: '天地图',
      option: {
        projection: 'EPSG:4326',
        url: `http://t{0-7}.tianditu.gov.cn/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${TIANDITU_KEY}`,
      },
    },
    {
      key: 'cva_c',
      title: '天地图注记',
      option: {
        projection: 'EPSG:4326',
        url: `http://t{0-7}.tianditu.gov.cn/cva_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${TIANDITU_KEY}`,
      },
    },
  ]
}

/**
 * 创建地图实例
 * @param {string} target - 地图容器ID
 * @param {Object} viewOptions - 视图配置选项
 * @param {Object} layerVisibility - 图层可见性配置
 * @returns {Object} 地图实例
 */
export const createMap = (target, viewOptions = {}, layerVisibility = {}) => {
  // 默认视图配置
  const defaultViewOptions = {
    projection: 'EPSG:3857',
    center: [12758612.973162018, 3562849.0216611675],
    zoom: 17.5,
    maxZoom: 18.5,
  }

  // 合并视图配置
  const mergedViewOptions = { ...defaultViewOptions, ...viewOptions }

  // 获取图层配置
  const layerOptions = createLayerOptions()

  // 创建地图实例
  const map = new Map({
    target,
    view: new View(mergedViewOptions),
    layers: layerOptions.map((item) => {
      const layer = new TileLayer({
        properties: {
          name: item.key,
          title: item.title,
        },
        source: new XYZ(item.option),
        visible: layerVisibility[item.key] !== undefined ? layerVisibility[item.key] : true,
      })
      return layer
    }),
  })

  // 添加比例尺控件
  const scaleLine = new ScaleLine({
    bar: true,
    text: true,
  })
  map.addControl(scaleLine)

  return map
}

/**
 * 重置地图中心点和缩放级别
 * @param {Object} map - 地图实例
 * @param {Array} center - 中心点坐标 [lon, lat]
 * @param {number} zoom - 缩放级别
 */
export const resetMapView = (
  map,
  center = [12758612.973162018, 3562849.0216611675],
  zoom = 17.5,
) => {
  if (!map) return

  map.getView().setCenter(center)
  map.getView().setZoom(zoom)
}

/**
 * 坐标转换工具
 * @param {Array} coordinates - 坐标 [lon, lat]
 * @param {string} fromProjection - 源坐标系
 * @param {string} toProjection - 目标坐标系
 * @returns {Array} 转换后的坐标
 */
export const transformCoordinates = (
  coordinates,
  fromProjection = 'EPSG:4326',
  toProjection = 'EPSG:3857',
) => {
  return Coordinate(fromProjection, toProjection, coordinates)
}

/**
 * 获取地图中的图层
 * @param {Object} map - 地图实例
 * @param {string} layerName - 图层名称
 * @returns {Object} 图层实例
 */
export const getLayerByName = (map, layerName) => {
  if (!map) return null

  let targetLayer = null
  map.getLayers().forEach((layer) => {
    const name = layer.get('name')
    if (name === layerName) {
      targetLayer = layer
    }
  })

  return targetLayer
}

/**
 * 设置图层可见性
 * @param {Object} map - 地图实例
 * @param {Object} visibility - 图层可见性配置 {layerName: boolean}
 */
export const setLayersVisibility = (map, visibility) => {
  if (!map || !visibility) return

  Object.entries(visibility).forEach(([layerName, isVisible]) => {
    const layer = getLayerByName(map, layerName)
    if (layer) {
      layer.setVisible(isVisible)
    }
  })
}
