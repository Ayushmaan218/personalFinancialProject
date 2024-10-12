// src/components/ExpenseTracker.jsx
import React, { useState } from 'react';

const ExpenseTracker = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const addExpense = async () => {
    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    const newTransaction = { description, amount: parsedAmount };

    try {
      const response = await fetch(`${backendUrl}/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTransaction),
      });

      if (!response.ok) {
        throw new Error('Failed to add the expense');
      }

      const data = await response.json();

      setBalance((prevBalance) => prevBalance + parsedAmount);
      setTransactions((prevTransactions) => [...prevTransactions, newTransaction]);

      setDescription('');
      setAmount('');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add expense.');
    }
  };

  return (
    <div className="container mx-auto max-w-md bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-4">Expense Tracker</h1>

      <div className="balance mb-6">
        <h2 className="text-xl font-semibold">Balance: ${balance.toFixed(2)}</h2>
      </div>

      <div className="transactions mb-6">
        <h2 className="text-lg font-semibold mb-2">Transactions</h2>
        <ul className="list-disc pl-4">
          {transactions.map((transaction, index) => (
            <li key={index}>
              {`${transaction.description}: $${transaction.amount.toFixed(2)}`}
            </li>
          ))}
        </ul>
      </div>

      <div className="add-expense">
        <h2 className="text-lg font-semibold mb-2">Add Expense</h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="description" className="block text-sm font-medium">
              Description:
            </label>
            <input
              type="text"
              id="description"
              className="w-full p-2 border border-gray-300 rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium">
              Amount:
            </label>
            <input
              type="number"
              id="amount"
              className="w-full p-2 border border-gray-300 rounded"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <button
            type="button"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            onClick={addExpense}
          >
            Add Expense
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExpenseTracker;
