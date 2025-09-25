import React, { useEffect, useState } from 'react'
import { Container, Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody, FormControl, InputLabel, Select, MenuItem, Stack } from '@mui/material'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function StudentsPage() {
  const [rows, setRows] = useState([])
  const [sections, setSections] = useState([])
  const [sectionId, setSectionId] = useState(localStorage.getItem('classSectionId') || '')

  useEffect(() => {
    async function loadSections() {
      try {
        const token = localStorage.getItem('token')
        const res = await axios.get(`${API_URL}/teacher/sections`, { headers: { Authorization: `Bearer ${token}` } })
        const secs = res.data.sections || []
        setSections(secs)
        if (!sectionId && secs.length) {
          setSectionId(secs[0]._id)
          localStorage.setItem('classSectionId', secs[0]._id)
        }
      } catch (e) {
        console.error('Failed to load sections', e?.response?.data || e?.message)
      }
    }
    loadSections()
  }, [])

  useEffect(() => {
    if (!sectionId) return
    async function loadStudents() {
      try {
        const token = localStorage.getItem('token')
        const res = await axios.get(`${API_URL}/teacher/students`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { classSectionId: sectionId }
        })
        setRows(res.data.students || [])
      } catch (e) {
        console.error('Failed to load students', e?.response?.data || e?.message)
      }
    }
    loadStudents()
  }, [sectionId])

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>Students</Typography>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <FormControl size="small" sx={{ minWidth: 240 }} fullWidth>
            <InputLabel id="section-label">Section</InputLabel>
            <Select labelId="section-label" label="Section" value={sectionId} onChange={(e)=>{
              setSectionId(e.target.value)
              localStorage.setItem('classSectionId', e.target.value)
            }} onOpen={() => { if (!sections.length) { /* retry on open */ } }}>
              {!sections.length && (
                <MenuItem value="" disabled>(No sections available)</MenuItem>
              )}
              {sections.map((sec)=> (
                <MenuItem key={sec._id} value={sec._id}>{sec.className} - {sec.sectionName}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Student ID</TableCell>
              <TableCell>Roll No</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((s) => (
              <TableRow key={s._id}>
                <TableCell>{s.name}</TableCell>
                <TableCell>{s.studentId}</TableCell>
                <TableCell>{s.rollNumber}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  )
}



