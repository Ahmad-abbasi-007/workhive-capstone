import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
const API = import.meta.env.VITE_API_URL || "http://localhost:5000"

export default function Projects(){
  const { user, token, dark } = useAuth()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [budgetFilter, setBudgetFilter] = useState('all')

  const load = async ()=>{
    setLoading(true)
    const res = await fetch(`${API}/api/projects`)
    setProjects(await res.json())
    setLoading(false)
  }
  useEffect(()=>{ load() },[])

  const filtered = projects.filter(p=> p.status==='open' && (p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase())) && (budgetFilter==='all' || (budgetFilter==='low' && p.budget<1000) || (budgetFilter==='mid' && p.budget>=1000 && p.budget<5000) || (budgetFilter==='high' && p.budget>=5000)))

  const submitProposal = async (p)=>{
    const amount = prompt('Your offer amount?')
    if(!amount) return
    const proposal = prompt('Your proposal message?')
    if(!proposal) return
    await fetch(`${API}/api/bids/${p._id}`, {method:'POST', headers:{'Content-Type':'application/json','x-auth-token':token}, body: JSON.stringify({amount, proposal})})
    alert('Proposal sent!'); load()
  }

  return (
    <div className="max-w-[1000px] mx-auto px-6 py-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div><h1 style={{color: dark?'#fff':'#000'}} className="text-[28px] font-black">Browse Projects</h1><p className="text-[13px] text-[#8A8A8A] mt-1">Find work that matches your skills • {filtered.length} open</p></div>
        <div className="flex gap-2">
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search projects..." style={{background: dark?'#141414':'#fff', borderColor: dark?'#2A2A2A':'#E8E6E1', color: dark?'#fff':'#000'}} className="h-[40px] px-4 border rounded-[12px] text-[13px] w-[200px]"/>
          <select value={budgetFilter} onChange={e=>setBudgetFilter(e.target.value)} style={{background: dark?'#141414':'#fff', borderColor: dark?'#2A2A2A':'#E8E6E1', color: dark?'#fff':'#000'}} className="h-[40px] px-3 border rounded-[12px] text-[12px]"><option value="all">All budgets</option><option value="low">Under $1k</option><option value="mid">$1k - $5k</option><option value="high">$5k+</option></select>
        </div>
      </div>

      {loading ? <div className="mt-8 text-center text-[#8A8A8A] text-[14px]">Loading projects...</div> : filtered.length===0 ? <div style={{borderColor: dark?'#262626':'#E8E6E1'}} className="mt-8 border border-dashed rounded-[16px] p-10 text-center"><p style={{color: dark?'#888':'#6B6B6B'}} className="text-[14px]">No projects found for "{search}"</p><p className="text-[12px] text-[#8A8A8A] mt-1">Try different keywords or budget filter</p></div> : (
        <div className="mt-8 grid gap-4">
          {filtered.map(p=>(
            <div key={p._id} style={{background: dark?'#141414':'#fff', borderColor: dark?'#262626':'#E8E6E1'}} className="border rounded-[20px] p-6 hover:shadow-lg transition">
              <div className="flex justify-between gap-6"><div><h3 style={{color: dark?'#fff':'#000'}} className="font-bold text-[16px]">{p.title}</h3><p style={{color: dark?'#888':'#6B6B6B'}} className="text-[13.5px] mt-2">{p.description}</p><div className="mt-3 text-[11px] flex gap-3" style={{color: dark?'#666':'#8A8A8A'}}><span>👤 {p.client?.name}</span><span>💬 {p.bids?.length||0} bids</span><span>⏰ {new Date(p.createdAt).toLocaleDateString()}</span></div></div><div className="text-right"><div style={{color: dark?'#fff':'#000'}} className="font-bold text-[18px]">${p.budget}</div>{user?.role==='freelancer' && <button onClick={()=>submitProposal(p)} className="mt-3 h-[34px] px-5 bg-black text-white dark:bg-white dark:text-black rounded-full text-[12px] font-bold">Apply</button>}</div></div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}