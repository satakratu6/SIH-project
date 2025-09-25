import React, { useEffect, useState } from 'react'
import { Container, Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody, Button, Stack, Snackbar, Alert } from '@mui/material'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function AdminShowStudentsPage() {
  const [rows, setRows] = useState([])
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  async function load() {
    try {
      setError('')
      const token = localStorage.getItem('token')
      const res = await axios.get(`${API_URL}/admin/students`, { headers: { Authorization: `Bearer ${token}` } })
      setRows(res.data.students || [])
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load students')
    }
  }

  useEffect(() => { load() }, [])

  async function remove(id) {
    try {
      setError('')
      const token = localStorage.getItem('token')
      await axios.delete(`${API_URL}/admin/students/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      setNotice('Student removed')
      await load()
    } catch (e) {
      setError(e?.response?.data?.message || 'Remove failed')
    }
  }

  function callGuardian(student) {
    alert(`Call guardian for ${student.name} (logic to be implemented)`)
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Students Data</Typography>
        <Table size="small" sx={{ mt: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Student ID</TableCell>
              <TableCell>Class</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row._id}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.studentId}</TableCell>
                <TableCell>{row.classSection?.className || ''}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button size="small" color="error" onClick={() => remove(row._id)}>Remove</Button>
                    <Button size="small" onClick={() => callGuardian(row)}>Call Guardian</Button>
                  </Stack>
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
