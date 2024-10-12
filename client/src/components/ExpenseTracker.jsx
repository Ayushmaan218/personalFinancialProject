// src/components/ExpenseTracker.jsx
import React, { useState } from 'react';

const ExpenseTracker = () => {
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');

    const addExpense = async () => {
        const parsedAmount = parseFloat(amount);

        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            alert('Please enter a valid amount.');
            return;
        }

        const newTransaction = { description, amount: parsedAmount };

        try {
            console.log("Sending data to backend:", newTransaction);
            const response = await fetch('http://localhost:5000/expenses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTransaction),
            });

            console.log("Response from backend:", response);

            if (!response.ok) {
                throw new Error('Failed to add the expense');
            }

            const data = await response.json();
            console.log("Data from backend:", data);

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
        <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-center">Expense Tracker</h1>
            <div className="balance my-4">
                <h2 className="text-xl">
                    Balance: $
                    <span className="font-semibold">{balance.toFixed(2)}</span>
                </h2>
            </div>
            <div className="transactions">
                <h2 className="text-lg font-semibold">Transactions</h2>
                <ul className="list-disc pl-5">
                    {transactions.map((transaction, index) => (
                        <li key={index}>
                            {`${transaction.description}: $${transaction.amount.toFixed(2)}`}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="add-expense mt-4">
                <h2 className="text-lg font-semibold">Add Expense</h2>
                <form onSubmit={(e) => e.preventDefault()} className="flex flex-col">
                    <label className="mt-2" htmlFor="description">Description:</label>
                    <input
                        className="border rounded-md p-2 mt-1"
                        type="text"
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                    <label className="mt-2" htmlFor="amount">Amount:</label>
                    <input
                        className="border rounded-md p-2 mt-1"
                        type="number"
                        id="amount"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        onClick={addExpense}
                        className="bg-blue-500 text-white font-semibold rounded-md p-2 mt-4 hover:bg-blue-600"
                    >
                        Add Expense
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ExpenseTracker;
