
import { useEffect, useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase'
import { Order } from '@/types'
import { toast } from 'sonner' // Assuming sonner or use a custom toast hook

export function useOrders() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)

    const supabase = createBrowserSupabaseClient()

    useEffect(() => {
        fetchOrders()

        const channel = supabase
            .channel('orders-realtime')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'orders' },
                (payload) => {
                    const newOrder = payload.new as Order
                    setOrders((prev) => [newOrder, ...prev])

                    // Play sound
                    const audio = new Audio('/notification.mp3') // Ensure this file exists in public
                    audio.play().catch(e => console.log('Audio play failed', e))

                    toast('Nueva orden recibida', {
                        description: `Orden #${newOrder.order_code}`
                    })
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    async function fetchOrders() {
        setLoading(true)
        // Note: This fetches from API to handle complex joins/filters if needed
        // Or direct supabase select if policy allows.
        // Given the prompt "app/api/orders", we should use it.
        try {
            const res = await fetch('/api/orders')
            if (res.ok) {
                const data = await res.json()
                setOrders(data)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    return { orders, loading }
}
