
'use client'

import { ConfiguratorWizard } from "@/components/onboarding/ConfiguratorWizard"
import { useParams } from "next/navigation"

export default function ConfiguratorPage() {
    const params = useParams()
    const productId = params.productId as string

    return (
        <div className="container mx-auto py-8">
            <ConfiguratorWizard productId={productId} />
        </div>
    )
}
