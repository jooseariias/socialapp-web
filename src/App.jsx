import { Routes, Route } from 'react-router-dom'
import Login from '@/Screens/Login.jsx'
import Register from '@/Screens/Register.jsx'
import ForgotPassword from '@/Screens/Password/ForgotPassword.jsx'
import ResetPassword from './Screens/Password/ResetPassword'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Register" element={<Register />} />
      <Route path="/ForgotPassword" element={<ForgotPassword />} />
      <Route path="/ResetPassword" element={<ResetPassword />} />
    </Routes>

  )
}

export default App
