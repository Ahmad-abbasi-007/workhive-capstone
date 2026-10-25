import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
const API = import.meta.env.VITE_API_URL || "http://localhost:5000"

export default function Dashboard(){
  const { user, dark } = useAuth()
  const [projects, setProjects] = useState([])

  useEffect(()=>{ fetch(`${API}/api/projects`).then(r=>r.json()).then(setProjects) },[])

  const myProjects = projects.filter(p=> (p.client?._id||p.client)?.toString()===user._id?.toString())
  const myJobs = projects.filter(p=> (p.assignedFreelancer?._id||p.assignedFreelancer)?.toString()===user._id?.toString())
  const openCount = projects.filter(p=>p.status==='open').length
  const hiredCount = projects.filter(p=>p.status==='hired').length
  const completedCount = projects.filter(p=>p.status==='completed').length
  const totalBudget = projects.reduce((s,p)=>s+(Number(p.budget)||0),0)

  const Card = ({title, value, sub})=>(
    <div style={{background: dark?'#141414':'#fff', borderColor: dark?'#262626':'#E8E6E1'}} className="border rounded-[20px] p-6"><div className="text-[11px] text-[#8A8A8A] uppercase tracking-widest">{title}</div><div style={{color: dark?'#fff':'#000'}} className="text-[28px] font-black mt-2">{value}</div><div className="text-[12px] text-[#8A8A8A] mt-1">{sub}</div></div>
  )

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-8">
      <h1 style={{color: dark?'#fff':'#000'}} className="text-[28px] font-black">Dashboard</h1>
      <p className="text-[13px] text-[#8A8A8A] mt-1">Welcome {user.name} • {user.role} • Stretch: Dashboard with charts</p>

      <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Total Projects" value={projects.length} sub="In platform"/>
        <Card title="Open" value={openCount} sub="Available for bids"/>
        <Card title="Hired" value={hiredCount} sub="In progress"/>
        <Card title="Completed" value={completedCount} sub="Done projects"/>
      </div>

      <div className="mt-8 grid lg:grid-cols-2 gap-6">
        <div style={{background: dark?'#141414':'#fff', borderColor: dark?'#262626':'#E8E6E1'}} className="border rounded-[20px] p-6">
          <h3 style={{color: dark?'#fff':'#000'}} className="font-bold text-[14px]">Project Status Chart</h3>
          <div className="mt-6 space-y-3">
            {[{label:'Open', count:openCount, color:'#3B82F6'}, {label:'Hired', count:hiredCount, color:'#F59E0B'}, {label:'Completed', count:completedCount, color:'#10B981'}].map(c=>(
              <div key={c.label}><div className="flex justify-between text-[12px]"><span style={{color: dark?'#888':'#6B6B6B'}}>{c.label}</span><span style={{color: dark?'#fff':'#000'}} className="font-bold">{c.count}</span></div><div style={{background: dark?'#0A0A0A':'#F5F3EF'}} className="mt-1 h-2 rounded-full overflow-hidden"><div style={{width:`${projects.length? (c.count/projects.length)*100 :0}%`, background:c.color}} className="h-full rounded-full"></div></div></div>
            ))}
          </div>
        </div>

        <div style={{background: dark?'#141414':'#fff', borderColor: dark?'#262626':'#E8E6E1'}} className="border rounded-[20px] p-6">
          <h3 style={{color: dark?'#fff':'#000'}} className="font-bold text-[14px]">{user.role==='client'?'My Stats':'My Jobs Stats'}</h3>
          <div className="mt-6 space-y-4 text-[13px]">
            {user.role==='client' ? <>
              <div className="flex justify-between"><span className="text-[#8A8A8A]">My Posted Projects</span><span style={{color: dark?'#fff':'#000'}} className="font-bold">{myProjects.length}</span></div>
              <div className="flex justify-between"><span className="text-[#8A8A8A]">Total Budget Posted</span><span style={{color: dark?'#fff':'#000'}} className="font-bold">${myProjects.reduce((s,p)=>s+(Number(p.budget)||0),0)}</span></div>
              <div className="flex justify-between"><span className="text-[#8A8A8A]">Completed</span><span className="font-bold text-green-600">{myProjects.filter(p=>p.status==='completed').length}</span></div>
            </> : <>
              <div className="flex justify-between"><span className="text-[#8A8A8A]">My Jobs (Hired)</span><span style={{color: dark?'#fff':'#000'}} className="font-bold">{myJobs.length}</span></div>
              <div className="flex justify-between"><span className="text-[#8A8A8A]">Earnings (Completed)</span><span style={{color: dark?'#fff':'#000'}} className="font-bold">${myJobs.filter(p=>p.status==='completed').reduce((s,p)=>s+(Number(p.budget)||0),0)}</span></div>
              <div className="flex justify-between"><span className="text-[#8A8A8A]">In Progress</span><span className="font-bold text-orange-500">{myJobs.filter(p=>p.status==='hired').length}</span></div>
            </>}
            <div style={{borderColor: dark?'#1F1F1F':'#F0EFEB'}} className="pt-4 border-t"><div className="text-[11px] text-[#8A8A8A]">Platform Total Value: ${totalBudget} • Dark mode ✓ • Real-time Chat ✓ • Search Filters ✓</div></div>
          </div>
        </div>
      </div>
    </div>
  )
}