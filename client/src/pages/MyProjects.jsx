import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
const API = import.meta.env.VITE_API_URL || "http://localhost:5000"

export default function MyProjects(){
  const { user, token, dark } = useAuth()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({title:'', description:'', budget:''})
  const [viewBids, setViewBids] = useState({projectId:null,bids:[]})
  const [editing, setEditing] = useState(null)

  const load = async ()=>{
    setLoading(true)
    const res = await fetch(`${API}/api/projects`); const all = await res.json()
    setProjects(all.filter(p=> (p.client?._id||p.client)?.toString()===user._id?.toString()))
    setLoading(false)
  }
  useEffect(()=>{ load() },[])

  const create = async (e)=>{
    e.preventDefault()
    if(!form.title || !form.description || !form.budget){ alert('All fields required'); return }
    const url = editing ? `${API}/api/projects/${editing}` : `${API}/api/projects`
    const method = editing ? 'PUT' : 'POST'
    const res = await fetch(url, {method, headers:{'Content-Type':'application/json','x-auth-token':token}, body: JSON.stringify(form)})
    if(res.ok){ setForm({title:'',description:'',budget:''}); setEditing(null); load() }
  }
  const del = async (id)=>{
    if(!confirm('Delete project?')) return
    await fetch(`${API}/api/projects/${id}`, {method:'DELETE', headers:{'x-auth-token':token}})
    load()
  }

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8 grid lg:grid-cols-[380px_1fr] gap-8">
      <div>
        <form onSubmit={create} style={{background: dark?'#141414':'#fff', borderColor: dark?'#262626':'#E8E6E1'}} className="border rounded-[20px] p-6 sticky top-[88px]">
          <h3 style={{color: dark?'#fff':'#000'}} className="font-bold text-[16px]">{editing?'Edit Project':'Post New Project'}</h3>
          <div className="mt-4 space-y-3">
            <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Project title (e.g. Logo Design)" style={{background: dark?'#0A0A0A':'#FBFBF9', borderColor: dark?'#2A2A2A':'#E8E6E1', color: dark?'#fff':'#000'}} className="w-full h-[44px] px-4 border rounded-[12px] text-[13px]"/>
            <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Describe your project..." style={{background: dark?'#0A0A0A':'#FBFBF9', borderColor: dark?'#2A2A2A':'#E8E6E1', color: dark?'#fff':'#000'}} className="w-full min-h-[100px] p-4 border rounded-[12px] text-[13px]"/>
            <input value={form.budget} onChange={e=>setForm({...form,budget:e.target.value})} placeholder="Budget in USD (e.g. 5000)" type="number" style={{background: dark?'#0A0A0A':'#FBFBF9', borderColor: dark?'#2A2A2A':'#E8E6E1', color: dark?'#fff':'#000'}} className="w-full h-[44px] px-4 border rounded-[12px] text-[13px]"/>
            <button className="w-full h-[44px] bg-violet-600 text-white rounded-[12px] text-[13px] font-bold">{editing?'Update Project':'Publish Project'}</button>
            {editing && <button type="button" onClick={()=>{setEditing(null); setForm({title:'',description:'',budget:''})}} className="w-full h-[40px] border rounded-[12px] text-[13px]">Cancel</button>}
          </div>
        </form>
      </div>
      <div>
        <h1 style={{color: dark?'#fff':'#000'}} className="text-[24px] font-black">My Projects ({projects.length})</h1>
        {loading ? <p className="mt-6 text-[14px] text-[#8A8A8A]">Loading...</p> : projects.length===0 ? <div style={{borderColor: dark?'#262626':'#E8E6E1'}} className="mt-6 border border-dashed rounded-[16px] p-10 text-center text-[14px] text-[#8A8A8A]">No projects yet. Create your first project on the left.</div> : (
          <div className="mt-6 space-y-4">
            {projects.map(p=>(
              <div key={p._id} style={{background: dark?'#141414':'#fff', borderColor: dark?'#262626':'#E8E6E1'}} className="border rounded-[20px] p-6">
                <div className="flex justify-between"><div><h3 style={{color: dark?'#fff':'#000'}} className="font-bold">{p.title} <span className={`ml-2 text-[10px] px-2 py-0.5 rounded-full text-white ${p.status==='open'?'bg-blue-600': p.status==='hired'?'bg-orange-500':'bg-green-600'}`}>{p.status}</span></h3><p style={{color: dark?'#888':'#6B6B6B'}} className="text-[13px] mt-1">{p.description}</p></div><div style={{color: dark?'#fff':'#000'}} className="font-bold">${p.budget}</div></div>
                <div className="mt-4 flex gap-2 flex-wrap">
                  {p.status==='open' && <><button onClick={async()=>{const r=await fetch(`${API}/api/bids/${p._id}`,{headers:{'x-auth-token':token}}); setViewBids({projectId:p._id,bids:await r.json()})} } className="h-[32px] px-4 bg-black text-white dark:bg-white dark:text-black rounded-full text-[12px] font-bold">View Bids ({p.bids?.length||0})</button><button onClick={()=>{setForm({title:p.title,description:p.description,budget:p.budget}); setEditing(p._id)}} className="h-[32px] px-4 border rounded-full text-[12px]">Edit</button><button onClick={()=>del(p._id)} className="h-[32px] px-4 border border-red-200 text-red-500 rounded-full text-[12px]">Delete</button></>}
                  {p.status!=='open' && <><Link to={`/chat/${p._id}`} className="h-[32px] px-4 bg-violet-600 text-white rounded-full text-[12px] font-bold grid place-items-center">💬 Chat</Link>{p.status==='hired' && <button onClick={async()=>{await fetch(`${API}/api/projects/${p._id}/complete`,{method:'PUT',headers:{'x-auth-token':token}}); load()}} className="h-[32px] px-4 bg-green-600 text-white rounded-full text-[12px] font-bold">Complete</button>}</>}
                </div>
                {viewBids.projectId===p._id && <div className="mt-4 border-t pt-4" style={{borderColor: dark?'#1F1F1F':'#E8E6E1'}}>{viewBids.bids.map(b=><div key={b._id} style={{background: dark?'#0A0A0A':'#FBFBF9'}} className="flex justify-between p-3 rounded-[12px] mt-2"><div><div style={{color: dark?'#fff':'#000'}} className="text-[13px] font-bold">{b.freelancer?.name} - ${b.amount}</div><div className="text-[12px] text-[#888]">{b.proposal}</div></div><button onClick={async()=>{await fetch(`${API}/api/projects/${p._id}/accept/${b._id}`,{method:'PUT',headers:{'x-auth-token':token}}); setViewBids({projectId:null,bids:[]}); load()}} className="h-[28px] px-3 bg-green-600 text-white rounded-full text-[11px] font-bold">Accept</button></div>)}<button onClick={()=>setViewBids({projectId:null,bids:[]})} className="mt-3 text-[12px] text-[#888]">Close</button></div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}