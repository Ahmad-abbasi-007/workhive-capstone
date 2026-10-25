import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Projects from './pages/Projects'
import MyProjects from './pages/MyProjects'
import MyJobs from './pages/MyJobs'
import ChatPage from './pages/ChatPage'
import Dashboard from './pages/Dashboard'

function AppContent(){
  const { dark } = useAuth()
  return (
    <div style={{background: dark?'#0A0A0A':'#FFFFFF', color: dark?'#FFFFFF':'#0A0A0A'}} className="min-h-screen">
      <Navbar/>
      <Routes>
        <Route path="/" element={<Navigate to="/projects" />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/projects" element={<Projects/>} />
        <Route path="/my-projects" element={<ProtectedRoute roles={['client']}><MyProjects/></ProtectedRoute>} />
        <Route path="/my-jobs" element={<ProtectedRoute roles={['freelancer']}><MyJobs/></ProtectedRoute>} />
        <Route path="/chat/:projectId" element={<ProtectedRoute><ChatPage/></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
      </Routes>
    </div>
  )
}

export default function App(){
  return <AuthProvider><AppContent/></AuthProvider>
}