const config: {
  base_url: string
  result_code: number | string
  default_headers: AxiosHeaders
  request_timeout: number
} = {
  /**
   * api请求基础路径
   */
  base_url: (process.env.VUE_APP_INTERFACE_URL || 'http://192.168.1.114:8081') + (process.env.VUE_API_URL || ''), // 解决 import.meta.env 报错：安装 @vitejs/plugin-vue 且 创建 env.d.ts 和 .env.local 文件
  /**
   * 接口成功返回状态码
   */
  result_code: 200,

  /**
   * 接口请求超时时间
   */
  request_timeout: 30000,

  /**
   * 默认接口请求类型
   * 可选值：application/x-www-form-urlencoded multipart/form-data
   */
  default_headers: 'application/json'
}

// console.log(config.base_url);
// console.log('import.meta.env.VITE_BASE_URL', import.meta.env.VITE_BASE_URL);
// console.log('import.meta.env.VITE_API_URL', import.meta.env.VITE_API_URL);

export { config }
