import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
const API = import.meta.env.VITE_API_URL || "http://localhost:5000"

export default function Login(){
  const [form, setForm] = useState({email:'', password:''})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login, dark } = useAuth()
  const navigate = useNavigate()

  const submit = async (e)=>{
    e.preventDefault()
    if(!form.email || !form.password){ setError('All fields required'); return }
    setLoading(true); setError('')
    try{
      const res = await fetch(`${API}/api/auth/login`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form)})
      const d = await res.json()
      if(!res.ok) throw new Error(d.msg||'Login failed')
      login(d); navigate('/projects')
    }catch(err){ setError(err.message) }
    finally{ setLoading(false) }
  }

  return (
    <div className="min-h-[80vh] grid place-items-center px-4">
      <form onSubmit={submit} style={{background: dark?'#141414':'#fff', borderColor: dark?'#262626':'#E8E6E1'}} className="w-full max-w-[400px] border rounded-[24px] p-8">
        <h1 style={{color: dark?'#fff':'#000'}} className="text-[24px] font-black">Welcome back</h1>
        <p className="text-[13px] text-[#8A8A8A] mt-1">Sign in to WorkHive</p>
        {error && <div className="mt-4 bg-red-500/10 text-red-500 text-[12px] p-3 rounded-[10px]">{error}</div>}
        <div className="mt-6 space-y-3">
          <input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Email" style={{background: dark?'#0A0A0A':'#FBFBF9', borderColor: dark?'#2A2A2A':'#E8E6E1', color: dark?'#fff':'#000'}} className="w-full h-[46px] px-4 border rounded-[12px] text-[14px]"/>
          <input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Password" style={{background: dark?'#0A0A0A':'#FBFBF9', borderColor: dark?'#2A2A2A':'#E8E6E1', color: dark?'#fff':'#000'}} className="w-full h-[46px] px-4 border rounded-[12px] text-[14px]"/>
          <button disabled={loading} style={{background: dark?'#fff':'#000', color: dark?'#000':'#fff'}} className="w-full h-[46px] rounded-[12px] text-[14px] font-bold disabled:opacity-50">{loading?'Signing in...':'Sign in →'}</button>
          <p className="text-[13px] text-center text-[#8A8A8A]">No account? <Link to="/register" className="text-violet-600 font-bold">Sign up</Link></p>
        </div>
      </form>
    </div>
  )
}