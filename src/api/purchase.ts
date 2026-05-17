import { get, post, put, del } from './client'
import type { PurchaseOrder, PaginatedResult, PaginationParams } from '@/types'

export function getOrderList(params: PaginationParams & { keyword?: string; status?: string }): Promise<PaginatedResult<PurchaseOrder>> {
    return get('/purchase/orders', { params })
}

export function getOrderDetail(id: number): Promise<PurchaseOrder> {
    return get(`/purchase/orders/${id}`)
}

export function createOrder(data: Partial<PurchaseOrder>): Promise<PurchaseOrder> {
    return post('/purchase/orders', data)
}

export function updateOrder(id: number, data: Partial<PurchaseOrder>): Promise<PurchaseOrder> {
    return put(`/purchase/orders/${id}`, data)
}

export function deleteOrder(id: number): Promise<void> {
    return del(`/purchase/orders/${id}`)
}

export function confirmOrder(id: number): Promise<void> {
    return post(`/purchase/orders/${id}/confirm`)
}

export function closeOrder(id: number): Promise<void> {
    return post(`/purchase/orders/${id}/close`)
}
