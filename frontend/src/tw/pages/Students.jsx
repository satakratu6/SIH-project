import React, { useEffect, useState } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function Students() {
  const [sections, setSections] = useState([])
  const [sectionId, setSectionId] = useState('')
  const [rows, setRows] = useState([])

  useEffect(()=>{
    (async()=>{
      const token = localStorage.getItem('token')
      const s = await axios.get(`${API_URL}/teacher/sections`, { headers: { Authorization: `Bearer ${token}` } })
      setSections(s.data.sections||[])
      if (s.data.sections?.length) setSectionId(s.data.sections[0]._id)
    })()
  },[])

  useEffect(()=>{
    if (!sectionId) return
    (async()=>{
      const token = localStorage.getItem('token')
      const r = await axios.get(`${API_URL}/teacher/students`, { headers: { Authorization: `Bearer ${token}` }, params: { classSectionId: sectionId } })
      setRows(r.data.students||[])
    })()
  }, [sectionId])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <select className="px-3 py-2 rounded-xl border" value={sectionId} onChange={e=>setSectionId(e.target.value)}>
          {sections.map(sec => <option key={sec._id} value={sec._id}>{sec.className} - {sec.sectionName}</option>)}
        </select>
        <input placeholder="Search" className="px-3 py-2 rounded-xl border" />
      </div>
      <div className="rounded-2xl shadow-card overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Roll No</th>
              <th className="px-4 py-2">Class/Section</th>
              <th className="px-4 py-2">Student ID</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r._id} className="border-t">
                <td className="px-4 py-2">{r.name}</td>
                <td className="px-4 py-2">{r.rollNumber}</td>
                <td className="px-4 py-2">—</td>
                <td className="px-4 py-2">{r.studentId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


