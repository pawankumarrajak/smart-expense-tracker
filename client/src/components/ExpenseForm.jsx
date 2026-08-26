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

    if (Number(formData.amount) <= 0) {
    setError("Amount must be greater than 0");
    setLoading(false);
    return;
    }

    setLoading(true);

    try {
      const result = await createExpense({
        amount: Number(formData.amount),
        category: formData.category,
        description: formData.description,
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
          min="1"
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