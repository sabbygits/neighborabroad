'use client'

import { useState, useEffect } from 'react'
import { timeAgo } from '@/lib/utils'

export default function TimeAgo({ date }: { date: string }) {
  const [label, setLabel] = useState(() => timeAgo(date))

  useEffect(() => {
    const id = setInterval(() => setLabel(timeAgo(date)), 30_000)
    return () => clearInterval(id)
  }, [date])

  return <span>{label}</span>
}
