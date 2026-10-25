import { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
const API = import.meta.env.VITE_API_URL || "http://localhost:5000"

export default function ChatPage(){
  const { projectId } = useParams()
  const { user, token, dark } = useAuth()
  const [project, setProject] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMsg, setNewMsg] = useState('')
  const [loading, setLoading] = useState(true)
  const endRef = useRef(null)

  const loadProject = async ()=>{
    const res = await fetch(`${API}/api/projects`); const all = await res.json()
    setProject(all.find(p=>p._id===projectId))
  }
  const loadMessages = async ()=>{
    const res = await fetch(`${API}/api/messages/${projectId}`, {headers:{'x-auth-token':token}})
    if(res.ok) setMessages(await res.json())
    setLoading(false)
  }
  useEffect(()=>{ loadProject(); loadMessages(); const i=setInterval(loadMessages,3000); return()=>clearInterval(i) },[projectId])
  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:'smooth'}) },[messages])

  const send = async ()=>{
    if(!newMsg.trim()) return
    const receiverId = (project.client?._id||project.client)?.toString()===user._id?.toString() ? (project.assignedFreelancer?._id||project.assignedFreelancer) : (project.client?._id||project.client)
    await fetch(`${API}/api/messages/${projectId}`, {method:'POST', headers:{'Content-Type':'application/json','x-auth-token':token}, body: JSON.stringify({text:newMsg, receiverId})})
    setNewMsg(''); loadMessages()
  }

  if(loading) return <div className="p-10 text-center text-[#8A8A8A]">Loading chat...</div>

  return (
    <div className="max-w-[800px] mx-auto px-6 py-8">
      <Link to={user.role==='client'?'/my-projects':'/my-jobs'} className="text-[13px] text-violet-600 font-bold">← Back</Link>
      <div style={{background: dark?'#141414':'#fff', borderColor: dark?'#262626':'#E8E6E1'}} className="mt-4 border rounded-[20px] flex flex-col h-[70vh]">
        <div style={{borderColor: dark?'#1F1F1F':'#E8E6E1'}} className="p-4 border-b flex justify-between"><div><div style={{color: dark?'#fff':'#000'}} className="font-bold text-[15px]">{project?.title}</div><div className="text-[11px] text-[#8A8A8A]">{project?.client?.name} ↔ {project?.assignedFreelancer?.name} • {project?.status}</div></div><div className="text-[11px] px-2 py-1 rounded-full bg-green-600/10 text-green-600 h-fit">Real-time • polling 3s</div></div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length===0 ? <p className="text-center text-[13px] text-[#8A8A8A] mt-10">No messages yet. Say hello! 👋</p> : messages.map(m=><div key={m._id} className={`flex ${(m.sender?._id||m.sender)?.toString()===user._id?.toString()?'justify-end':'justify-start'}`}><div style={{background: (m.sender?._id||m.sender)?.toString()===user._id?.toString() ? '#7C3AED' : (dark?'#0A0A0A':'#F5F3EF'), color: (m.sender?._id||m.sender)?.toString()===user._id?.toString() ? '#fff' : (dark?'#fff':'#000')}} className="max-w-[70%] px-4 py-2.5 rounded-[18px] text-[13px]"><div className="text-[10px] opacity-60 mb-1">{m.sender?.name}</div>{m.text}</div></div>)}
          <div ref={endRef}/>
        </div>
        <div style={{borderColor: dark?'#1F1F1F':'#E8E6E1'}} className="p-3 border-t flex gap-2"><input value={newMsg} onChange={e=>setNewMsg(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Type a message..." style={{background: dark?'#0A0A0A':'#FBFBF9', borderColor: dark?'#2A2A2A':'#E8E6E1', color: dark?'#fff':'#000'}} className="flex-1 h-[44px] px-4 border rounded-[12px] text-[13px]"/><button onClick={send} className="h-[44px] px-6 bg-violet-600 text-white rounded-[12px] text-[13px] font-bold">Send</button></div>
      </div>
    </div>
  )
}