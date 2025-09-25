import React, { useEffect, useState } from 'react'
import { Paper, Typography, TextField, Button, Stack, List, ListItem, ListItemText, Chip } from '@mui/material'
import ReportProblemIcon from '@mui/icons-material/ReportProblem'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function ComplaintsPage() {
  const [studentId, setStudentId] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [items, setItems] = useState([])

  async function submit() {
    // Backend endpoints for complaints to be added in Admin phase; for now, stub list on client
    const entry = { id: Date.now().toString(), studentId, title, description, status: 'pending' }
    setItems((arr) => [entry, ...arr])
    setStudentId(''); setTitle(''); setDescription('')
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom><ReportProblemIcon sx={{ mr: 1, verticalAlign: 'middle' }} /> Complaints</Typography>
      <Stack spacing={2} sx={{ maxWidth: 560 }}>
        <TextField label="Student ID" value={studentId} onChange={(e)=>setStudentId(e.target.value)} />
        <TextField label="Title" value={title} onChange={(e)=>setTitle(e.target.value)} />
        <TextField label="Description" multiline minRows={3} value={description} onChange={(e)=>setDescription(e.target.value)} />
        <Button variant="contained" onClick={submit}>Submit</Button>
      </Stack>
      <Typography variant="subtitle1" sx={{ mt: 3 }}>Recent</Typography>
      <List>
        {items.map((it)=> (
          <ListItem key={it.id} divider>
            <ListItemText primary={`${it.title} — ${it.studentId}`} secondary={it.description} />
            <Chip label={it.status} color={it.status==='pending'?'warning':it.status==='resolved'?'success':'default'} />
          </ListItem>
        ))}
      </List>
    </Paper>
  )
}


