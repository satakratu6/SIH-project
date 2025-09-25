import React, { useEffect, useState } from 'react'
import { Container, Paper, Typography, Grid, TextField, Button } from '@mui/material'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const days = ['Mon','Tue','Wed','Thu','Fri','Sat']

export default function TimetablePage() {
  const [entries, setEntries] = useState([])

  async function load() {
    const token = localStorage.getItem('token')
    const res = await axios.get(`${API_URL}/teacher/timetable`, { headers: { Authorization: `Bearer ${token}` } })
    setEntries(res.data.timetable?.entries || [])
  }

  useEffect(() => { load() }, [])

  function addRow() {
    setEntries((e) => [...e, { day: 'Mon', subject: '', timeFrom: '', timeTo: '', period: '', room: '' }])
  }

  async function save() {
    const token = localStorage.getItem('token')
    await axios.post(`${API_URL}/teacher/timetable`, { entries }, { headers: { Authorization: `Bearer ${token}` } })
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Timetable</Typography>
        <Button variant="outlined" sx={{ mt: 2, mb: 2 }} onClick={addRow}>Add Row</Button>
        {entries.map((row, idx) => (
          <Grid container spacing={2} key={idx} sx={{ mb: 1 }}>
            <Grid item xs={2}>
              <TextField label="Day" select SelectProps={{ native: true }} fullWidth value={row.day} onChange={(e)=>{
                const v = e.target.value; setEntries((arr)=>{ const c=[...arr]; c[idx] = { ...c[idx], day: v }; return c })
              }}>
                {days.map((d)=>(<option key={d} value={d}>{d}</option>))}
              </TextField>
            </Grid>
            <Grid item xs={3}><TextField label="Subject" fullWidth value={row.subject} onChange={(e)=>{
              const v = e.target.value; setEntries((arr)=>{ const c=[...arr]; c[idx] = { ...c[idx], subject: v }; return c })
            }} /></Grid>
            <Grid item xs={2}><TextField label="From" fullWidth value={row.timeFrom} onChange={(e)=>{
              const v = e.target.value; setEntries((arr)=>{ const c=[...arr]; c[idx] = { ...c[idx], timeFrom: v }; return c })
            }} /></Grid>
            <Grid item xs={2}><TextField label="To" fullWidth value={row.timeTo} onChange={(e)=>{
              const v = e.target.value; setEntries((arr)=>{ const c=[...arr]; c[idx] = { ...c[idx], timeTo: v }; return c })
            }} /></Grid>
            <Grid item xs={1}><TextField label="Period" fullWidth value={row.period} onChange={(e)=>{
              const v = e.target.value; setEntries((arr)=>{ const c=[...arr]; c[idx] = { ...c[idx], period: v }; return c })
            }} /></Grid>
            <Grid item xs={2}><TextField label="Room" fullWidth value={row.room} onChange={(e)=>{
              const v = e.target.value; setEntries((arr)=>{ const c=[...arr]; c[idx] = { ...c[idx], room: v }; return c })
            }} /></Grid>
          </Grid>
        ))}
        <Button variant="contained" onClick={save}>Save</Button>
      </Paper>
    </Container>
  )
}



