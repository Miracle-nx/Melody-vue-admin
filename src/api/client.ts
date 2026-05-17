import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import { mockAuth } from './mock/auth'

// Check if we should use mock data
const USE_MOCK = true // Pure frontend, always use mock data

const http: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor
http.interceptors.request.use(
    (config) => {
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor
http.interceptors.response.use(
    (response: AxiosResponse) => {
        return response
    },
    (error) => {
        ElMessage.error(error.message || '网络错误')
        return Promise.reject(error)
    }
)

// Mock-aware request handler
export async function mockRequest<T = any>(
    method: string,
    url: string,
    data?: any
): Promise<T> {
    // Normalize URL
    const normalizedUrl = url.replace(/^\/api/, '')

    if (normalizedUrl === '/auth/login' && method === 'post') {
        return mockAuth.login(data) as T
    }

    if (normalizedUrl === '/auth/userinfo' && method === 'get') {
        return mockAuth.getUserInfo() as T
    }

    if (normalizedUrl === '/auth/logout' && method === 'post') {
        return mockAuth.logout() as T
    }

    // Fallback: return null for unhandled endpoints
    console.warn(`[Mock] Unhandled API: ${method} ${normalizedUrl}`)
    return null as T
}

export function get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    if (USE_MOCK) {
        return mockRequest<T>('get', url)
    }
    return http.get(url, config)
}

export function post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    if (USE_MOCK) {
        return mockRequest<T>('post', url, data)
    }
    return http.post(url, data, config)
}

export function put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    if (USE_MOCK) {
        return mockRequest<T>('put', url, data)
    }
    return http.put(url, data, config)
}

export function del<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    if (USE_MOCK) {
        return mockRequest<T>('delete', url)
    }
    return http.delete(url, config)
}

export default http
