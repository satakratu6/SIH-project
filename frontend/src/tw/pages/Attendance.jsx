import React, { useEffect, useMemo, useState } from 'react'
import QRCode from 'qrcode.react'
import { io } from 'socket.io-client'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:5000'

export default function Attendance() {
  const [sessionId, setSessionId] = useState(null)
  const [token, setToken] = useState('')
  const [expiresIn, setExpiresIn] = useState(0)
  const [rows, setRows] = useState([])
  const socket = useMemo(()=> io(WS_URL, { transports:['websocket'] }), [])

  useEffect(() => {
    if (sessionId) socket.emit('join-session', sessionId)
    socket.on('attendance-token', (p)=>{ setToken(p.token); setExpiresIn(60) })
    socket.on('attendance-update', (p)=>{
      const added = (p?.attendees||[]).map(a=>({ id: a.id || a.studentId, name: a.name, studentId: a.studentId, rollNumber: a.rollNumber, time: new Date().toLocaleTimeString() }))
      setRows(prev => [...added, ...prev.filter(x=>!added.some(y=>y.studentId===x.studentId))])
    })
    return ()=> { socket.off('attendance-token'); socket.off('attendance-update'); socket.disconnect() }
  }, [socket, sessionId])

  useEffect(()=>{
    if (!expiresIn) return
    const t = setInterval(()=> setExpiresIn(s=>s-1), 1000)
    return ()=> clearInterval(t)
  }, [expiresIn])

  async function startSession() {
    const token = localStorage.getItem('token')
    const res = await axios.post(`${API_URL}/teacher/attendance/session/start`, {}, { headers: { Authorization: `Bearer ${token}` } })
    setSessionId(res.data.sessionId)
    setToken(res.data.token)
    setExpiresIn(60)
    socket.emit('join-session', res.data.sessionId)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-xl font-semibold">Attendance Session</div>
        <button onClick={startSession} className="px-4 py-2 rounded-xl bg-primary text-white">Start Session</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl shadow-card p-6 bg-white flex items-center gap-6">
          {token ? <QRCode value={token} size={220} includeMargin /> : <div className="text-secondary">No token yet</div>}
          <div>
            <div className="text-secondary text-sm">Expires in</div>
            <div className="text-4xl font-semibold">{Math.max(0, expiresIn)}s</div>
          </div>
        </div>
        <div className="rounded-2xl shadow-card p-6 bg-white">
          <div className="text-sm text-danger mb-2">{!token ? 'QR not started' : expiresIn<=0 ? 'QR expired, awaiting refresh...' : ''}</div>
          <ul className="divide-y">
            {rows.map(r => (
              <li key={r.id} className="py-2 flex items-center justify-between">
                <div>
                  <div className="font-medium">{r.name || r.studentId}</div>
                  <div className="text-sm text-secondary">{r.rollNumber || '-'} · {r.studentId}</div>
                </div>
                <div className="text-sm">{r.time}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}


