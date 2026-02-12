'use client'

import type { ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatCardProps {
    title: string
    value: string | number
    icon: ReactNode
    trend?: string
    trendUp?: boolean
    className?: string
}

export function StatCard({ title, value, icon, trend, trendUp, className }: StatCardProps) {
    return (
        <Card className={cn('overflow-hidden', className)}>
            <CardContent className="p-5">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">{title}</p>
                        <p className="text-2xl font-bold text-neutral-900">{value}</p>
                        {trend && (
                            <p className={cn('text-xs font-medium', trendUp ? 'text-emerald-600' : 'text-red-600')}>
                                {trendUp ? '↑' : '↓'} {trend}
                            </p>
                        )}
                    </div>
                    <div className="rounded-lg bg-neutral-100 p-2.5 text-neutral-600">
                        {icon}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
