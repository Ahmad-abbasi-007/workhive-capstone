import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState, useRef, useEffect } from 'react'

export default function Navbar(){
  const { user, dark, setDark, logout } = useAuth()
  const [menu, setMenu] = useState(false)
  const ref = useRef(null)
  const navigate = useNavigate()
  useEffect(()=>{
    const h = (e)=>{ if(ref.current && !ref.current.contains(e.target)) setMenu(false) }
    document.addEventListener('mousedown', h); return()=>document.removeEventListener('mousedown', h)
  },[])
  const handleLogout = ()=>{ logout(); navigate('/login'); setMenu(false) }

  return (
    <div style={{background: dark?'#0A0A0A':'#fff', borderColor: dark?'#1F1F1F':'#E8E6E1'}} className="h-[64px] border-b sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-6 md:px-8 h-full flex justify-between items-center">
        <Link to="/" style={{color: dark?'#fff':'#000'}} className="font-black text-[20px]">WORKHIVE<span className="text-violet-600">.</span></Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/projects" className="hidden md:block text-[13px] font-medium text-[#8A8A8A] hover:text-black dark:hover:text-white">Browse</Link>
              {user.role==='client' && <Link to="/my-projects" className="hidden md:block text-[13px] font-medium text-[#8A8A8A] hover:text-black dark:hover:text-white">My Projects</Link>}
              {user.role==='freelancer' && <Link to="/my-jobs" className="hidden md:block text-[13px] font-medium text-[#8A8A8A] hover:text-black dark:hover:text-white">My Jobs</Link>}
              <Link to="/dashboard" className="hidden md:block text-[13px] font-medium text-[#8A8A8A] hover:text-black dark:hover:text-white">Dashboard</Link>
            </>
          ): null}
          <button onClick={()=>{ const nd=!dark; setDark(nd); localStorage.setItem('theme', nd?'dark':'light')}} className="w-9 h-9 rounded-full border grid place-items-center" style={{borderColor: dark?'#2A2A2A':'#E8E6E1', background: dark?'#141414':'#F5F3EF'}}>{dark?'☀️':'🌙'}</button>
          {user ? (
            <div className="relative" ref={ref}>
              <button onClick={()=>setMenu(!menu)} className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-white grid place-items-center font-bold">{user.name[0]}</button>
              {menu && (
                <div style={{background: dark?'#1A1A1A':'#fff', borderColor: dark?'#2A2A2A':'#E8E6E1'}} className="absolute right-0 top-[48px] w-[260px] rounded-[16px] border shadow-xl p-2">
                  <div style={{background: dark?'#0A0A0A':'#FBFBF9'}} className="p-3 rounded-[12px] mb-2"><div style={{color: dark?'#fff':'#000'}} className="text-[13px] font-bold">{user.name}</div><div className="text-[11px] text-[#8A8A8A]">{user.email} • {user.role}</div></div>
                  <div className="md:hidden space-y-1 mb-2">
                    <Link to="/projects" onClick={()=>setMenu(false)} className="block px-3 py-2 rounded-[10px] text-[13px] hover:bg-black/5">Browse Projects</Link>
                    {user.role==='client' && <Link to="/my-projects" onClick={()=>setMenu(false)} className="block px-3 py-2 rounded-[10px] text-[13px] hover:bg-black/5">My Projects</Link>}
                    {user.role==='freelancer' && <Link to="/my-jobs" onClick={()=>setMenu(false)} className="block px-3 py-2 rounded-[10px] text-[13px] hover:bg-black/5">My Jobs</Link>}
                    <Link to="/dashboard" onClick={()=>setMenu(false)} className="block px-3 py-2 rounded-[10px] text-[13px] hover:bg-black/5">Dashboard</Link>
                  </div>
                  <button onClick={handleLogout} className="w-full text-left px-3 py-2.5 rounded-[10px] text-[13px] text-red-500 hover:bg-red-500/10">🚪 Logout</button>
                </div>
              )}
            </div>
          ): (
            <div className="flex gap-2"><Link to="/login" className="h-9 px-4 grid place-items-center rounded-full border text-[13px] font-bold">Login</Link><Link to="/register" className="h-9 px-4 grid place-items-center rounded-full bg-black text-white dark:bg-white dark:text-black text-[13px] font-bold">Sign up</Link></div>
          )}
        </div>
      </div>
    </div>
  )
}