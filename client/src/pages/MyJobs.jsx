import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
const API = import.meta.env.VITE_API_URL || "http://localhost:5000"

export default function MyJobs(){
  const { user, dark } = useAuth()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [reviewModal, setReviewModal] = useState(null)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')

  const load = async ()=>{
    setLoading(true)
    const res = await fetch(`${API}/api/projects`); const all = await res.json()
    setProjects(all.filter(p=> (p.assignedFreelancer?._id||p.assignedFreelancer)?.toString()===user._id?.toString()))
    setLoading(false)
  }
  useEffect(()=>{ load() },[])

  const submitReview = async ()=>{
    await fetch(`${API}/api/reviews/${reviewModal._id}`, {method:'POST', headers:{'Content-Type':'application/json','x-auth-token':localStorage.getItem('token')}, body: JSON.stringify({rating, comment, reviewedId: reviewModal.client?._id||reviewModal.client})})
    alert('Review submitted!'); setReviewModal(null); setRating(5); setComment('')
  }

  return (
    <div className="max-w-[900px] mx-auto px-6 py-8">
      <h1 style={{color: dark?'#fff':'#000'}} className="text-[24px] font-black">My Jobs ({projects.length})</h1>
      <p className="text-[13px] text-[#8A8A8A] mt-1">Projects where you are hired</p>
      {loading ? <p className="mt-6 text-[14px] text-[#8A8A8A]">Loading...</p> : projects.length===0 ? <div style={{borderColor: dark?'#262626':'#E8E6E1'}} className="mt-6 border border-dashed rounded-[16px] p-10 text-center text-[14px] text-[#8A8A8A]">No jobs yet. Go to <Link to="/projects" className="text-violet-600 font-bold">Browse Projects</Link> and apply!</div> : (
        <div className="mt-6 space-y-4">
          {projects.map(p=>(
            <div key={p._id} style={{background: dark?'#141414':'#fff', borderColor: dark?'#262626':'#E8E6E1'}} className="border rounded-[20px] p-6">
              <div className="flex justify-between"><div><h3 style={{color: dark?'#fff':'#000'}} className="font-bold">{p.title} <span className={`ml-2 text-[10px] px-2 py-0.5 rounded-full text-white ${p.status==='hired'?'bg-orange-500':'bg-green-600'}`}>{p.status}</span></h3><p style={{color: dark?'#888':'#6B6B6B'}} className="text-[13px] mt-1">{p.description}</p><div className="text-[11px] mt-2" style={{color: dark?'#666':'#8A8A8A'}}>Client: {p.client?.name} • ${p.budget}</div></div></div>
              <div className="mt-4 flex gap-2">
                {p.status==='hired' && <Link to={`/chat/${p._id}`} className="h-[34px] px-5 bg-blue-600 text-white rounded-full text-[12px] font-bold grid place-items-center">💬 Chat with Client</Link>}
                {p.status==='completed' && <button onClick={()=>setReviewModal(p)} className="h-[34px] px-5 bg-yellow-500 text-black rounded-full text-[12px] font-bold">⭐ Rate Client</button>}
                {p.status==='completed' && <span className="h-[34px] px-4 bg-green-600/10 text-green-600 rounded-full text-[12px] font-bold grid place-items-center">✓ Completed</span>}
              </div>
            </div>
          ))}
        </div>
      )}
      {reviewModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] grid place-items-center p-4">
          <div style={{background: dark?'#141414':'#fff', borderColor: dark?'#2A2A2A':'#E8E6E1'}} className="w-full max-w-[400px] border rounded-[20px] p-6">
            <h3 style={{color: dark?'#fff':'#000'}} className="font-bold text-[18px]">Rate {reviewModal.client?.name}</h3>
            <div className="flex gap-2 mt-5 justify-center">{[1,2,3,4,5].map(n=><button key={n} onClick={()=>setRating(n)} className={`w-10 h-10 rounded-full text-[20px] ${n<=rating ? 'bg-yellow-500 text-black' : 'bg-[#F5F3EF] dark:bg-[#0A0A0A] border'}`}>★</button>)}</div>
            <textarea value={comment} onChange={e=>setComment(e.target.value)} placeholder="Write experience..." style={{background: dark?'#0A0A0A':'#FBFBF9', borderColor: dark?'#2A2A2A':'#E8E6E1', color: dark?'#fff':'#000'}} className="w-full mt-5 min-h-[80px] p-3 border rounded-[12px] text-[13px]"></textarea>
            <div className="flex gap-2 mt-4"><button onClick={()=>setReviewModal(null)} className="flex-1 h-[44px] border rounded-[12px] text-[13px] font-bold">Cancel</button><button onClick={submitReview} className="flex-1 h-[44px] bg-yellow-500 text-black rounded-[12px] text-[13px] font-bold">Submit ⭐ {rating}</button></div>
          </div>
        </div>
      )}
    </div>
  )
}