import { Routes, Route } from 'react-router-dom'
import Login from '@/Screens/Login.jsx'
import Register from '@/Screens/Register.jsx'
import ForgotPassword from '@/Screens/Password/ForgotPassword.jsx'
import ResetPassword from './Screens/Password/ResetPassword'
import ProfileUser from './Screens/user/ProfileUser'

import { GoogleOAuthProvider } from '@react-oauth/google'
import { useEffect } from 'react'
import { useUserStore } from './Store/useUserStore'
import ProtectedRoute from './Routes/ProtectedRoute'
import RedirectIfAuth from './Routes/RedirectIfAuth'

function App() {
  const ClientIdGoogle = import.meta.env.VITE_Client_ID
  const fetchUser = useUserStore(state => state.fetchUser)

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  return (
    <GoogleOAuthProvider clientId={ClientIdGoogle}>
      <Routes>
        {/* rutas públicas que NO deben verse si ya está logueado */}
        <Route
          path="/"
          element={
            <RedirectIfAuth>
              <Login />
            </RedirectIfAuth>
          }
        />
        <Route
          path="/Register"
          element={
            <RedirectIfAuth>
              <Register />
            </RedirectIfAuth>
          }
        />
        <Route
          path="/ForgotPassword"
          element={
            <RedirectIfAuth>
              <ForgotPassword />
            </RedirectIfAuth>
          }
        />

        {/* rutas protegidas */}
        <Route
          path="/ProfileUser"
          element={
            <ProtectedRoute>
              <ProfileUser />
            </ProtectedRoute>
          }
        />
      </Routes>
    </GoogleOAuthProvider>
  )
}

export default App
