import React, { useEffect, useState } from 'react'
import { Container, Paper, Typography, Stack, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, Snackbar, LinearProgress } from '@mui/material'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function AdminAttendancePage() {
  const [classSectionId, setClassSectionId] = useState('')
  const [studentId, setStudentId] = useState('')
  const [date, setDate] = useState('')
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [notice, setNotice] = useState('')

  async function load() {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${API_URL}/admin/attendance`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { classSectionId, studentId, date }
      })
      setRows(res.data.items || [])
      setNotice(`Loaded ${res.data.items?.length || 0} rows`)
    } finally {
      setLoading(false)
    }
  }

  async function exportCsv() {
    const token = localStorage.getItem('token')
    const res = await axios.get(`${API_URL}/admin/attendance`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { classSectionId, studentId, date, format: 'csv' },
      responseType: 'blob'
    })
    const url = window.URL.createObjectURL(new Blob([res.data]))
    const a = document.createElement('a')
    a.href = url
    a.download = 'attendance.csv'
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Attendance Reports</Typography>
        {loading && <LinearProgress sx={{ mt: 2 }} />}
        <Stack direction="row" spacing={2} sx={{ mt: 2, flexWrap: 'wrap' }}>
          <TextField label="ClassSection ID" value={classSectionId} onChange={(e)=>setClassSectionId(e.target.value)} />
          <TextField label="Student ID" value={studentId} onChange={(e)=>setStudentId(e.target.value)} />
          <TextField type="date" label="Date" InputLabelProps={{ shrink: true }} value={date} onChange={(e)=>setDate(e.target.value)} />
          <Button variant="contained" onClick={load}>Filter</Button>
          <Button variant="outlined" onClick={exportCsv}>Export CSV</Button>
        </Stack>
        <Table size="small" sx={{ mt: 3 }}>
          <TableHead>
            <TableRow>
              <TableCell>Student ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Roll</TableCell>
              <TableCell>ClassSection</TableCell>
              <TableCell>Scanned At</TableCell>
              <TableCell>Device</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r, idx) => (
              <TableRow key={idx}>
                <TableCell>{r.studentId}</TableCell>
                <TableCell>{r.studentName}</TableCell>
                <TableCell>{r.rollNumber}</TableCell>
                <TableCell>{r.classSection}</TableCell>
                <TableCell>{new Date(r.scannedAt).toLocaleString()}</TableCell>
                <TableCell>{r.deviceId}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <Snackbar open={!!notice} autoHideDuration={2000} onClose={()=>setNotice('')} message={notice} />
    </Container>
  )
}



