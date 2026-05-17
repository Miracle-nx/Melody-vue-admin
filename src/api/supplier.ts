import { get, post, put, del } from './client'
import type { Supplier, PaginatedResult, PaginationParams } from '@/types'

export function getSupplierList(params: PaginationParams & { keyword?: string; status?: string }): Promise<PaginatedResult<Supplier>> {
    return get('/supplier/list', { params })
}

export function getSupplierDetail(id: number): Promise<Supplier> {
    return get(`/supplier/${id}`)
}

export function createSupplier(data: Partial<Supplier>): Promise<Supplier> {
    return post('/supplier', data)
}

export function updateSupplier(id: number, data: Partial<Supplier>): Promise<Supplier> {
    return put(`/supplier/${id}`, data)
}

export function deleteSupplier(id: number): Promise<void> {
    return del(`/supplier/${id}`)
}

export function approveSupplier(id: number): Promise<void> {
    return post(`/supplier/${id}/approve`)
}

export function rejectSupplier(id: number, reason: string): Promise<void> {
    return post(`/supplier/${id}/reject`, { reason })
}
