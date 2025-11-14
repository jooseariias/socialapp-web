import { Routes, Route } from 'react-router-dom'
import Login from '@/Screens/Login.jsx'
import Register from '@/Screens/Register.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Register" element={<Register />} />
    </Routes>

  )
}

export default App
