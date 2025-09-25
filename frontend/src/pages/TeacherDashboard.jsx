import React, { useEffect, useMemo, useState } from 'react'
import { Container, Box, Typography, Paper, Grid, Button, Stack } from '@mui/material'
import QRCode from 'qrcode.react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const WS_URL = (import.meta.env.VITE_WS_URL || 'http://localhost:5000')

export default function TeacherDashboard() {
  const [sessionId, setSessionId] = useState(null)
  const [token, setToken] = useState('')
  const [expiresIn, setExpiresIn] = useState(0)
  const [attendees, setAttendees] = useState([])

  const navigate = useNavigate()
  const socket = useMemo(() => io(WS_URL, { transports: ['websocket'] }), [])

  useEffect(() => {
    const t = localStorage.getItem('token')
    if (!t) {
      navigate('/login')
      return
    }
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
      if (!token) { navigate('/login'); return }
      // For now, assume classSectionId is known or hardcoded; UI to select later
      const classSectionId = localStorage.getItem('classSectionId')
      const res = await axios.post(`${API_URL}/teacher/attendance/session/start`, { classSectionId }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSessionId(res.data.sessionId)
      if (res.data.token) {
        setToken(res.data.token)
        setExpiresIn(60)
      }
      socket.emit('join-session', res.data.sessionId)
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to create session')
    }
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }} elevation={4}>
            <Typography variant="h6">QR Attendance</Typography>
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 3 }}>
              {token ? (
                <QRCode value={token} size={220} includeMargin={true} />
              ) : (
                <Typography variant="body2">No token yet</Typography>
              )}
              <Stack>
                <Typography variant="body2">Expires in: {expiresIn}s</Typography>
                <Button variant="contained" sx={{ mt: 2, width: 220 }} onClick={startAttendanceSession}>Start Session</Button>
              </Stack>
            </Box>
            <Paper variant="outlined" sx={{ p: 2, mt: 3, bgcolor: 'background.default' }}>
              <Typography variant="subtitle2" gutterBottom>Instructions</Typography>
              <ul style={{ margin: 0, paddingInlineStart: 18 }}>
                <li>Students must scan the live QR.</li>
                <li>Each QR is valid for 60 seconds only.</li>
                <li>Attendance is logged automatically after scan.</li>
              </ul>
            </Paper>
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


