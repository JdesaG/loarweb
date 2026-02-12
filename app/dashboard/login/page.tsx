'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabase } from '@/hooks/supabase'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, Lock } from 'lucide-react'
import { toast } from 'sonner'

const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Mínimo 6 caracteres'),
})

type LoginInput = z.infer<typeof loginSchema>

export default function LoginPage() {
    const router = useRouter()
    const supabase = useSupabase()
    const [loading, setLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = async (data: LoginInput) => {
        setLoading(true)
        const { error } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
        })

        if (error) {
            toast.error(error.message)
            setLoading(false)
            return
        }

        toast.success('Sesión iniciada')
        router.push('/dashboard')
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-2 rounded-full bg-neutral-900 p-3">
                        <Lock className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-xl">Panel LOAR</CardTitle>
                    <CardDescription>Ingresa con tu cuenta de administrador</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input {...register('email')} type="email" placeholder="admin@loar.ec" />
                            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>Contraseña</Label>
                            <Input {...register('password')} type="password" placeholder="••••••••" />
                            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Iniciar sesión'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
