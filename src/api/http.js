/**
 * HTTP请求封装
 * 统一处理请求和响应
 */

import axios from 'axios'

// 创建axios实例
const instance = axios.create({
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    return config
  },
  (error) => {
    // 对请求错误做些什么
    console.error('请求错误:', error)
    return Promise.reject(error)
  },
)

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    return response
  },
  (error) => {
    // 对响应错误做点什么
    console.error('响应错误:', error)
    return Promise.reject(error)
  },
)

/**
 * GET请求
 * @param {string} url - 请求地址
 * @param {Object} params - 请求参数
 * @param {Object} config - 请求配置
 * @returns {Promise} - 返回请求结果
 */
export const get = (url, params = {}, config = {}) => {
  return instance.get(url, { params, ...config })
}

/**
 * POST请求
 * @param {string} url - 请求地址
 * @param {Object} data - 请求数据
 * @param {Object} config - 请求配置
 * @returns {Promise} - 返回请求结果
 */
export const post = (url, data = {}, config = {}) => {
  return instance.post(url, data, config)
}

/**
 * PUT请求
 * @param {string} url - 请求地址
 * @param {Object} data - 请求数据
 * @param {Object} config - 请求配置
 * @returns {Promise} - 返回请求结果
 */
export const put = (url, data = {}, config = {}) => {
  return instance.put(url, data, config)
}

/**
 * DELETE请求
 * @param {string} url - 请求地址
 * @param {Object} params - 请求参数
 * @param {Object} config - 请求配置
 * @returns {Promise} - 返回请求结果
 */
export const del = (url, params = {}, config = {}) => {
  return instance.delete(url, { params, ...config })
}

// 导出axios实例
export default instance
