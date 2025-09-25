import React, { useEffect, useState } from 'react'
import { Container, Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody, Button, Stack, Snackbar, Alert, TextField } from '@mui/material'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function AdminTeachersPage() {
  const [rows, setRows] = useState([])
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  async function load() {
    try {
      setError('')
      const token = localStorage.getItem('token')
      const res = await axios.get(`${API_URL}/admin/teachers`, { headers: { Authorization: `Bearer ${token}` } })
      setRows(res.data.teachers || [])
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load teachers')
    }
  }

  useEffect(() => { load() }, [])

  async function add() {
    try {
      setError('')
      const token = localStorage.getItem('token')
      await axios.post(`${API_URL}/admin/teachers`, form, { headers: { Authorization: `Bearer ${token}` } })
      setForm({ name: '', email: '', password: '' })
      setNotice('Teacher added')
      await load()
    } catch (e) {
      setError(e?.response?.data?.message || 'Add failed')
    }
  }

  async function remove(id) {
    try {
      setError('')
      const token = localStorage.getItem('token')
      await axios.delete(`${API_URL}/admin/teachers/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      setNotice('Teacher removed')
      await load()
    } catch (e) {
      setError(e?.response?.data?.message || 'Remove failed')
    }
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Teachers Data</Typography>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <TextField label="Name" value={form.name} onChange={e=>setForm(f=>({...f, name: e.target.value}))} size="small" />
          <TextField label="Email" value={form.email} onChange={e=>setForm(f=>({...f, email: e.target.value}))} size="small" />
          <TextField label="Password" value={form.password} onChange={e=>setForm(f=>({...f, password: e.target.value}))} size="small" type="password" />
          <Button variant="contained" onClick={add}>Add Teacher</Button>
        </Stack>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row._id}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>
                  <Button size="small" color="error" onClick={() => remove(row._id)}>Remove</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Snackbar open={!!notice} autoHideDuration={2000} onClose={()=>setNotice('')}><Alert severity="success">{notice}</Alert></Snackbar>
        {error && <Alert severity="error" sx={{mt:2}}>{error}</Alert>}
      </Paper>
    </Container>
  )
}
