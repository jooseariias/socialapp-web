import { Routes, Route } from 'react-router-dom'
import Login from '@/Screens/Login.jsx'
import Register from '@/Screens/Register.jsx'
import ForgotPassword from '@/Screens/Password/ForgotPassword.jsx'
import ResetPassword from './Screens/Password/ResetPassword'
import ProfileUser from './Screens/user/ProfileUser'
import DiscoverFeed from './Screens/DiscoverFeed'

import { GoogleOAuthProvider } from '@react-oauth/google'
import { useEffect } from 'react'
import { useUserStore } from './Store/useUserStore'
import ProtectedRoute from './Routes/ProtectedRoute'
import RedirectIfAuth from './Routes/RedirectIfAuth'
import DiscoverPage from './Screens/DiscoverSearch'
import Comfig from './Screens/Comfig'
import ProfileAddFollow from './Screens/user/ProfileAddFollow.jsx'


function App() {

  const ClientIdGoogle = import.meta.env.VITE_Client_ID
  const fetchUser = useUserStore(state => state.fetchUser)
  const initializeFromStorage = useUserStore(state => state.initializeFromStorage);
  const loading = useUserStore(state => state.loading);


  useEffect(() => {
    fetchUser()
    initializeFromStorage();
  }, [fetchUser,initializeFromStorage])


    if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#2b0a3d]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-fuchsia-500 border-t-transparent"></div>
      </div>
    );
  }

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
        <Route
          path="/Feed"
          element={
            <ProtectedRoute>
              <DiscoverFeed />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Discover"
          element={
            <ProtectedRoute>
              <DiscoverPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Comfig"
          element={
            <ProtectedRoute>
              <Comfig />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/AddFollow/:id"
          element={
            <ProtectedRoute>
              <ProfileAddFollow />
            </ProtectedRoute>
          }
        />
      </Routes>
    </GoogleOAuthProvider>
  )
}

export default App
