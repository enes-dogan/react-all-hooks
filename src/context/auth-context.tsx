import React from 'react'

export const AuthContext = React.createContext({
  status: false, login: () => {
    isAuth: false,
    login: () => { }
  }
})

const AuthContextProvider = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const loginHandler = () => {
    setIsAuthenticated(true)
  }

  return (
    <AuthContext.Provider value={{ login: loginHandler, status: isAuthenticated }}>
      {props.children}
    </AuthContext.Provider>
  )
}