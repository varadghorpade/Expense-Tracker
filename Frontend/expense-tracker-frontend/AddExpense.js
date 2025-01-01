import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook for navigation

const AddExpense = () => {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [comments, setComments] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate(); // Initialize navigate

  const handleAddExpense = async (e) => {
    e.preventDefault();

    // Validate input
    if (!category || !amount) {
      setError('Category and Amount are required');
      return;
    }

    try {
      // Send POST request to backend to add expense
      const response = await axios.post(
        'http://localhost:5000/expenses', 
        {
          category,
          amount,
          comments,
        },
        {
          // No Authorization header needed when using sessions on the backend
          withCredentials: true,  // Make sure cookies (session) are sent with the request
        }
      );
      
      setSuccess('Expense added successfully!');
      setCategory('');
      setAmount('');
      setComments('');

      // Redirect to Expense List page after 1.5 seconds
      setTimeout(() => {
        navigate('/expenses');
      }, 150);

    } catch (err) {
      setError('Failed to add expense. Please try again.');
    }
  };

  return (
    <div>
      <h2>Add Expense</h2>
      {error && <div>{error}</div>}
      {success && <div>{success}</div>}
      <form onSubmit={handleAddExpense}>
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Comments"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />
        <button type="submit">Add Expense</button>
      </form>
    </div>
  );
};

export default AddExpense;
