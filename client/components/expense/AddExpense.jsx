// AddExpense.js
import React, { useState } from 'react';

const AddExpense = ({ selectedGroup, onAddExpense }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');

  const handleAddExpense = () => {
    if (amount && description && date) {
      onAddExpense({
        group: selectedGroup._id,
        amount,
        description,
        date,
      });
      setAmount('');
      setDescription('');
      setDate('');
    }
  };

  return (
    <div>
      <h3>Add Expense</h3>
      <label>Amount:</label>
      <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <label>Description:</label>
      <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
      <label>Date:</label>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <button onClick={handleAddExpense}>Add Expense</button>
    </div>
  );
};

export default AddExpense;
