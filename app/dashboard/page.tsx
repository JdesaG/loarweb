
import { StatCard } from "@/components/dashboard/StatCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
    return (
        <div className="container mx-auto py-8">
            <h1 className="mb-8 text-3xl font-bold">Dashboard Overview</h1>

            <div className="grid gap-6 md:grid-cols-3">
                <StatCard
                    title="Total Revenue"
                    value="$45,231.89"
                    description="from last month"
                    trend="+20.1%"
                />
                <StatCard
                    title="Active Orders"
                    value="+573"
                    description="since last hour"
                    trend="+201"
                />
                <StatCard
                    title="Low Stock Items"
                    value="12"
                    description="Requires attention"
                />
            </div>
        </div>
    )
}
