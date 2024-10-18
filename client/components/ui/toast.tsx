import React, { createContext, useState, useContext } from 'react'

interface ToastContextType {
  addToast: (message: string) => void
  removeToast: (id: number) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export interface ToastProps {
  id: number
  message: string
}

export const Toast: React.FC<ToastProps> = ({ id, message }) => {
  const { removeToast } = useToast()

  return (
    <div className="toast" onClick={() => removeToast(id)}>
      {message}
    </div>
  )
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const addToast = (message: string) => {
    const newToast = { id: Date.now(), message }
    setToasts((prevToasts) => [...prevToasts, newToast])
  }

  const removeToast = (id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
