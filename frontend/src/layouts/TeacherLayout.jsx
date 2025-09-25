import React from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Box, CssBaseline, AppBar, Toolbar, Typography, Avatar, IconButton, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material'
import QrCode2Icon from '@mui/icons-material/QrCode2'
import ListAltIcon from '@mui/icons-material/ListAlt'
import EventNoteIcon from '@mui/icons-material/EventNote'
import EventBusyIcon from '@mui/icons-material/EventBusy'
import SchoolIcon from '@mui/icons-material/School'
import ReportProblemIcon from '@mui/icons-material/ReportProblem'
import LogoutIcon from '@mui/icons-material/Logout'

const drawerWidth = 260

const navItems = [
  { label: 'QR Attendance', icon: <QrCode2Icon />, path: '/teacher' },
  { label: 'Attendance List', icon: <ListAltIcon />, path: '/teacher/attendance' },
  { label: 'Timetable', icon: <EventNoteIcon />, path: '/teacher/timetable' },
  { label: 'Leave Application', icon: <EventBusyIcon />, path: '/teacher/leave' },
  { label: 'Student Details', icon: <SchoolIcon />, path: '/teacher/students' },
  { label: 'Complaints', icon: <ReportProblemIcon />, path: '/teacher/complaints' }
]

export default function TeacherLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = React.useMemo(() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}') } catch { return {} }
  }, [])

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Hello, {user?.name || 'Teacher'} 👋</Typography>
          <IconButton color="inherit" onClick={logout} title="Logout"><LogoutIcon /></IconButton>
          <Avatar sx={{ ml: 2 }}>{(user?.name || 'T').slice(0,1)}</Avatar>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" sx={{ width: drawerWidth, [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' } }}>
        <Toolbar />
        <Divider />
        <List>
          {navItems.map((item) => (
            <ListItemButton key={item.path} selected={location.pathname === item.path} onClick={() => navigate(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  )
}


