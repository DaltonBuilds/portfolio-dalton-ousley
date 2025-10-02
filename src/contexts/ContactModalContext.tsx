"use client"

import * as React from "react"
import { ContactFormModal } from "@/components/ContactFormModal"

interface ContactModalContextType {
  openContactModal: () => void
  closeContactModal: () => void
  isOpen: boolean
}

const ContactModalContext = React.createContext<ContactModalContextType | undefined>(undefined)

export function ContactModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false)

  const openContactModal = React.useCallback(() => {
    setIsOpen(true)
  }, [])

  const closeContactModal = React.useCallback(() => {
    setIsOpen(false)
  }, [])

  const value = React.useMemo(
    () => ({
      openContactModal,
      closeContactModal,
      isOpen,
    }),
    [openContactModal, closeContactModal, isOpen]
  )

  return (
    <ContactModalContext.Provider value={value}>
      {children}
      <ContactFormModal open={isOpen} onOpenChange={setIsOpen} />
    </ContactModalContext.Provider>
  )
}

export function useContactModal() {
  const context = React.useContext(ContactModalContext)
  if (context === undefined) {
    throw new Error("useContactModal must be used within a ContactModalProvider")
  }
  return context
}

