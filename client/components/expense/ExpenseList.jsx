// ExpenseList.js
import React from 'react';

const ExpenseList = ({ expenses }) => {
  return (
    <div>
      <h3>Expense List</h3>
      <ul>
        {expenses.map((expense) => (
          <li key={expense._id}>
            {expense.description} - {expense.amount}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseList;
