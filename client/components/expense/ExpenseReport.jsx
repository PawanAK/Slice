// ExpenseReport.js
import React from 'react';

const ExpenseReport = ({ selectedGroup, settlements }) => {
  // Replace this with your actual expense report logic
  return (
    <div>
      <h3>Expense Report</h3>
      <p>Selected Group: {selectedGroup ? selectedGroup.name : 'No group selected'}</p>
      <ul>
        {settlements.map((settlement) => (
          <li key={settlement.member}>
            {settlement.member} owes {settlement.amount} to the group
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseReport;
