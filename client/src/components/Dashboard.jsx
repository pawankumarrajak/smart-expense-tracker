function Dashboard({ expenses }) {
  const totalExpense = expenses.reduce(
    (total, expense) =>
      total + Number(expense.amount),
    0
  );

  const totalEntries = expenses.length;

  const averageExpense =
    totalEntries > 0
      ? totalExpense / totalEntries
      : 0;

  return (
    <div className="dashboard-grid">

      <div className="stat-card">
        <span>Total Spent</span>
        <h2>₹{totalExpense.toFixed(2)}</h2>
      </div>

      <div className="stat-card">
        <span>Transactions</span>
        <h2>{totalEntries}</h2>
      </div>

      <div className="stat-card">
        <span>Average Expense</span>
        <h2>₹{averageExpense.toFixed(2)}</h2>
      </div>

    </div>
  );
}

export default Dashboard;