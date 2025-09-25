import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#2563eb' },
    secondary: { main: '#10b981' },
    background: { default: '#f7f9fc', paper: '#ffffff' }
  },
  typography: {
    fontFamily: 'Poppins, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 }
  },
  components: {
    MuiPaper: { styleOverrides: { root: { borderRadius: 14 } } },
    MuiButton: { styleOverrides: { root: { borderRadius: 10, textTransform: 'none', fontWeight: 600 } } },
    MuiListItemButton: { styleOverrides: { root: { borderRadius: 8, marginInline: 8 } } }
  }
})

export default theme


