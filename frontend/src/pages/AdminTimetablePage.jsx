import React, { useState } from 'react'
import { Container, Paper, Typography, Stack, Button, LinearProgress, Alert } from '@mui/material'

export default function AdminTimetablePage() {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function handleFileChange(e) {
    setFile(e.target.files[0])
    setError('')
    setSuccess('')
  }

  function handleUpload() {
    if (!file) { setError('Please select an Excel file'); return }
    setUploading(true)
    // Placeholder: actual upload/logic will be implemented later
    setTimeout(() => {
      setUploading(false)
      setSuccess('File uploaded! (Logic to be implemented)')
    }, 1500)
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">Generate Timetables for Students and Teachers</Typography>
        <Stack spacing={2} mt={2}>
          <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
          <Button variant="contained" onClick={handleUpload} disabled={uploading}>Upload Excel File</Button>
          {uploading && <LinearProgress />}
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
        </Stack>
      </Paper>
    </Container>
  )
}
