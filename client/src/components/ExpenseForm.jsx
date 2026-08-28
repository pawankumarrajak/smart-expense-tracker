import { useState } from "react";
import { createExpense } from "../services/expenseApi";

function ExpenseForm({ onExpenseCreated }) {
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    description: "",
    date: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const numericAmount = Number(formData.amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError("Amount must be greater than 0");
      return;
    }

    if (formData.category.trim().length < 2) {
      setError("Category must contain at least 2 characters");
      return;
    }

    if (formData.category.trim().length > 50) {
      setError("Category cannot exceed 50 characters");
      return;
    }

    if (formData.description.trim().length > 200) {
      setError("Description cannot exceed 200 characters");
      return;
    }

    setLoading(true);

    try {
      const result = await createExpense({
        amount: numericAmount,
        category: formData.category.trim(),
        description: formData.description.trim(),
        date: formData.date
      });

      onExpenseCreated(result.data);

      setFormData({
        amount: "",
        category: "",
        description: "",
        date: ""
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Expense</h2>

      {error && <p>{error}</p>}

      <div>
        <label>Amount</label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          min="0.01"
          step="0.01"
          required
        />
      </div>

      <div>
        <label>Category</label>
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          minLength={2}
          maxLength={50}
          required
        />
      </div>

      <div>
        <label>Description</label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          maxLength={200}
        />
      </div>

      <div>
        <label>Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Add Expense"}
      </button>
    </form>
  );
}

export default ExpenseForm;