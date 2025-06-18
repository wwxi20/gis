/**
 * API配置文件
 * 统一管理API密钥和其他配置信息
 */

// 从全局配置中获取天地图密钥，如果不存在则使用默认值
export const TIANDITU_KEY = window.cxApp?.tianKey || 'e2d035db12beacb76df2c1efc7ec03ab'

// 天地图API基础URL
export const TIANDITU_API = {
  SEARCH_URL: 'https://api.tianditu.gov.cn/v2/search',
  GEOCODER_URL: 'http://api.tianditu.gov.cn/geocoder',
  SEARCH_AROUND_URL: 'https://api.tianditu.gov.cn/v2/search',
  DRIVE_URL: 'https://api.tianditu.gov.cn/drive',
  TRANSIT_URL: 'https://api.tianditu.gov.cn/transit',
  WALKING_URL: 'https://api.tianditu.gov.cn/walking',
}

// 天地图图层URL模板
export const TIANDITU_LAYER_URLS = {
  // 矢量图层
  VEC_C: `http://t{0-7}.tianditu.gov.cn/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${TIANDITU_KEY}`,
  // 矢量注记图层
  CVA_C: `http://t{0-7}.tianditu.gov.cn/cva_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${TIANDITU_KEY}`,
  // 影像图层
  IMG_C: `http://t{0-7}.tianditu.gov.cn/img_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${TIANDITU_KEY}`,
  // 影像注记图层
  CIA_C: `http://t{0-7}.tianditu.gov.cn/cia_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${TIANDITU_KEY}`,
  // 地形图层
  TER_C: `http://t{0-7}.tianditu.gov.cn/ter_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ter&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${TIANDITU_KEY}`,
  // 地形注记图层
  CTA_C: `http://t{0-7}.tianditu.gov.cn/cta_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cta&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${TIANDITU_KEY}`,
}

// 默认地图视图配置
export const DEFAULT_VIEW_CONFIG = {
  projection: 'EPSG:3857',
  center: [12758612.973162018, 3562849.0216611675],
  zoom: 17.5,
  maxZoom: 18.5,
  minZoom: 3,
}

// 默认图层可见性配置
export const DEFAULT_LAYER_VISIBILITY = {
  vec_c: true,
  img_c: false,
  cva_c: true,
}

// 坐标系定义
export const PROJECTIONS = {
  WGS84: 'EPSG:4326',
  MERCATOR: 'EPSG:3857',
}
