import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import ExpenseList from './ExpenseList';
import AddExpense from './AddExpense';

function App() {
  return (
    <Router>
      <div>
        {/* Navigation Bar */}
        <nav style={styles.navbar}>
          <ul style={styles.navList}>
            <li><Link to="/login" style={styles.navLink}>Login</Link></li>
            <li><Link to="/signup" style={styles.navLink}>Sign Up</Link></li>
            <li><Link to="/expenses" style={styles.navLink}>Expense List</Link></li>
            <li><Link to="/add-expense" style={styles.navLink}>Add Expense</Link></li>
          </ul>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/expenses" element={<ExpenseList />} />
          <Route path="/add-expense" element={<AddExpense />} />
        </Routes>
      </div>
    </Router>
  );
}

// Basic styles for the app
const styles = {
  navbar: {
    backgroundColor: '#333',
    padding: '10px',
  },
  navList: {
    listStyleType: 'none',
    display: 'flex',
    justifyContent: 'center',
    margin: '0',
    padding: '0',
  },
  navLink: {
    color: '#fff',
    textDecoration: 'none',
    padding: '10px 15px',
    margin: '0 10px',
    borderRadius: '5px',
    fontSize: '16px',
  },
};

export default App;
