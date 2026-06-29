'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface OtherProfile {
  id: string
  name: string
  university?: string
  base_hub?: string
}

interface MessagesContextValue {
  openThread: (conversationId: string, otherProfile: OtherProfile) => void
  openInbox: () => void
}

const MessagesContext = createContext<MessagesContextValue>({
  openThread: () => {},
  openInbox: () => {},
})

export function useMessages() {
  return useContext(MessagesContext)
}

interface State {
  view: 'closed' | 'inbox' | 'thread'
  conversationId: string | null
  otherProfile: OtherProfile | null
}

export function MessagesProvider({
  children,
  renderSheets,
}: {
  children: ReactNode
  renderSheets: (state: State, controls: MessagesContextValue & { close: () => void; backToInbox: () => void }) => ReactNode
}) {
  const [state, setState] = useState<State>({ view: 'closed', conversationId: null, otherProfile: null })

  const controls = {
    openThread: (conversationId: string, otherProfile: OtherProfile) =>
      setState({ view: 'thread', conversationId, otherProfile }),
    openInbox: () => setState({ view: 'inbox', conversationId: null, otherProfile: null }),
    close: () => setState({ view: 'closed', conversationId: null, otherProfile: null }),
    backToInbox: () => setState({ view: 'inbox', conversationId: null, otherProfile: null }),
  }

  return (
    <MessagesContext.Provider value={controls}>
      {children}
      {renderSheets(state, controls)}
    </MessagesContext.Provider>
  )
}
