
import { Order } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface OrderDetailProps {
    order: Order | null
    onClose: () => void
    onUpdateStatus: (status: string) => void
}

export function OrderDetail({ order, onClose, onUpdateStatus }: OrderDetailProps) {
    if (!order) return null

    return (
        <Card className="fixed right-0 top-0 h-full w-full max-w-md overflow-y-auto rounded-none border-l shadow-xl z-50">
            <CardHeader className="sticky top-0 bg-background border-b z-10 flex flex-row items-center justify-between">
                <CardTitle>Order {order.order_code}</CardTitle>
                <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
                <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">Status</h4>
                    <div className="flex gap-2">
                        <Badge>{order.status}</Badge>
                        {order.status === 'pending' && (
                            <Button size="sm" variant="outline" onClick={() => onUpdateStatus('processing')}>Mark Processing</Button>
                        )}
                        {order.status === 'processing' && (
                            <Button size="sm" variant="outline" onClick={() => onUpdateStatus('shipped')}>Mark Shipped</Button>
                        )}
                        {order.status === 'shipped' && (
                            <Button size="sm" variant="outline" onClick={() => onUpdateStatus('completed')}>Complete</Button>
                        )}
                    </div>
                </div>

                <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">Customer</h4>
                    <p className="font-medium">{order.customer_info.fullName}</p>
                    <p className="text-sm">{order.customer_info.email}</p>
                    <p className="text-sm">{order.customer_info.phone}</p>
                    <p className="text-sm mt-1 whitespace-pre-wrap">{order.customer_info.address}</p>
                    {order.customer_info.notes && (
                        <p className="text-sm mt-2 italic text-muted-foreground">"{order.customer_info.notes}"</p>
                    )}
                </div>

                <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">Items</h4>
                    <div className="space-y-4">
                        {order.order_items?.map((item) => (
                            <div key={item.id} className="border rounded p-3">
                                <div className="flex justify-between mb-2">
                                    <span className="font-medium">{item.products?.name || 'Product'}</span>
                                    <span>${item.unit_price} x {item.quantity}</span>
                                </div>
                                <div className="text-xs text-muted-foreground grid grid-cols-2 gap-1">
                                    {Object.entries(item.design_details).map(([key, value]) => (
                                        typeof value === 'string' && value ? (
                                            <div key={key}><span className="capitalize">{key}:</span> {value}</div>
                                        ) : null
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border-t pt-4 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${order.total_amount.toFixed(2)}</span>
                </div>
            </CardContent>
        </Card>
    )
}
