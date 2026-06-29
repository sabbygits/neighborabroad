'use client'

import { Compass, Sparkles } from 'lucide-react'

export default function DiscoverPage({ params }: { params: { hub: string } }) {
  const { hub } = params
  const hubText = hub === 'london' ? 'text-london' : 'text-seoul'
  const hubBgLight = hub === 'london' ? 'bg-london-light' : 'bg-seoul-light'

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <div className={`w-16 h-16 rounded-2xl ${hubBgLight} flex items-center justify-center mb-5`}>
        <Compass className={`w-8 h-8 ${hubText}`} />
      </div>
      <h1 className="font-sora font-bold text-2xl text-gray-900 mb-2">Coming Soon</h1>
      <p className="text-gray-500 text-sm max-w-xs leading-relaxed mb-6">
        Discover is on the way. We&apos;re building something special &mdash; student deals, city challenges, and more.
      </p>
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${hubBgLight} ${hubText} text-sm font-medium`}>
        <Sparkles className="w-4 h-4" />
        Coming soon
      </div>
    </div>
  )
}
