import { useEffect, useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import VerifyEmail from "./components/VerifyEmail";
import Dashboard from "./components/Dashboard";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import EditExpenseForm from "./components/EditExpenseForm";
import CurrencyConverter from "./components/CurrencyConverter";
import Footer from "./components/Footer";
import {
  getExpenses,
  updateExpense,
  deleteExpense
} from "./services/expenseApi";

function App() {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");

      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });

  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [showRegister, setShowRegister] = useState(false);

  const isEmailVerificationPage =
    window.location.pathname === "/verify-email";

  useEffect(() => {
    if (!user) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      handleLogout();
      return;
    }

    const loadExpenses = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await getExpenses();

        setExpenses(
          Array.isArray(result?.data) ? result.data : []
        );
      } catch (error) {
        setError(
          error?.message || "Failed to load expenses."
        );
      } finally {
        setLoading(false);
      }
    };

    loadExpenses();
  }, [user]);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    setShowRegister(false);
    setError("");
  };

  const handleRegister = () => {
    setShowRegister(false);
    setError("");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setExpenses([]);
    setEditingExpense(null);
    setError("");
    setLoading(false);
    setActionLoading(false);
  };

  const handleGoToLogin = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setExpenses([]);
    setEditingExpense(null);
    setShowRegister(false);
    setError("");
    setLoading(false);
    setActionLoading(false);

    window.history.replaceState({}, "", "/");
  };

  const handleExpenseCreated = (newExpense) => {
    if (!newExpense) {
      return;
    }

    setExpenses((previousExpenses) => [
      newExpense,
      ...previousExpenses
    ]);

    setError("");
  };

  const handleEdit = (expense) => {
    if (!expense) {
      return;
    }

    setEditingExpense(expense);
    setError("");
  };

  const handleUpdate = async (updatedData) => {
    if (!editingExpense?._id) {
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      const result = await updateExpense(
        editingExpense._id,
        updatedData
      );

      if (result?.data) {
        setExpenses((previousExpenses) =>
          previousExpenses.map((expense) =>
            expense._id === editingExpense._id
              ? result.data
              : expense
          )
        );
      }

      setEditingExpense(null);
    } catch (error) {
      setError(
        error?.message || "Failed to update expense."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (expenseId) => {
    if (!expenseId) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      await deleteExpense(expenseId);

      setExpenses((previousExpenses) =>
        previousExpenses.filter(
          (expense) => expense._id !== expenseId
        )
      );

      if (editingExpense?._id === expenseId) {
        setEditingExpense(null);
      }
    } catch (error) {
      setError(
        error?.message || "Failed to delete expense."
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (isEmailVerificationPage) {
    return (
      <VerifyEmail
        onVerified={handleGoToLogin}
      />
    );
  }

  if (!user) {
    return (
      <>
        {showRegister ? (
          <Register
            onRegister={handleRegister}
            onSwitchToLogin={() =>
              setShowRegister(false)
            }
          />
        ) : (
          <Login
            onLogin={handleLogin}
            onSwitchToRegister={() =>
              setShowRegister(true)
            }
          />
        )}
      </>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>Smart Expense Tracker</h1>

          <p>
            Welcome, {user.name || "User"}
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          disabled={actionLoading}
        >
          Logout
        </button>
      </header>

      <main className="container">
        {error && (
          <div
            className="error"
            role="alert"
            aria-live="polite"
          >
            {error}
          </div>
        )}

        {loading ? (
          <div
            className="card"
            role="status"
            aria-live="polite"
          >
            <p>Loading expenses...</p>
          </div>
        ) : (
          <>
            <Dashboard expenses={expenses} />

            <div className="top-grid">
              <div className="card">
                <ExpenseForm
                  onExpenseCreated={
                    handleExpenseCreated
                  }
                />
              </div>

              <div className="card">
                <CurrencyConverter />
              </div>
            </div>

            {editingExpense && (
              <div className="card">
                <EditExpenseForm
                  expense={editingExpense}
                  onSave={handleUpdate}
                  onCancel={() => {
                    if (!actionLoading) {
                      setEditingExpense(null);
                    }
                  }}
                />
              </div>
            )}

            <div className="card">
              <ExpenseList
                expenses={expenses}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;