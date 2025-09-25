import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import LoginPage from './pages/LoginPage.jsx'
import TeacherDashboard from './pages/TeacherDashboard.jsx'
import StudentsPage from './pages/StudentsPage.jsx'
import LeaveRequestsPage from './pages/LeaveRequestsPage.jsx'
import TimetablePage from './pages/TimetablePage.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'

const theme = createTheme({
  palette: { mode: 'light' }
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/teacher/students" element={<StudentsPage />} />
        <Route path="/teacher/leave" element={<LeaveRequestsPage />} />
        <Route path="/teacher/timetable" element={<TimetablePage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App


