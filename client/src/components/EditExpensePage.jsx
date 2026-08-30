import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams
} from "react-router-dom";

import EditExpenseForm from "./EditExpenseForm";
import Footer from "./Footer";
import { getExpenses } from "../services/expenseApi";

function EditExpensePage({
  expenses = [],
  onSave,
  actionLoading
}) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [expense, setExpense] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const findExpense = async () => {
      try {
        setLoading(true);
        setError("");

        const existingExpense =
          expenses.find(
            (item) => item._id === id
          );

        if (existingExpense) {
          setExpense(existingExpense);
          return;
        }

        const result =
          await getExpenses();

        const fetchedExpenses =
          Array.isArray(result?.data)
            ? result.data
            : [];

        const foundExpense =
          fetchedExpenses.find(
            (item) => item._id === id
          );

        if (!foundExpense) {
          setError(
            "Expense not found."
          );
          return;
        }

        setExpense(foundExpense);
      } catch (error) {
        setError(
          error?.message ||
            "Failed to load expense."
        );
      } finally {
        setLoading(false);
      }
    };

    findExpense();
  }, [id, expenses]);

  const handleSave = async (updatedData) => {
    if (!expense?._id) {
      return;
    }

    await onSave(
      expense._id,
      updatedData
    );
  };

  const handleCancel = () => {
    if (!actionLoading) {
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="app">
        <main className="container">
          <div className="card">
            <p>
              Loading expense...
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !expense) {
    return (
      <div className="app">
        <main className="container">
          <div className="card">
            <div
              className="error"
              role="alert"
            >
              {error ||
                "Expense not found."}
            </div>

            <button
              type="button"
              className="secondary-action"
              onClick={() =>
                navigate("/")
              }
            >
              Back to Dashboard
            </button>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>
            Smart Expense Tracker
          </h1>

          <p>
            Edit your expense
          </p>
        </div>

        <button
          type="button"
          onClick={handleCancel}
          disabled={actionLoading}
        >
          Back
        </button>
      </header>

      <main className="container">
        <div className="card">
          <EditExpenseForm
            expense={expense}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default EditExpensePage;