
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { customerInfoSchema } from "@/schemas/order"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { z } from "zod"

type CustomerFormData = z.infer<typeof customerInfoSchema>

interface CustomerFormProps {
    onSubmit: (data: CustomerFormData) => void
    isSubmitting?: boolean
}

export function CustomerForm({ onSubmit, isSubmitting }: CustomerFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CustomerFormData>({
        resolver: zodResolver(customerInfoSchema),
    })

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="fullName">Nombre Completo</Label>
                <Input id="fullName" {...register("fullName")} />
                {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register("email")} />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input id="phone" type="tel" {...register("phone")} />
                {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="address">Dirección de Envío</Label>
                <Textarea id="address" {...register("address")} />
                {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="notes">Notas Adicionales</Label>
                <Textarea id="notes" {...register("notes")} />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Procesando Order..." : "Confirmar Pedido"}
            </Button>
        </form>
    )
}
