function ExpenseList({ expenses, onEdit, onDelete }) {
  if (expenses.length === 0) {
    return (
      <div>
        <h2>All Expenses</h2>
        <p>No expenses yet.</p>
        <p>Add your first expense above.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>All Expenses</h2>

      {expenses.map((expense) => (
        <div
          key={expense._id}
          className="expense-item"
        >
          <h3>
            ₹{Number(expense.amount).toFixed(2)}
          </h3>

          <p>
            <strong>Category:</strong>{" "}
            {expense.category}
          </p>

          <p>
            <strong>Description:</strong>{" "}
            {expense.description || "No description"}
          </p>

          <p>
            <strong>Date:</strong>{" "}
            {new Date(expense.date).toLocaleDateString()}
          </p>

          <div className="expense-actions">
            <button
              onClick={() => onEdit(expense)}
            >
              Edit
            </button>

            <button
              onClick={() => onDelete(expense._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ExpenseList;