import { useState, useEffect } from 'react';

export const useExpense = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch expenses for a specific group
  const getGroupExpenses = async (groupId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/expense/group/${groupId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
      }
);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
      } else {
        setExpenses(data);
      }
    } catch (error) {
      setError('An error occurred while fetching expenses');
    } finally {
      setLoading(false);
    }
  };

  // Add a new expense to the group
  const addExpense = async (group, amount, description, date) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/expense/addExpense', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ group, amount, description, date }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
      } else {
        setExpenses((prevExpenses) => [...prevExpenses, data]);
      }
    } catch (error) {
      setError('An error occurred while adding the expense');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // You can perform any initial fetch or setup here if needed
  }, []);

  return { expenses, loading, error, getGroupExpenses, addExpense };
};
