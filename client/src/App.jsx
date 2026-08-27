import { useEffect, useState } from "react";

import CurrencyConverter from "./components/CurrencyConverter";
import Dashboard from "./components/Dashboard";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import EditExpenseForm from "./components/EditExpenseForm";
import Footer from "./components/Footer";

import {
  getExpenses,
  updateExpense,
  deleteExpense
} from "./services/expenseApi";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingExpense, setEditingExpense] = useState(null);

  // Load expenses
  const loadExpenses = async () => {
    try {
      setLoading(true);

      const result = await getExpenses();

      setExpenses(result.data);
      setError("");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  // Handle newly created expense
  const handleExpenseCreated = (newExpense) => {
    setExpenses((previousExpenses) => [
      newExpense,
      ...previousExpenses
    ]);
  };

  // Handle edit
  const handleEdit = (expense) => {
    setEditingExpense(expense);
  };

  // Handle update
  const handleUpdate = async (updatedData) => {
    try {
      const result = await updateExpense(
        editingExpense._id,
        updatedData
      );

      setExpenses((previousExpenses) =>
        previousExpenses.map((expense) =>
          expense._id === editingExpense._id
            ? result.data
            : expense
        )
      );

      setEditingExpense(null);
      setError("");
    } catch (error) {
      setError(error.message);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteExpense(id);

      setExpenses((previousExpenses) =>
        previousExpenses.filter(
          (expense) => expense._id !== id
        )
      );

      setError("");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="app">

      {/* Header */}
      <header className="header">
        <div>
          <h1>Smart Expense Tracker</h1>
          <p>Manage your expenses easily</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container">

        {/* Dashboard */}
        <Dashboard expenses={expenses} />

        {/* Expense Form + Currency Converter */}
        <div className="top-grid">

          <section className="card">
            <ExpenseForm
              onExpenseCreated={handleExpenseCreated}
            />
          </section>

          <section className="card">
            <CurrencyConverter />
          </section>

        </div>

        {/* Edit Expense Form */}
        {editingExpense && (
          <section className="card">
            <EditExpenseForm
              expense={editingExpense}
              onSave={handleUpdate}
              onCancel={() => setEditingExpense(null)}
            />
          </section>
        )}

        {/* Error */}
        {error && (
          <p className="error">
            {error}
          </p>
        )}

        {/* Expenses List */}
        <section className="card">

          {loading ? (
            <p>Loading expenses...</p>
          ) : (
            <ExpenseList
              expenses={expenses}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}

        </section>

      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}

export default App;