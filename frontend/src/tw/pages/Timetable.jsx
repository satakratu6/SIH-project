import React, { useEffect, useState } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const days = ['Mon','Tue','Wed','Thu','Fri','Sat']

export default function Timetable() {
  const [entries, setEntries] = useState([])

  useEffect(()=>{
    (async()=>{
      const token = localStorage.getItem('token')
      const res = await axios.get(`${API_URL}/teacher/timetable`, { headers: { Authorization: `Bearer ${token}` } })
      setEntries(res.data.timetable?.entries||[])
    })()
  },[])

  return (
    <div className="space-y-4">
      <div className="rounded-2xl shadow-card p-4 bg-white">
        <div className="text-lg font-semibold mb-3">Weekly Timetable</div>
        <div className="grid grid-cols-6 gap-3">
          {days.map(d => (
            <div key={d} className="rounded-xl border p-3">
              <div className="font-medium mb-2">{d}</div>
              <div className="space-y-2">
                {entries.filter(e=>e.day===d).map((e, idx) => (
                  <div key={idx} className="rounded-xl bg-blue-50 text-blue-800 px-3 py-2">
                    <div className="text-sm font-semibold">{e.subject}</div>
                    <div className="text-xs">{e.timeFrom} - {e.timeTo} · {e.room || '—'}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


