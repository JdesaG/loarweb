
import { Order } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function OrderTable({
    orders,
    onView
}: {
    orders: Order[],
    onView?: (order: Order) => void
}) {
    return (
        <div className="rounded-md border">
            <div className="w-full overflow-auto">
                <table className="w-full caption-bottom text-sm text-left">
                    <thead className="[&_tr]:border-b">
                        <tr className="border-b transition-colors hover:bg-muted/50">
                            <th className="h-12 px-4 align-middle font-medium">Cod</th>
                            <th className="h-12 px-4 align-middle font-medium">Customer</th>
                            <th className="h-12 px-4 align-middle font-medium">Status</th>
                            <th className="h-12 px-4 align-middle font-medium text-right">Total</th>
                            <th className="h-12 px-4 align-middle font-medium">Date</th>
                            <th className="h-12 px-4 align-middle font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                        {orders.map((order) => (
                            <tr key={order.id} className="border-b transition-colors hover:bg-muted/50">
                                <td className="p-4 align-middle font-medium">{order.order_code}</td>
                                <td className="p-4 align-middle">{order.customer_info.fullName}</td>
                                <td className="p-4 align-middle">
                                    <Badge variant={
                                        order.status === 'completed' ? 'default' :
                                            order.status === 'pending' ? 'secondary' :
                                                'outline'
                                    }>
                                        {order.status}
                                    </Badge>
                                </td>
                                <td className="p-4 align-middle text-right">${order.total_amount}</td>
                                <td className="p-4 align-middle">{new Date(order.created_at).toLocaleDateString()}</td>
                                <td className="p-4 align-middle">
                                    <Button variant="ghost" size="sm" onClick={() => onView?.(order)}>View</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
