import { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
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

  /*
   * =========================================================
   * LOAD LATEST PROFILE
   * =========================================================
   *
   * Keeps the Dashboard synchronized with the backend.
   *
   * Important:
   * After uploading a profile picture on the Profile page,
   * the updated profile is sent back to App.jsx through
   * onProfileUpdated().
   */
  useEffect(() => {
    if (!user) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      handleLogout();
      return;
    }

    const loadProfile = async () => {
      try {
        const API_URL =
          `${import.meta.env.VITE_API_URL}/api/users`;

        const response = await fetch(
          `${API_URL}/profile`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result?.message ||
              "Failed to load profile."
          );
        }

        if (result?.data) {
          setUser((previousUser) => {
            const latestUser = {
              ...previousUser,
              ...result.data
            };

            localStorage.setItem(
              "user",
              JSON.stringify(latestUser)
            );

            return latestUser;
          });
        }
      } catch (error) {
        console.error(
          "Failed to load latest profile:",
          error
        );
      }
    };

    loadProfile();
  }, [user?.id]);

  /*
   * =========================================================
   * LOAD EXPENSES
   * =========================================================
   */
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

  /*
   * =========================================================
   * LOGIN
   * =========================================================
   */
  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    setShowRegister(false);
    setError("");

    localStorage.setItem(
      "user",
      JSON.stringify(loggedInUser)
    );

    navigate("/");
  };

  /*
   * =========================================================
   * REGISTER
   * =========================================================
   */
  const handleRegister = () => {
    setShowRegister(false);
    setError("");
  };

  /*
   * =========================================================
   * PROFILE UPDATED
   * =========================================================
   *
   * Called by Profile.jsx after profile picture upload.
   *
   * This updates:
   * 1. React user state
   * 2. localStorage user
   *
   * Therefore Dashboard immediately gets the new image.
   */
  const handleProfileUpdated = (updatedProfile) => {
    if (!updatedProfile) {
      return;
    }

    setUser((previousUser) => {
      const updatedUser = {
        ...previousUser,
        ...updatedProfile
      };

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      return updatedUser;
    });
  };

  /*
   * =========================================================
   * LOGOUT
   * =========================================================
   */
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

  /*
   * =========================================================
   * CREATE EXPENSE
   * =========================================================
   */
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

  /*
   * =========================================================
   * EDIT EXPENSE
   * =========================================================
   */
  const handleEdit = (expense) => {
    if (!expense?._id) {
      return;
    }

    setError("");

    navigate(
      `/expenses/${expense._id}/edit`
    );
  };

  /*
   * =========================================================
   * UPDATE EXPENSE
   * =========================================================
   */
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

  /*
   * =========================================================
   * DELETE EXPENSE
   * =========================================================
   */
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
   * =========================================================
   * LOGGED-OUT ROUTES
   * =========================================================
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
   * =========================================================
   * LOGGED-IN ROUTES
   * =========================================================
   */
  return (
    <Routes>
      {/* =====================================================
          EMAIL VERIFICATION
      ===================================================== */}
      <Route
        path="/verify-email"
        element={<VerifyEmail />}
      />

      {/* =====================================================
          DASHBOARD
      ===================================================== */}
      <Route
        path="/"
        element={
          <div className="app">

            {/* =================================================
                DASHBOARD HEADER
            ================================================= */}
            <header className="header">

              {/* -----------------------------------------------
                  Header Title
              ----------------------------------------------- */}
              <div>
                <h1>
                  Smart Expense Tracker
                </h1>

                <p>
                  Welcome, {user.name || "User"}
                </p>
              </div>

              {/* -----------------------------------------------
                  Header Actions

                  IMPORTANT:
                  Only ONE avatar is rendered here.

                  Layout:
                  [ Avatar ] [ Profile ] [ Logout ]
              ----------------------------------------------- */}
              <div className="dashboard-profile-actions">

  {/* PROFILE AVATAR */}
  <button
    type="button"
    className="dashboard-avatar-button"
    onClick={() => navigate("/profile")}
    disabled={actionLoading}
    aria-label="Open profile"
    title="Open profile"
  >
    <span className="dashboard-avatar">
      {user?.profilePicture ? (
        <img
          src={user.profilePicture}
          alt={`${user.name || "User"} profile`}
        />
      ) : (
        <span aria-hidden="true">
          {user?.name
            ?.trim()
            ?.charAt(0)
            ?.toUpperCase() || "U"}
        </span>
      )}
    </span>
  </button>

  {/* PROFILE + LOGOUT */}
  <div className="dashboard-profile-buttons">

    <button
      type="button"
      onClick={() => navigate("/profile")}
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

</div>
            </header>

            {/* =================================================
                MAIN DASHBOARD CONTENT
            ================================================= */}
            <main className="container">

              {/* GLOBAL ERROR */}
              {error && (
                <div
                  className="error"
                  role="alert"
                  aria-live="polite"
                >
                  {error}
                </div>
              )}

              {/* LOADING STATE */}
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
                  {/* -------------------------------------------
                      DASHBOARD ANALYTICS
                  ------------------------------------------- */}
                  <Dashboard
                    expenses={expenses}
                  />

                  {/* -------------------------------------------
                      ADD EXPENSE + CURRENCY CONVERTER
                  ------------------------------------------- */}
                  <div className="top-grid">

                    {/* ADD EXPENSE */}
                    <div className="card">
                      <ExpenseForm
                        onExpenseCreated={
                          handleExpenseCreated
                        }
                      />
                    </div>

                    {/* CURRENCY CONVERTER */}
                    <div className="card">
                      <CurrencyConverter />
                    </div>

                  </div>

                  {/* -------------------------------------------
                      EXPENSE LIST
                  ------------------------------------------- */}
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

            {/* FOOTER */}
            <Footer />

          </div>
        }
      />

      {/* =====================================================
          PROFILE PAGE
      ===================================================== */}
      <Route
        path="/profile"
        element={
          <Profile
            user={user}
            onBack={() => navigate("/")}
            onLogout={handleLogout}
            onProfileUpdated={
              handleProfileUpdated
            }
          />
        }
      />

      {/* =====================================================
          EDIT EXPENSE
      ===================================================== */}
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

      {/* =====================================================
          UNKNOWN ROUTE
      ===================================================== */}
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