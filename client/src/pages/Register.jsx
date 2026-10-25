import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
const API = import.meta.env.VITE_API_URL || "http://localhost:5000"

export default function Register(){
  const [form, setForm] = useState({name:'', email:'', password:'', role:'client'})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login, dark } = useAuth()
  const navigate = useNavigate()

  const submit = async (e)=>{
    e.preventDefault()
    if(!form.name || !form.email || !form.password){ setError('All fields required'); return }
    if(form.password.length < 6){ setError('Password must be 6+ chars'); return }
    setLoading(true); setError('')
    try{
      const res = await fetch(`${API}/api/auth/register`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form)})
      const d = await res.json()
      if(!res.ok) throw new Error(d.msg||'Register failed')
      login(d); navigate('/projects')
    }catch(err){ setError(err.message) }
    finally{ setLoading(false) }
  }

  return (
    <div className="min-h-[80vh] grid place-items-center px-4">
      <form onSubmit={submit} style={{background: dark?'#141414':'#fff', borderColor: dark?'#262626':'#E8E6E1'}} className="w-full max-w-[400px] border rounded-[24px] p-8">
        <h1 style={{color: dark?'#fff':'#000'}} className="text-[24px] font-black">Create account</h1>
        {error && <div className="mt-4 bg-red-500/10 text-red-500 text-[12px] p-3 rounded-[10px]">{error}</div>}
        <div className="mt-6 space-y-3">
          <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Full name" style={{background: dark?'#0A0A0A':'#FBFBF9', borderColor: dark?'#2A2A2A':'#E8E6E1', color: dark?'#fff':'#000'}} className="w-full h-[46px] px-4 border rounded-[12px] text-[14px]"/>
          <input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Email" style={{background: dark?'#0A0A0A':'#FBFBF9', borderColor: dark?'#2A2A2A':'#E8E6E1', color: dark?'#fff':'#000'}} className="w-full h-[46px] px-4 border rounded-[12px] text-[14px]"/>
          <input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Password (min 6)" style={{background: dark?'#0A0A0A':'#FBFBF9', borderColor: dark?'#2A2A2A':'#E8E6E1', color: dark?'#fff':'#000'}} className="w-full h-[46px] px-4 border rounded-[12px] text-[14px]"/>
          <select value={form.role} onChange={e=>setForm({...form,role:e.target.value})} style={{background: dark?'#0A0A0A':'#FBFBF9', borderColor: dark?'#2A2A2A':'#E8E6E1', color: dark?'#fff':'#000'}} className="w-full h-[46px] px-4 border rounded-[12px] text-[14px]"><option value="client">I'm hiring (Client)</option><option value="freelancer">Looking for work (Freelancer)</option></select>
          <button disabled={loading} className="w-full h-[46px] bg-violet-600 text-white rounded-[12px] text-[14px] font-bold disabled:opacity-50">{loading?'Creating...':'Create account'}</button>
          <p className="text-[13px] text-center text-[#8A8A8A]">Have account? <Link to="/login" className="text-violet-600 font-bold">Login</Link></p>
        </div>
      </form>
    </div>
  )
}