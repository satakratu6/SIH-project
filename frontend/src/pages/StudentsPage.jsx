import React, { useEffect, useState } from 'react'
import { Container, Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function StudentsPage() {
  const [rows, setRows] = useState([])

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem('token')
      const classSectionId = localStorage.getItem('classSectionId')
      const res = await axios.get(`${API_URL}/teacher/students`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { classSectionId }
      })
      setRows(res.data.students || [])
    }
    load()
  }, [])

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>Students</Typography>
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



