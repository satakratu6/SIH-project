import React, { useEffect, useState } from 'react'
import { Container, Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody, Select, MenuItem, TextField, Button, Snackbar } from '@mui/material'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function AdminComplaintsPage() {
  const [rows, setRows] = useState([])
  const [edit, setEdit] = useState({})
  const [notice, setNotice] = useState('')

  async function load() {
    const token = localStorage.getItem('token')
    const res = await axios.get(`${API_URL}/admin/complaints`, { headers: { Authorization: `Bearer ${token}` } })
    setRows(res.data.items || [])
  }

  useEffect(() => { load() }, [])

  async function update(id) {
    const token = localStorage.getItem('token')
    const payload = { status: edit[id]?.status || 'pending', adminComment: edit[id]?.adminComment || '' }
    await axios.put(`${API_URL}/admin/complaints/${id}`, payload, { headers: { Authorization: `Bearer ${token}` } })
    setNotice('Updated complaint')
    await load()
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Complaints</Typography>
        <Table size="small" sx={{ mt: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell>Teacher</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Admin Comment</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r._id}>
                <TableCell>{r.teacher?.name}</TableCell>
                <TableCell>{r.message}</TableCell>
                <TableCell>
                  <Select size="small" value={edit[r._id]?.status ?? r.status} onChange={(e)=>setEdit((m)=>({ ...m, [r._id]: { ...(m[r._id]||{}), status: e.target.value } }))}>
                    <MenuItem value="pending">pending</MenuItem>
                    <MenuItem value="resolved">resolved</MenuItem>
                    <MenuItem value="dismissed">dismissed</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <TextField size="small" value={edit[r._id]?.adminComment ?? (r.adminComment || '')} onChange={(e)=>setEdit((m)=>({ ...m, [r._id]: { ...(m[r._id]||{}), adminComment: e.target.value } }))} />
                </TableCell>
                <TableCell><Button size="small" variant="contained" onClick={()=>update(r._id)}>Save</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <Snackbar open={!!notice} autoHideDuration={2000} onClose={()=>setNotice('')} message={notice} />
    </Container>
  )
}



