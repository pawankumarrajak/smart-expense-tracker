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

    onSave({
      ...formData,
      amount: Number(formData.amount)
    });
  };

  if (!expense) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Expense</h2>

      <input
        type="number"
        name="amount"
        value={formData.amount}
        onChange={handleChange}
        min="1"
        required
      />

      <input
        type="text"
        name="category"
        value={formData.category}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="description"
        value={formData.description}
        onChange={handleChange}
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