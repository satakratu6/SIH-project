import React, { useEffect, useMemo, useState } from 'react'
import { Container, Box, Typography, Paper, Grid, Button } from '@mui/material'
import axios from 'axios'
import { io } from 'socket.io-client'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const WS_URL = (import.meta.env.VITE_WS_URL || 'http://localhost:5000')

export default function TeacherDashboard() {
  const [sessionId, setSessionId] = useState(null)
  const [token, setToken] = useState('')
  const [expiresIn, setExpiresIn] = useState(0)
  const [attendees, setAttendees] = useState([])

  const socket = useMemo(() => io(WS_URL, { transports: ['websocket'] }), [])

  useEffect(() => {
    if (sessionId) {
      socket.emit('join-session', sessionId)
    }
    socket.on('attendance-token', (payload) => {
      setToken(payload.token)
      setExpiresIn(60)
    })
    socket.on('attendance-update', (payload) => {
      setAttendees(payload.attendees)
    })
    return () => {
      socket.off('attendance-token')
      socket.off('attendance-update')
      socket.disconnect()
    }
  }, [socket, sessionId])

  useEffect(() => {
    if (expiresIn <= 0) return
    const t = setInterval(() => setExpiresIn((s) => s - 1), 1000)
    return () => clearInterval(t)
  }, [expiresIn])

  async function startAttendanceSession() {
    try {
      const token = localStorage.getItem('token')
      // For now, assume classSectionId is known or hardcoded; UI to select later
      const classSectionId = localStorage.getItem('classSectionId')
      const res = await axios.post(`${API_URL}/teacher/attendance/session/start`, { classSectionId }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSessionId(res.data.sessionId)
      socket.emit('join-session', res.data.sessionId)
    } catch (e) {
      // no-op for stub
    }
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">QR Token</Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="h4" sx={{ wordBreak: 'break-all' }}>{token || '—'}</Typography>
              <Typography variant="body2">Expires in: {expiresIn}s</Typography>
              <Button variant="contained" sx={{ mt: 2 }} onClick={startAttendanceSession}>Start Session</Button>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Live Attendance</Typography>
            <Box sx={{ mt: 2 }}>
              {attendees.length === 0 ? (
                <Typography variant="body2">No attendees yet.</Typography>
              ) : attendees.map((s) => (
                <Box key={s.studentId} sx={{ py: 0.5 }}>
                  <Typography variant="body2">{s.name} ({s.studentId})</Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}


