import React, { useEffect, useState } from 'react'
import { Container, Paper, Typography, Grid, Card, CardContent, Button, Stack, Box, Avatar } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totals: {}, pending: {}, today: {} })
  const navigate = useNavigate()

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${API_URL}/admin/me`, { headers: { Authorization: `Bearer ${token}` } })
      setStats(res.data || {})
    }
    load()
  }, [])

  function StatCard({ title, value }) {
    return (
      <Card sx={{ borderRadius: 3, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', p: 1 }}>
        <CardContent>
          <Typography variant="subtitle2" sx={{ color: '#6b7280', fontWeight: 500 }}>{title}</Typography>
          <Typography variant="h3" sx={{ fontWeight: 700, mt: 1, color: '#222' }}>{value ?? '-'}</Typography>
        </CardContent>
      </Card>
    )
  }

  // Get admin name/initial for avatar
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const name = user.name || 'Admin'
  const initial = name[0]?.toUpperCase() || 'A'

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Stack spacing={4}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Admin Dashboard</Typography>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar sx={{ bgcolor: '#1976d2', width: 40, height: 40, fontWeight: 700 }}>{initial}</Avatar>
            <Button
              variant="contained"
              color="primary"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{ borderRadius: 2, fontWeight: 700, px: 3, boxShadow: '0 2px 8px rgba(25,118,210,0.08)' }}
            >
              Logout
            </Button>
          </Stack>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}><StatCard title="Teachers" value={stats.totals?.teachers} /></Grid>
          <Grid item xs={12} sm={6} md={3}><StatCard title="Admins" value={stats.totals?.admins} /></Grid>
          <Grid item xs={12} sm={6} md={3}><StatCard title="Classes" value={stats.totals?.classes} /></Grid>
          <Grid item xs={12} sm={6} md={3}><StatCard title="Students" value={stats.totals?.students} /></Grid>
          <Grid item xs={12} sm={6} md={3}><StatCard title="Pending Leaves" value={stats.pending?.leaves} /></Grid>
          <Grid item xs={12} sm={6} md={3}><StatCard title="Pending Complaints" value={stats.pending?.complaints} /></Grid>
          <Grid item xs={12} sm={6} md={3}><StatCard title="Today Scans" value={stats.today?.attendanceScans} /></Grid>
        </Grid>

        {/* Quick Actions */}
        <Paper sx={{ p: 4, background: '#fff', borderRadius: 3, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#222' }}>Quick Actions</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Button fullWidth variant="contained" color="primary" size="large" sx={{ py: 2, fontWeight: 700, borderRadius: 2, boxShadow: '0 2px 8px rgba(25,118,210,0.08)' }} onClick={()=>navigate('/admin/classes')}>
                Manage Classes & Sections
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button fullWidth variant="outlined" color="primary" size="large" sx={{ py: 2, fontWeight: 700, borderRadius: 2, boxShadow: '0 2px 8px rgba(25,118,210,0.04)' }} onClick={()=>navigate('/admin/timetable')}>
                Generate Timetables
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button fullWidth variant="outlined" color="primary" size="large" sx={{ py: 2, fontWeight: 700, borderRadius: 2, boxShadow: '0 2px 8px rgba(25,118,210,0.04)' }} onClick={()=>navigate('/admin/show-students')}>
                Show Students Data
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button fullWidth variant="outlined" color="primary" size="large" sx={{ py: 2, fontWeight: 700, borderRadius: 2, boxShadow: '0 2px 8px rgba(25,118,210,0.04)' }} onClick={()=>navigate('/admin/teachers')}>
                Teachers Data
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button fullWidth variant="outlined" color="primary" size="large" sx={{ py: 2, fontWeight: 700, borderRadius: 2, boxShadow: '0 2px 8px rgba(25,118,210,0.04)' }} onClick={()=>navigate('/admin/attendance')}>
                Attendance Reports
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button fullWidth variant="outlined" color="primary" size="large" sx={{ py: 2, fontWeight: 700, borderRadius: 2, boxShadow: '0 2px 8px rgba(25,118,210,0.04)' }} onClick={()=>navigate('/admin/complaints')}>
                Complaints
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button fullWidth variant="outlined" color="primary" size="large" sx={{ py: 2, fontWeight: 700, borderRadius: 2, boxShadow: '0 2px 8px rgba(25,118,210,0.04)' }} onClick={()=>navigate('/admin/leave')}>
                Leave Requests
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Stack>
    </Container>
  )
}


