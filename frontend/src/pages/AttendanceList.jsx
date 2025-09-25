import React, { useEffect, useMemo, useState } from 'react'
import { Paper, Typography, Box, Button } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { io } from 'socket.io-client'

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:5000'

export default function AttendanceList() {
  const [rows, setRows] = useState([])
  const socket = useMemo(() => io(WS_URL, { transports: ['websocket'] }), [])

  useEffect(() => {
    socket.on('attendance-update', (payload) => {
      const added = (payload?.attendees || []).map((s) => ({ id: s.id || s.studentId, studentId: s.studentId, name: s.name, rollNumber: s.rollNumber, timestamp: new Date().toLocaleString() }))
      setRows((prev) => {
        const map = new Map(prev.map(r => [r.studentId, r]))
        for (const a of added) map.set(a.studentId, a)
        return Array.from(map.values())
      })
    })
    return () => { socket.off('attendance-update'); socket.disconnect() }
  }, [socket])

  const columns = [
    { field: 'name', headerName: 'Student Name', flex: 1 },
    { field: 'rollNumber', headerName: 'Roll Number', width: 150 },
    { field: 'studentId', headerName: 'Student ID', width: 150 },
    { field: 'timestamp', headerName: 'Timestamp', width: 220 }
  ]

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Attendance (Live)</Typography>
      <Box sx={{ height: 420 }}>
        <DataGrid rows={rows} columns={columns} density="compact" disableRowSelectionOnClick />
      </Box>
      <Box sx={{ mt: 1 }}>
        <Button variant="outlined" disabled>Export CSV (todo)</Button>
      </Box>
    </Paper>
  )
}


