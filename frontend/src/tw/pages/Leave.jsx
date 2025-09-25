import React, { useEffect, useState } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function Leave() {
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [reason, setReason] = useState('')
  const [items, setItems] = useState([])

  async function load() {
    const token = localStorage.getItem('token')
    const res = await axios.get(`${API_URL}/teacher/leave`, { headers: { Authorization: `Bearer ${token}` } })
    setItems(res.data.items||[])
  }

  useEffect(()=>{ load() }, [])

  async function submit() {
    const token = localStorage.getItem('token')
    await axios.post(`${API_URL}/teacher/leave`, { fromDate, toDate, reason }, { headers: { Authorization: `Bearer ${token}` } })
    setFromDate(''); setToDate(''); setReason('')
    load()
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl shadow-card p-6 bg-white">
        <div className="text-lg font-semibold mb-3">Leave Request</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input type="date" className="px-3 py-2 rounded-xl border" value={fromDate} onChange={e=>setFromDate(e.target.value)} />
          <input type="date" className="px-3 py-2 rounded-xl border" value={toDate} onChange={e=>setToDate(e.target.value)} />
          <input placeholder="Reason" className="px-3 py-2 rounded-xl border md:col-span-1" value={reason} onChange={e=>setReason(e.target.value)} />
        </div>
        <button onClick={submit} className="mt-3 px-4 py-2 rounded-xl bg-success text-white">Submit</button>
      </div>

      <div className="rounded-2xl shadow-card overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Reason</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map(it => (
              <tr key={it._id} className="border-t">
                <td className="px-4 py-2">{new Date(it.fromDate).toLocaleDateString()} → {new Date(it.toDate).toLocaleDateString()}</td>
                <td className="px-4 py-2">{it.reason}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded-xl text-xs ${it.status==='approved'?'bg-green-100 text-green-700':it.status==='rejected'?'bg-red-100 text-red-700':'bg-yellow-100 text-yellow-800'}`}>{it.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


