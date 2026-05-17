import { get, post, put, del } from './client'
import type { QualityIssue, PaginatedResult, PaginationParams } from '@/types'

export function getIssueList(params: PaginationParams & { keyword?: string; status?: string; level?: string }): Promise<PaginatedResult<QualityIssue>> {
    return get('/quality/issues', { params })
}

export function getIssueDetail(id: number): Promise<QualityIssue> {
    return get(`/quality/issues/${id}`)
}

export function createIssue(data: Partial<QualityIssue>): Promise<QualityIssue> {
    return post('/quality/issues', data)
}

export function updateIssue(id: number, data: Partial<QualityIssue>): Promise<QualityIssue> {
    return put(`/quality/issues/${id}`, data)
}

export function deleteIssue(id: number): Promise<void> {
    return del(`/quality/issues/${id}`)
}

export function closeIssue(id: number, resolution: string): Promise<void> {
    return post(`/quality/issues/${id}/close`, { resolution })
}
