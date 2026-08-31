import { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate
} from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import VerifyEmail from "./components/VerifyEmail";
import Dashboard from "./components/Dashboard";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import EditExpensePage from "./components/EditExpensePage";
import CurrencyConverter from "./components/CurrencyConverter";
import Footer from "./components/Footer";
import Profile from "./components/Profile";

import {
  getExpenses,
  updateExpense,
  deleteExpense
} from "./services/expenseApi";

function App() {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");

      return savedUser
        ? JSON.parse(savedUser)
        : null;
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [showRegister, setShowRegister] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

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
          Array.isArray(result?.data)
            ? result.data
            : []
        );
      } catch (error) {
        setError(
          error?.message ||
            "Failed to load expenses."
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
    navigate("/");
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
    setError("");
    setLoading(false);
    setActionLoading(false);

    navigate("/");
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
    if (!expense?._id) {
      return;
    }

    setError("");

    navigate(
      `/expenses/${expense._id}/edit`
    );
  };

  const handleUpdate = async (
    expenseId,
    updatedData
  ) => {
    if (!expenseId) {
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      const result = await updateExpense(
        expenseId,
        updatedData
      );

      if (result?.data) {
        setExpenses((previousExpenses) =>
          previousExpenses.map((expense) =>
            expense._id === expenseId
              ? result.data
              : expense
          )
        );
      }

      navigate("/");
    } catch (error) {
      setError(
        error?.message ||
          "Failed to update expense."
      );

      throw error;
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
          (expense) =>
            expense._id !== expenseId
        )
      );
    } catch (error) {
      setError(
        error?.message ||
          "Failed to delete expense."
      );
    } finally {
      setActionLoading(false);
    }
  };

  /*
   * Logged-out routes
   */
  if (!user) {
    return (
      <Routes>
        <Route
          path="/verify-email"
          element={<VerifyEmail />}
        />

        <Route
          path="*"
          element={
            showRegister ? (
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
            )
          }
        />
      </Routes>
    );
  }

  /*
   * Logged-in routes
   */
  return (
    <Routes>
      {/* Email verification */}
      <Route
        path="/verify-email"
        element={<VerifyEmail />}
      />

      {/* Dashboard */}
      <Route
        path="/"
        element={
          <div className="app">
            <header className="header">
              <div>
                <h1>Smart Expense Tracker</h1>

                <p>
                  Welcome, {user.name || "User"}
                </p>
              </div>

              <div className="header-actions">
                <button
                  type="button"
                  onClick={() =>
                    navigate("/profile")
                  }
                  disabled={actionLoading}
                >
                  Profile
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={actionLoading}
                >
                  Logout
                </button>
              </div>
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
                  <p>
                    Loading expenses...
                  </p>
                </div>
              ) : (
                <>
                  <Dashboard
                    expenses={expenses}
                  />

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
        }
      />

      {/* Profile */}
      <Route
        path="/profile"
        element={
          <Profile
            user={user}
            onBack={() => navigate("/")}
            onLogout={handleLogout}
          />
        }
      />

      {/* Edit expense */}
      <Route
        path="/expenses/:id/edit"
        element={
          <EditExpensePage
            expenses={expenses}
            onSave={handleUpdate}
            actionLoading={actionLoading}
          />
        }
      />

      {/* Unknown route */}
      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />
    </Routes>
  );
}

export default App;
