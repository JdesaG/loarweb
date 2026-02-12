'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSupabase } from './supabase'
import type { Order } from '@/types'
import { toast } from 'sonner'

export function useOrders() {
    const supabase = useSupabase()
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchOrders = useCallback(async (filters?: {
        status?: string
        dateFrom?: string
        dateTo?: string
    }) => {
        setLoading(true)
        const params = new URLSearchParams()
        if (filters?.status) params.set('status', filters.status)
        if (filters?.dateFrom) params.set('dateFrom', filters.dateFrom)
        if (filters?.dateTo) params.set('dateTo', filters.dateTo)

        try {
            const res = await fetch(`/api/orders?${params.toString()}`)
            if (!res.ok) throw new Error('Failed to fetch orders')
            const data = await res.json()
            setOrders(data)
            setError(null)
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Unknown error')
        }
        setLoading(false)
    }, [])

    useEffect(() => {
        fetchOrders()

        const channel = supabase
            .channel('orders-realtime')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'orders' },
                (payload) => {
                    toast.success('🔔 Nuevo pedido recibido', {
                        description: `Orden creada`,
                    })
                    fetchOrders()
                }
            )
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'orders' },
                () => {
                    fetchOrders()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase, fetchOrders])

    return { orders, loading, error, refetch: fetchOrders }
}
