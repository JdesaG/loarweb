import { NextResponse } from 'next/server'

const JELOU_CALLBACK_URL = 'https://workflows.jelou.ai/v1/webview/callback'

export async function POST(request: Request) {
    try {
        const payload = await request.json()

        console.log('[jelou-callback] Sending to:', JELOU_CALLBACK_URL)
        console.log('[jelou-callback] Payload:', JSON.stringify(payload))

        const res = await fetch(JELOU_CALLBACK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })

        const responseText = await res.text()
        console.log('[jelou-callback] Status:', res.status, '| Response:', responseText)

        let data
        try {
            data = JSON.parse(responseText)
        } catch {
            data = { rawResponse: responseText }
        }

        if (!res.ok) {
            return NextResponse.json(
                {
                    error: `Jelou API responded with ${res.status} ${res.statusText}`,
                    status: res.status,
                    url: JELOU_CALLBACK_URL,
                    payload,
                    response: data,
                },
                { status: res.status }
            )
        }

        return NextResponse.json(data, { status: res.status })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        console.error('[jelou-callback] Error:', message)
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
