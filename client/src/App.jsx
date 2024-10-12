// src/App.jsx
import React from 'react';
import ExpenseTracker from './components/ExpenseTracker';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <ExpenseTracker />
    </div>
  );
};

export default App;
