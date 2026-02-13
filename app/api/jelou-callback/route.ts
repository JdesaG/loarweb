import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const payload = await request.json()

        return NextResponse.json({
            received: true,
            payload,
        })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Bad request'
        return NextResponse.json({ error: message }, { status: 400 })
    }
}
