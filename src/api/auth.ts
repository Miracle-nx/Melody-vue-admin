import { post, get } from './client'
import type { LoginParams, LoginResult, UserInfo } from '@/types'

export function login(params: LoginParams): Promise<LoginResult> {
    return post('/auth/login', params)
}

export function logout(): Promise<void> {
    return post('/auth/logout')
}

export function getUserInfo(): Promise<UserInfo> {
    return get('/auth/userinfo')
}

export function refreshToken(): Promise<{ token: string }> {
    return post('/auth/refresh')
}
