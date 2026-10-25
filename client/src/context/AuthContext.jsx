import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')||'null'))
  const [token, setToken] = useState(localStorage.getItem('token')||'')
  const [dark, setDark] = useState(localStorage.getItem('theme')==='dark')

  const login = (data) => {
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    setToken(data.token)
    setUser(data.user)
  }
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setToken('')
  }
  return <AuthContext.Provider value={{user, token, dark, setDark, login, logout}}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)