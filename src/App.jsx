import { Routes, Route } from 'react-router-dom'
import Login from '@/Screens/Login.jsx'
import Register from '@/Screens/Register.jsx'
import ForgotPassword from '@/Screens/Password/ForgotPassword.jsx'
import ResetPassword from './Screens/Password/ResetPassword'
import { GoogleOAuthProvider } from '@react-oauth/google'

function App() {
  const ClientIdGoogle = import.meta.env.VITE_Client_ID
  return (
    <GoogleOAuthProvider clientId={ClientIdGoogle}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/ResetPassword" element={<ResetPassword />} />
      </Routes>
    </GoogleOAuthProvider>
  )
}

export default App
