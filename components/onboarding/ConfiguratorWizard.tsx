
'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useConfiguratorStore } from "@/stores/configuratorStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { StyleSelector } from "./StyleSelector"
import { MaterialSelector } from "./MaterialSelector"
import { ColorSizeSelector } from "./ColorSizeSelector"
import { DesignTypeSelector } from "./DesignTypeSelector"
import { ImageUploader } from "./ImageUploader"
import { PlacementInstructions } from "./PlacementInstructions"
import { InitialAddon } from "./InitialAddon"

interface ConfiguratorWizardProps {
    productId: string
}

export function ConfiguratorWizard({ productId }: ConfiguratorWizardProps) {
    const { step, setStep, setProductId, configuration, reset, productId: storedId } = useConfiguratorStore()
    const router = useRouter()

    useEffect(() => {
        // Initialize wizard
        if (storedId !== productId) {
            reset()
            setProductId(productId)
        }
    }, [productId, setProductId, storedId, reset])

    const nextStep = () => {
        if (step < 3) {
            setStep(step + 1)
        } else {
            // Finish -> navigate to summary
            router.push(`/onboarding/${productId}/resumen`)
        }
    }

    const prevStep = () => {
        if (step > 1) setStep(step - 1)
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Personaliza tu Producto (Paso {step}/3)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {step === 1 && (
                    <div className="space-y-6">
                        <StyleSelector />
                        <MaterialSelector />
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6">
                        <ColorSizeSelector />
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6">
                        <DesignTypeSelector />
                        <ImageUploader />
                        <PlacementInstructions />
                        <InitialAddon />
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={prevStep} disabled={step === 1}>
                    Atrás
                </Button>
                <Button onClick={nextStep}>
                    {step === 3 ? 'Ver Resumen' : 'Siguiente'}
                </Button>
            </CardFooter>
        </Card>
    )
}
