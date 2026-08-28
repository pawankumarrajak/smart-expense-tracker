import { useMemo } from "react";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

function formatCurrency(amount) {
  return currencyFormatter.format(
    Number.isFinite(amount) ? amount : 0
  );
}

function Dashboard({ expenses }) {
  const safeExpenses = Array.isArray(expenses)
    ? expenses
    : [];

  const {
    totalExpense,
    totalEntries,
    averageExpense,
    highestExpense,
    monthlyExpense,
    sortedCategories
  } = useMemo(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    let total = 0;
    let highest = 0;
    let monthlyTotal = 0;

    const categoryTotals = {};

    safeExpenses.forEach((expense) => {
      const amount = Number(expense.amount);

      if (!Number.isFinite(amount) || amount < 0) {
        return;
      }

      total += amount;

      if (amount > highest) {
        highest = amount;
      }

      const expenseDate = new Date(expense.date);

      if (!Number.isNaN(expenseDate.getTime())) {
        if (
          expenseDate.getMonth() === currentMonth &&
          expenseDate.getFullYear() === currentYear
        ) {
          monthlyTotal += amount;
        }
      }

      const category =
        expense.category?.trim() || "Other";

      categoryTotals[category] =
        (categoryTotals[category] || 0) + amount;
    });

    const entries = safeExpenses.length;

    const average =
      entries > 0
        ? total / entries
        : 0;

    const categories = Object.entries(
      categoryTotals
    )
      .sort(
        ([, amountA], [, amountB]) =>
          amountB - amountA
      )
      .slice(0, 5);

    return {
      totalExpense: total,
      totalEntries: entries,
      averageExpense: average,
      highestExpense: highest,
      monthlyExpense: monthlyTotal,
      sortedCategories: categories
    };
  }, [safeExpenses]);

  const statCards = [
    {
      title: "Total Spent",
      value: formatCurrency(totalExpense),
      icon: "₹",
      className: "stat-primary"
    },
    {
      title: "Transactions",
      value: totalEntries,
      icon: "#"
    },
    {
      title: "Average Expense",
      value: formatCurrency(averageExpense),
      icon: "↗"
    },
    {
      title: "Highest Expense",
      value: formatCurrency(highestExpense),
      icon: "↑"
    },
    {
      title: "This Month",
      value: formatCurrency(monthlyExpense),
      icon: "◷"
    }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-grid">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className={`stat-card ${
              stat.className || ""
            }`}
          >
            <div className="stat-icon">
              {stat.icon}
            </div>

            <div className="stat-content">
              <span>{stat.title}</span>

              <h2>{stat.value}</h2>
            </div>
          </div>
        ))}
      </div>

      {sortedCategories.length > 0 && (
        <div className="card category-summary">
          <div className="section-heading">
            <div>
              <span className="section-eyebrow">
                Spending overview
              </span>

              <h2>
                Top Spending Categories
              </h2>

              <p>
                Your highest spending categories
              </p>
            </div>
          </div>

          <div className="category-list">
            {sortedCategories.map(
              ([category, amount], index) => (
                <div
                  key={category}
                  className="category-row"
                >
                  <div className="category-info">
                    <span className="category-rank">
                      {index + 1}
                    </span>

                    <span className="category-name">
                      {category}
                    </span>
                  </div>

                  <strong>
                    {formatCurrency(amount)}
                  </strong>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;