import React from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'

const nav = [
  { to: '/tw/dashboard', label: 'Dashboard', icon: '🏠' },
  { to: '/tw/attendance', label: 'Attendance', icon: '🧾' },
  { to: '/tw/students', label: 'Students', icon: '👥' },
  { to: '/tw/timetable', label: 'Timetable', icon: '📅' },
  { to: '/tw/leave', label: 'Leave Requests', icon: '📝' },
  { to: '/tw/settings', label: 'Settings', icon: '⚙️' }
]

export default function Layout() {
  const navigate = useNavigate()
  const user = React.useMemo(()=>{
    try { return JSON.parse(localStorage.getItem('user')||'{}') } catch { return {} }
  },[])

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <div className="flex">
        <aside className="hidden md:block w-64 shrink-0 border-r border-gray-100 bg-white">
          <div className="p-6 text-xl font-semibold text-black">Teacher Panel</div>
          <nav className="px-2 space-y-1">
            {nav.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({isActive})=>
                  `flex items-center gap-3 px-3 py-2 rounded-2xl hover:bg-gray-50 ` +
                  (isActive
                    ? 'bg-black text-white font-bold shadow'
                    : 'text-black')
                }
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>
        <div className="flex-1">
          <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-100">
            <div className="flex items-center justify-between px-4 md:px-6 h-14">
              <button className="md:hidden px-3 py-1 rounded-lg border">Menu</button>
              <div className="font-semibold">Hello, {user?.name || 'Teacher'} 👋</div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  {(user?.name||'T').slice(0,1)}
                </div>
                <button onClick={logout} className="px-3 py-1.5 rounded-xl bg-black text-white hover:opacity-90 font-bold">Logout</button>
              </div>
            </div>
          </header>
          <main className="p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}


