import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { OrderStatus } from '@/types'

// ─── Tailwind class merging ──────────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// ─── Currency formatting ─────────────────────────────────────────────────────
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-EC', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    }).format(amount)
}

// ─── Date formatting ─────────────────────────────────────────────────────────
export function formatDate(dateStr: string): string {
    return new Intl.DateTimeFormat('es-EC', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(dateStr))
}

export function formatDateShort(dateStr: string): string {
    return new Intl.DateTimeFormat('es-EC', {
        month: 'short',
        day: 'numeric',
    }).format(new Date(dateStr))
}

// ─── Status labels & colors ─────────────────────────────────────────────────
const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string }> = {
    pending: { label: 'Pendiente', color: 'text-amber-700', bg: 'bg-amber-100' },
    processing: { label: 'En Proceso', color: 'text-blue-700', bg: 'bg-blue-100' },
    shipped: { label: 'Enviado', color: 'text-purple-700', bg: 'bg-purple-100' },
    completed: { label: 'Completado', color: 'text-emerald-700', bg: 'bg-emerald-100' },
    cancelled: { label: 'Cancelado', color: 'text-red-700', bg: 'bg-red-100' },
}

export function getStatusConfig(status: OrderStatus) {
    return STATUS_CONFIG[status] ?? STATUS_CONFIG.pending
}

export function statusLabel(status: string): string {
    return getStatusConfig(status as OrderStatus).label
}

export function statusColor(status: string): string {
    const c = getStatusConfig(status as OrderStatus)
    return `${c.color} ${c.bg}`
}

// ─── Stock indicator ─────────────────────────────────────────────────────────
export function getStockColor(qty: number): string {
    if (qty < 5) return 'text-red-600'
    if (qty < 10) return 'text-amber-600'
    return 'text-emerald-600'
}

export function getStockBg(qty: number): string {
    if (qty < 5) return 'bg-red-100'
    if (qty < 10) return 'bg-amber-100'
    return 'bg-emerald-100'
}

// ─── Generate unique ID ─────────────────────────────────────────────────────
export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}
