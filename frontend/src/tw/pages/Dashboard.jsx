
import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  // Placeholder stats
  const stats = [
    { label: 'Classes Assigned', value: 3 },
    { label: 'Attendance Today', value: 48 },
    { label: 'Pending Leaves', value: 2 },
  ]
  const quickLinks = [
    { label: 'Attendance', path: '/teacher/attendance' },
    { label: 'Students', path: '/teacher/students' },
    { label: 'Timetable', path: '/teacher/timetable' },
  ]
  const navigate = useNavigate()
  const currentPath = window.location.pathname

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map(stat => (
          <div key={stat.label} className="rounded-2xl shadow-card p-7 bg-white flex flex-col items-start">
            <div className="text-gray-500 text-base font-medium">{stat.label}</div>
            <div className="text-4xl font-bold mt-2">{stat.value}</div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl shadow-card p-7 bg-white">
        <div className="text-lg font-semibold mb-4">Quick Links</div>
        <div className="flex flex-wrap gap-3">
          {quickLinks.map(link => {
            const active = currentPath === link.path
            return (
              <button
                key={link.label}
                onClick={() => navigate(link.path)}
                className={
                  `px-5 py-2 rounded-full border text-base font-semibold transition ` +
                  (active
                    ? 'bg-primary text-white border-primary shadow'
                    : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50')
                }
              >
                {link.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}


