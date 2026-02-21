import type { CartItem } from '@/types'

// ─── Definición de combos ────────────────────────────────────────────────────
// Cada combo define dos productos (por keyword en el nombre) y el descuento total.
// El descuento se aplica una sola vez por cada par encontrado en el carrito.
// Si el cliente tiene, p.ej., 2 Camisetas + 1 Taza, el combo aplica 1 sola vez.

interface ComboRule {
    label: string      // Nombre amigable para mostrar en la UI
    product1: string   // Keyword que debe aparecer en el nombre del producto 1 (case-insensitive)
    product2: string   // Keyword que debe aparecer en el nombre del producto 2 (case-insensitive)
    discount: number   // Descuento en dólares
}

export const COMBO_RULES: ComboRule[] = [
    { label: 'Almohada + Taza', product1: 'almohada', product2: 'taza', discount: 4 },
    { label: 'Camiseta + Taza', product1: 'camiseta', product2: 'taza', discount: 4 },
    { label: 'Camiseta + Almohada', product1: 'camiseta', product2: 'almohada', discount: 2 },
    { label: 'Camiseta + Hoodie', product1: 'camiseta', product2: 'hoodie', discount: 4 },
    { label: 'Hoodie + Taza', product1: 'hoodie', product2: 'taza', discount: 4 },
    { label: 'Hoodie + Almohada', product1: 'hoodie', product2: 'almohada', discount: 4 },
]

export interface ComboResult {
    discount: number
    appliedCombos: { label: string; discount: number }[]
}

/**
 * Dado el array de items del carrito, determina qué combos aplican
 * y retorna el descuento total y la lista de combos activos.
 *
 * Si un producto ya fue "usado" para un combo, no se reutiliza en otro.
 * (Ej: si hay 1 Camiseta, solo puede participar en UN combo.)
 */
export function calculateComboDiscount(items: CartItem[]): ComboResult {
    const productNames = items.map((item) => item.product.name.toLowerCase())

    // Copia mutable para ir "consumiendo" los productos que ya formaron combo
    const available = [...productNames]
    const appliedCombos: { label: string; discount: number }[] = []
    let totalDiscount = 0

    for (const rule of COMBO_RULES) {
        const idx1 = available.findIndex((name) => name.includes(rule.product1))
        if (idx1 === -1) continue

        const idx2 = available.findIndex(
            (name, i) => i !== idx1 && name.includes(rule.product2)
        )
        if (idx2 === -1) continue

        // Par encontrado — consumir ambos y registrar el descuento
        available[idx1] = '' // marcar como usado
        available[idx2] = ''
        appliedCombos.push({ label: rule.label, discount: rule.discount })
        totalDiscount += rule.discount
    }

    return { discount: totalDiscount, appliedCombos }
}
