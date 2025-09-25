import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from './theme.js'
import AdminDashboard from './pages/AdminDashboard.jsx'
import AdminStudentsPage from './pages/AdminStudentsPage.jsx'
import AdminImportPage from './pages/AdminImportPage.jsx'
import AdminAttendancePage from './pages/AdminAttendancePage.jsx'
import AdminComplaintsPage from './pages/AdminComplaintsPage.jsx'
import AdminLeavePage from './pages/AdminLeavePage.jsx'
import AdminTimetablePage from './pages/AdminTimetablePage.jsx'
import AdminShowStudentsPage from './pages/AdminShowStudentsPage.jsx'
import AdminTeachersPage from './pages/AdminTeachersPage.jsx'
import TwLayout from './tw/Layout.jsx'
import TwLogin from './tw/pages/Login.jsx'
import TwDashboard from './tw/pages/Dashboard.jsx'
import TwAttendance from './tw/pages/Attendance.jsx'
import TwStudents from './tw/pages/Students.jsx'
import TwLeave from './tw/pages/Leave.jsx'
import TwTimetable from './tw/pages/Timetable.jsx'


function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/login" element={<TwLogin />} />
  <Route path="/admin" element={<AdminDashboard />} />
  <Route path="/admin/classes" element={<AdminStudentsPage />} />
  <Route path="/admin/import" element={<AdminImportPage />} />
  <Route path="/admin/attendance" element={<AdminAttendancePage />} />
  <Route path="/admin/complaints" element={<AdminComplaintsPage />} />
  <Route path="/admin/leave" element={<AdminLeavePage />} />
  <Route path="/admin/timetable" element={<AdminTimetablePage />} />
  <Route path="/admin/show-students" element={<AdminShowStudentsPage />} />
  <Route path="/admin/teachers" element={<AdminTeachersPage />} />
        {/* Teacher routes under /teacher, using TwLayout and tw/pages */}
        <Route path="/teacher" element={<TwLayout />}>
          <Route index element={<TwDashboard />} />
          <Route path="attendance" element={<TwAttendance />} />
          <Route path="students" element={<TwStudents />} />
          <Route path="leave" element={<TwLeave />} />
          <Route path="timetable" element={<TwTimetable />} />
        </Route>
        {/* Keep /tw/* routes for legacy or other users if needed */}
        <Route element={<TwLayout />}>
          <Route path="/tw/dashboard" element={<TwDashboard />} />
          <Route path="/tw/attendance" element={<TwAttendance />} />
          <Route path="/tw/students" element={<TwStudents />} />
          <Route path="/tw/leave" element={<TwLeave />} />
          <Route path="/tw/timetable" element={<TwTimetable />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App


