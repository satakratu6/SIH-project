import React, { useEffect, useState } from 'react'
import { Container, Paper, Typography, TextField, Button, Stack, List, ListItem, ListItemText } from '@mui/material'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function LeaveRequestsPage() {
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [reason, setReason] = useState('')
  const [items, setItems] = useState([])

  async function load() {
    const token = localStorage.getItem('token')
    const res = await axios.get(`${API_URL}/teacher/leave`, { headers: { Authorization: `Bearer ${token}` } })
    setItems(res.data.items || [])
  }

  useEffect(() => { load() }, [])

  async function submitLeave() {
    const token = localStorage.getItem('token')
    await axios.post(`${API_URL}/teacher/leave`, { fromDate, toDate, reason }, { headers: { Authorization: `Bearer ${token}` } })
    setFromDate(''); setToDate(''); setReason('')
    await load()
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Leave Requests</Typography>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <TextField type="date" label="From" InputLabelProps={{ shrink: true }} value={fromDate} onChange={(e)=>setFromDate(e.target.value)} />
          <TextField type="date" label="To" InputLabelProps={{ shrink: true }} value={toDate} onChange={(e)=>setToDate(e.target.value)} />
          <TextField label="Reason" value={reason} onChange={(e)=>setReason(e.target.value)} />
          <Button variant="contained" onClick={submitLeave}>Submit</Button>
        </Stack>
        <List sx={{ mt: 3 }}>
          {items.map((it) => (
            <ListItem key={it._id} divider>
              <ListItemText primary={`${new Date(it.fromDate).toLocaleDateString()} → ${new Date(it.toDate).toLocaleDateString()}`} secondary={`${it.reason} — ${it.status}`} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  )
}



