
import { useCartStore } from '@/stores/cartStore'

export const useCart = () => {
    const store = useCartStore()
    return {
        ...store,
        // Add any derived state or helper functions if needed
        isEmpty: store.items.length === 0,
    }
}
