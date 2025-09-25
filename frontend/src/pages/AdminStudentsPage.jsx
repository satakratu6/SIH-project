import React, { useEffect, useState } from 'react'
import { Container, Paper, Typography, Stack, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Snackbar, Alert } from '@mui/material'
import { Delete } from '@mui/icons-material'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function AdminStudentsPage() {
  const [classSectionId, setClassSectionId] = useState('')
  const [rows, setRows] = useState([])
  const [form, setForm] = useState({ studentId: '', name: '', rollNumber: '', interest: '', skillLevel: '', goals: '' })
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  async function load() {
    try {
      setError('')
      const token = localStorage.getItem('token')
      const res = await axios.get(`${API_URL}/admin/students`, { headers: { Authorization: `Bearer ${token}` }, params: { classSectionId } })
      setRows(res.data.students || [])
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load students')
    }
  }

  useEffect(() => { if (classSectionId) load() }, [classSectionId])

  async function add() {
    try {
      setError('')
      const token = localStorage.getItem('token')
      await axios.post(`${API_URL}/admin/students`, { classSectionId, ...form }, { headers: { Authorization: `Bearer ${token}` } })
      setForm({ studentId: '', name: '', rollNumber: '', interest: '', skillLevel: '', goals: '' })
      setNotice('Student added')
      await load()
    } catch (e) {
      setError(e?.response?.data?.message || 'Add failed')
    }
  }

  async function remove(id) {
    try {
      setError('')
      const token = localStorage.getItem('token')
      await axios.delete(`${API_URL}/admin/students/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      setNotice('Student removed')
      await load()
    } catch (e) {
      setError(e?.response?.data?.message || 'Delete failed')
    }
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Students</Typography>
        <Stack direction="row" spacing={2} sx={{ mt: 2, flexWrap: 'wrap' }}>
          <TextField label="ClassSection ID" value={classSectionId} onChange={(e)=>setClassSectionId(e.target.value)} />
        </Stack>
        <Stack direction="row" spacing={2} sx={{ mt: 2, flexWrap: 'wrap' }}>
          <TextField label="Student ID" value={form.studentId} onChange={(e)=>setForm((f)=>({ ...f, studentId: e.target.value }))} />
          <TextField label="Name" value={form.name} onChange={(e)=>setForm((f)=>({ ...f, name: e.target.value }))} />
          <TextField label="Roll" value={form.rollNumber} onChange={(e)=>setForm((f)=>({ ...f, rollNumber: e.target.value }))} />
          <TextField label="Interest" value={form.interest} onChange={(e)=>setForm((f)=>({ ...f, interest: e.target.value }))} />
          <TextField label="Skill Level" value={form.skillLevel} onChange={(e)=>setForm((f)=>({ ...f, skillLevel: e.target.value }))} />
          <TextField label="Goals" value={form.goals} onChange={(e)=>setForm((f)=>({ ...f, goals: e.target.value }))} />
          <Button variant="contained" onClick={add} disabled={!classSectionId || !form.studentId || !form.name}>Add</Button>
        </Stack>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        <Table size="small" sx={{ mt: 3 }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Student ID</TableCell>
              <TableCell>Roll</TableCell>
              <TableCell>Interest</TableCell>
              <TableCell>Skill</TableCell>
              <TableCell>Goals</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((s) => (
              <TableRow key={s._id}>
                <TableCell>{s.name}</TableCell>
                <TableCell>{s.studentId}</TableCell>
                <TableCell>{s.rollNumber}</TableCell>
                <TableCell>{s.interest || '-'}</TableCell>
                <TableCell>{s.skillLevel ?? 0}</TableCell>
                <TableCell>{s.goals || '-'}</TableCell>
                <TableCell align="right"><IconButton color="error" onClick={()=>remove(s._id)}><Delete /></IconButton></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <Snackbar open={!!notice} autoHideDuration={2000} onClose={()=>setNotice('')} message={notice} />
    </Container>
  )
}



