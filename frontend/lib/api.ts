import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 300000 // 5 分钟超时
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('[API Error]', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

// API 接口
export const articleApi = {
  // 生成文章
  generate: (data: {
    topic: string
    tier: string
    formats?: string[]
  }) =>
    api.post('/api/generate', data),

  // 查询状态
  getStatus: (articleId: string) =>
    api.get(`/api/status/${articleId}`),

  // 获取文章列表
  getList: (params?: { page?: number; limit?: number }) =>
    api.get('/api/articles', { params }),

  // 获取文章详情
  getDetail: (articleId: string) =>
    api.get(`/api/articles/${articleId}`),

  // 获取下载链接
  download: (articleId: string, format: string) =>
    api.get(`/api/articles/${articleId}/download/${format}`, {
      responseType: 'blob'
    })
}

export default api
