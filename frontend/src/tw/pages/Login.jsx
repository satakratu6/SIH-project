import React, { useState } from 'react'
import { Container, Box, Typography, TextField, Button, Paper, FormControl, InputLabel, Select, MenuItem, Grid, Checkbox, FormControlLabel, Stack, Link, Divider } from '@mui/material'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('teacher')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [remember, setRemember] = useState(true)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password })
      const { token, user } = res.data
      // For this app we use localStorage; checkbox is decorative for now
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      if (user.role !== role) setError('Role adjusted to your account role')
      if (user.role === 'teacher') navigate('/teacher')
      if (user.role === 'admin') navigate('/admin')
    } catch (err) {
      setError('Incorrect email, username, or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="lg" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Grid container spacing={4} alignItems="stretch">
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: { xs: 2, md: 4 }, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>Smart Curriculum Activity & Attendance</Typography>
              <Typography variant="body2" color="text.secondary">Welcome back. Please sign in to continue.</Typography>
            </Box>
            <Box sx={{
              flex: 1,
              borderRadius: 2,
              p: 3,
              background: 'linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
              minHeight: 260,
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: 1
            }}>
              {Array.from({ length: 12 }).map((_, i) => (
                <Box key={i} sx={{
                  gridColumn: `span ${[1,2,1,2,1,3][i % 6]}`,
                  height: 48 + (i % 3) * 18,
                  borderRadius: 2,
                  background: i % 3 === 0 ? '#000' : '#eaeaea',
                  boxShadow: i % 3 === 0 ? '0 10px 20px rgba(0,0,0,0.2)' : 'inset 0 1px 0 rgba(0,0,0,0.04)'
                }} />
              ))}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: { xs: 2, md: 4 }, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 420 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Log in</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Use your email/username and password to access your dashboard.</Typography>

              <FormControl fullWidth margin="normal">
                <InputLabel id="role-label">Role</InputLabel>
                <Select labelId="role-label" label="Role" value={role} onChange={(e)=>setRole(e.target.value)}>
                  <MenuItem value="teacher">Teacher</MenuItem>
                  <MenuItem value="admin">Administrator</MenuItem>
                </Select>
              </FormControl>

              <TextField label="Email or Username" fullWidth margin="normal" value={email} onChange={(e)=>setEmail(e.target.value)} />
              <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={(e)=>setPassword(e.target.value)} />

              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 1 }}>
                <FormControlLabel control={<Checkbox checked={remember} onChange={(e)=>setRemember(e.target.checked)} />} label="Keep me logged in" />
                <Link href="#" underline="hover">Forgot your password?</Link>
              </Stack>

              {error && <Typography variant="body2" sx={{ color: '#d32f2f', mt: 1 }}>{error}</Typography>}

              <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ mt: 2, py: 1.5, bgcolor: '#000', '&:hover': { bgcolor: '#111' }, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
                {loading ? 'Signing in...' : 'Log In Now'}
              </Button>

              <Divider sx={{ my: 3 }}>or continue with</Divider>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <Button variant="outlined" fullWidth>Google</Button>
                <Button variant="outlined" fullWidth>Twitter</Button>
                <Button variant="outlined" fullWidth>Facebook</Button>
              </Stack>

              <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
                Not a member yet? <Link href="#" underline="hover" sx={{ fontWeight: 700 }}>Register now</Link>
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}