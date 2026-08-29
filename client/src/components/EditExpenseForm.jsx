import { useEffect, useState } from "react";

function getTodayDate() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!expense) {
      return;
    }

    setFormData({
      amount: expense.amount ?? "",
      category: expense.category || "",
      description: expense.description || "",
      date: expense.date
        ? expense.date.split("T")[0]
        : ""
    });

    setError("");
  }, [expense]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const amount = Number(formData.amount);

    const category = formData.category
      .trim()
      .replace(/\s+/g, " ");

    const description = formData.description
      .trim()
      .replace(/\s+/g, " ");

    const date = formData.date;

    // Amount validation
    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Amount must be greater than 0");
      return;
    }

    if (amount > 100000000) {
      setError("Amount cannot exceed ₹10,00,00,000");
      return;
    }

    // Category validation
    if (category.length < 2) {
      setError(
        "Category must contain at least 2 characters"
      );
      return;
    }

    if (category.length > 50) {
      setError(
        "Category cannot exceed 50 characters"
      );
      return;
    }

    // Description validation
    if (description.length > 200) {
      setError(
        "Description cannot exceed 200 characters"
      );
      return;
    }

    // Date validation
    if (!date) {
      setError("Please select a date");
      return;
    }

    if (date > getTodayDate()) {
      setError(
        "Expense date cannot be in the future"
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      await onSave({
        amount,
        category:
          category.charAt(0).toUpperCase() +
          category.slice(1),
        description,
        date
      });
    } catch (error) {
      setError(
        error?.message ||
          "Failed to update expense"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!expense) {
    return null;
  }

  return (
    <div className="edit-expense-form">
      <div className="section-heading">
        <div>
          <span className="section-eyebrow">
            Expense management
          </span>

          <h2>Edit Expense</h2>

          <p>
            Update the details of your selected expense.
          </p>
        </div>
      </div>

      {error && (
        <div
          className="form-error"
          role="alert"
          aria-live="polite"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="edit-expense-amount">
            Amount
          </label>

          <div className="input-with-prefix">
            <span aria-hidden="true">₹</span>

            <input
              id="edit-expense-amount"
              type="number"
              name="amount"
              placeholder="0.00"
              value={formData.amount}
              onChange={handleChange}
              min="0.01"
              max="100000000"
              step="0.01"
              inputMode="decimal"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="edit-expense-category">
            Category
          </label>

          <input
            id="edit-expense-category"
            type="text"
            name="category"
            placeholder="e.g. Food"
            value={formData.category}
            onChange={handleChange}
            minLength={2}
            maxLength={50}
            autoComplete="off"
            required
            disabled={loading}
          />
        </div>

        <div className="form-field">
          <label htmlFor="edit-expense-description">
            Description
          </label>

          <input
            id="edit-expense-description"
            type="text"
            name="description"
            placeholder="What was this expense for?"
            value={formData.description}
            onChange={handleChange}
            maxLength={200}
            autoComplete="off"
            disabled={loading}
          />
        </div>

        <div className="form-field">
          <label htmlFor="edit-expense-date">
            Date
          </label>

          <input
            id="edit-expense-date"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            max={getTodayDate()}
            required
            disabled={loading}
          />
        </div>

        <div className="form-actions">
          <button
            className="primary-action"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Saving changes..."
              : "Save Changes"}
          </button>

          <button
            className="secondary-action"
            type="button"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditExpenseForm;