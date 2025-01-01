import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { AppBar, Toolbar, IconButton, Button, Switch } from '@mui/material';
import { Home, Login as LoginIcon, PersonAdd, List, AddCircle } from '@mui/icons-material';
import Login from './Login';
import Signup from './Signup';
import ExpenseList from './ExpenseList';
import AddExpense from './AddExpense';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: darkMode ? '#90caf9' : '#1976d2',
      },
    },
  });

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div>
          {/* Navigation Bar */}
          <AppBar position="static">
            <Toolbar style={styles.toolbar}>
              <IconButton edge="start" color="inherit" aria-label="home">
                <Home />
              </IconButton>
              <Button color="inherit" startIcon={<LoginIcon />}>
                <Link to="/login" style={styles.navLink}>Login</Link>
              </Button>
              <Button color="inherit" startIcon={<PersonAdd />}>
                <Link to="/signup" style={styles.navLink}>Sign Up</Link>
              </Button>
              <Button color="inherit" startIcon={<List />}>
                <Link to="/expenses" style={styles.navLink}>Expense List</Link>
              </Button>
              <Button color="inherit" startIcon={<AddCircle />}>
                <Link to="/add-expense" style={styles.navLink}>Add Expense</Link>
              </Button>
              <Switch checked={darkMode} onChange={toggleDarkMode} color="default" />
            </Toolbar>
          </AppBar>

          {/* Routes */}
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/expenses" element={<ExpenseList />} />
            <Route path="/add-expense" element={<AddExpense />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

// Basic styles for the app
const styles = {
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navLink: {
    textDecoration: 'none',
    color: 'inherit',
    fontWeight: 'bold',
  },
};

export default App;
