import React, { useState } from 'react'
import { Container, Box, Typography, TextField, Button, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('teacher')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password })
      const { token, user } = res.data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      if (user.role !== role) {
        setError('Selected role does not match your account role')
        return
      }
      if (role === 'teacher') navigate('/teacher')
      if (role === 'admin') navigate('/admin')
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="xs" sx={{ mt: 10 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Teacher Login</Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="role-label">Role</InputLabel>
            <Select labelId="role-label" label="Role" value={role} onChange={(e)=>setRole(e.target.value)}>
              <MenuItem value="teacher">Teacher</MenuItem>
              <MenuItem value="admin">Administrator</MenuItem>
            </Select>
          </FormControl>
          <TextField label="Email" fullWidth margin="normal" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={(e)=>setPassword(e.target.value)} />
          {error && <Typography color="error" variant="body2">{error}</Typography>}
          <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ mt: 2 }}>
            {loading ? 'Signing in...' : 'Login'}
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}



