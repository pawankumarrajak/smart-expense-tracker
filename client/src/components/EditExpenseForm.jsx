import { useEffect, useState } from "react";

function EditExpenseForm({
  expense,
  onSave,
  onCancel
}) {
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    description: "",
    date: ""
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (expense) {
      setFormData({
        amount: expense.amount,
        category: expense.category,
        description: expense.description || "",
        date: expense.date
          ? expense.date.split("T")[0]
          : ""
      });

      setError("");
    }
  }, [expense]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
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

    onSave({
      ...formData,
      amount: numericAmount,
      category: formData.category.trim(),
      description: formData.description.trim()
    });
  };

  if (!expense) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Expense</h2>

      {error && <p>{error}</p>}

      <input
        type="number"
        name="amount"
        value={formData.amount}
        onChange={handleChange}
        min="0.01"
        step="0.01"
        required
      />

      <input
        type="text"
        name="category"
        value={formData.category}
        onChange={handleChange}
        minLength={2}
        maxLength={50}
        required
      />

      <input
        type="text"
        name="description"
        value={formData.description}
        onChange={handleChange}
        maxLength={200}
      />

      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
      />

      <button type="submit">
        Save Changes
      </button>

      <button
        type="button"
        onClick={onCancel}
      >
        Cancel
      </button>
    </form>
  );
}

export default EditExpenseForm;