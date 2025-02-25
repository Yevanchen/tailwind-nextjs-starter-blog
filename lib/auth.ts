import { create } from 'zustand'

interface AuthState {
  isAuthenticated: boolean
  login: (password: string) => boolean
  logout: () => void
}

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  login: (password: string) => {
    const isValid = password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD
    if (isValid) {
      set({ isAuthenticated: true })
    }
    return isValid
  },
  logout: () => set({ isAuthenticated: false }),
}))

export default useAuthStore
