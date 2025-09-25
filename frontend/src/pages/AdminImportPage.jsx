import React, { useState } from 'react'
import { Container, Paper, Typography, Button, Stack, Alert, Snackbar, LinearProgress, Divider, TextField } from '@mui/material'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function AdminImportPage() {
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [allocFile, setAllocFile] = useState(null)
  const [allocSeed, setAllocSeed] = useState('123')
  const [allocMax, setAllocMax] = useState('50')
  const [allocLoading, setAllocLoading] = useState(false)
  const [allocError, setAllocError] = useState('')

  async function upload() {
    try {
      setError('')
      setResult(null)
      setSuccess('')
      if (!file) { setError('Please select a file'); return }
      const validExt = ['.xlsx', '.xls', '.csv']
      const name = file.name?.toLowerCase() || ''
      const extOk = validExt.some((ext)=>name.endsWith(ext))
      if (!extOk) { setError('Invalid file type. Use .xlsx, .xls, or .csv'); return }
      const maxBytes = 5 * 1024 * 1024
      if (file.size > maxBytes) { setError('File too large. Max 5MB'); return }
      setLoading(true)
      const token = localStorage.getItem('token')
      const form = new FormData()
      form.append('file', file)
      const res = await axios.post(`${API_URL}/admin/students/import`, form, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      })
      setResult(res.data)
      setSuccess('Import completed successfully')
    } catch (e) {
      setError(e?.response?.data?.message || 'Upload failed')
    }
    finally {
      setLoading(false)
    }
  }

  async function allocate() {
    try {
      setAllocError('')
      if (!allocFile) { setAllocError('Please select an XLSX file'); return }
      const name = allocFile.name?.toLowerCase() || ''
      if (!name.endsWith('.xlsx') && !name.endsWith('.xls')) { setAllocError('Invalid file type. Use .xlsx or .xls'); return }
      setAllocLoading(true)
      const token = localStorage.getItem('token')
      const form = new FormData()
      form.append('file', allocFile)
      form.append('seed', allocSeed || '123')
      form.append('maxPerSection', allocMax || '50')
      const res = await axios.post(`${API_URL}/admin/students/allocate`, form, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement('a')
      a.href = url
      a.download = 'sections.xlsx'
      document.body.appendChild(a)
      a.click()
      a.remove()
      setSuccess('Sections allocated and downloaded')
    } catch (e) {
      setAllocError(e?.response?.data?.message || 'Allocation failed')
    } finally {
      setAllocLoading(false)
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Bulk Import Students</Typography>
        {loading && <LinearProgress sx={{ mt: 2 }} />}
        <Stack spacing={2} sx={{ mt: 2 }}>
          <input type="file" accept=".xlsx,.xls,.csv" onChange={(e)=>setFile(e.target.files?.[0] || null)} />
          <Button variant="contained" disabled={!file || loading} onClick={upload}>Upload</Button>
          {error && <Alert severity="error">{error}</Alert>}
          {result && (
            <Alert severity="success">
              Inserted: {result.summary?.inserted || 0} • Updated: {result.summary?.updated || 0} • Failed: {result.summary?.failed || 0}
            </Alert>
          )}
        </Stack>
      </Paper>
      <Divider sx={{ my: 3 }} />
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Allocate Sections from XLSX</Typography>
        {allocLoading && <LinearProgress sx={{ mt: 2 }} />}
        <Stack spacing={2} sx={{ mt: 2 }}>
          <input type="file" accept=".xlsx,.xls" onChange={(e)=>setAllocFile(e.target.files?.[0] || null)} />
          <Stack direction="row" spacing={2}>
            <TextField label="Seed" value={allocSeed} onChange={(e)=>setAllocSeed(e.target.value)} sx={{ maxWidth: 200 }} />
            <TextField label="Max per Section" value={allocMax} onChange={(e)=>setAllocMax(e.target.value)} sx={{ maxWidth: 200 }} />
          </Stack>
          <Button variant="contained" disabled={!allocFile || allocLoading} onClick={allocate}>Allocate & Download XLSX</Button>
          {allocError && <Alert severity="error">{allocError}</Alert>}
        </Stack>
      </Paper>
      <Snackbar open={!!success} autoHideDuration={3000} onClose={()=>setSuccess('')} message={success} />
    </Container>
  )
}



