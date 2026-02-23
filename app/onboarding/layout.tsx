import { DM_Serif_Display } from 'next/font/google'

const dmSerif = DM_Serif_Display({
    weight: '400',
    subsets: ['latin'],
})

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className={dmSerif.className}>
            {children}
        </div>
    )
}
