import { useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";
import CustomSelect from "./CustomSelect";

const MAX_AMOUNT = 100000000;

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

const monthFormatter = new Intl.DateTimeFormat("en-IN", {
  month: "short",
  year: "numeric"
});

function formatCurrency(amount) {
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount)) {
    return "₹0.00";
  }

  return currencyFormatter.format(numericAmount);
}

function getMonthKey(date) {
  if (!date) {
    return null;
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return `${parsedDate.getFullYear()}-${String(
    parsedDate.getMonth() + 1
  ).padStart(2, "0")}`;
}

function getCurrentMonthKey() {
  const today = new Date();

  return `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}`;
}

function formatMonthLabel(monthKey) {
  if (!monthKey) {
    return "";
  }

  const [year, month] = monthKey.split("-");

  const date = new Date(
    Number(year),
    Number(month) - 1,
    1
  );

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return monthFormatter.format(date);
}

function Dashboard({ expenses = [] }) {
  const safeExpenses = Array.isArray(expenses)
    ? expenses
    : [];

  const [selectedMonth, setSelectedMonth] = useState(
    getCurrentMonthKey()
  );

  const availableMonths = useMemo(() => {
    const months = new Set();

    safeExpenses.forEach((expense) => {
      const monthKey = getMonthKey(expense.date);

      if (monthKey) {
        months.add(monthKey);
      }
    });

    months.add(getCurrentMonthKey());

    return [...months].sort().reverse();
  }, [safeExpenses]);

  const monthOptions = useMemo(
    () =>
      availableMonths.map((month) => ({
        value: month,
        label: formatMonthLabel(month)
      })),
    [availableMonths]
  );

  const {
    totalExpense,
    totalEntries,
    averageExpense,
    highestExpense,
    monthlyExpense,
    sortedCategories,
    categoryChartData,
    monthlyChartData
  } = useMemo(() => {
    const currentMonthKey = getCurrentMonthKey();

    let total = 0;
    let highest = 0;
    let monthlyTotal = 0;

    const categoryTotals = {};
    const monthlyTotals = {};

    safeExpenses.forEach((expense) => {
      const amount = Number(expense.amount);

      if (
        !Number.isFinite(amount) ||
        amount < 0 ||
        amount > MAX_AMOUNT
      ) {
        return;
      }

      total += amount;

      if (amount > highest) {
        highest = amount;
      }

      const expenseMonthKey = getMonthKey(
        expense.date
      );

      if (
        expenseMonthKey === currentMonthKey
      ) {
        monthlyTotal += amount;
      }

      if (expenseMonthKey) {
        monthlyTotals[expenseMonthKey] =
          (monthlyTotals[expenseMonthKey] || 0) +
          amount;
      }

      const category =
        expense.category?.trim() || "Other";

      categoryTotals[category] =
        (categoryTotals[category] || 0) +
        amount;
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

    const categoryData = categories.map(
      ([name, value]) => ({
        name,
        value
      })
    );

    const recentMonths = Object.entries(
      monthlyTotals
    )
      .sort(([monthA], [monthB]) =>
        monthA.localeCompare(monthB)
      )
      .slice(-6)
      .map(([month, amount]) => ({
        month,
        label: formatMonthLabel(month),
        amount
      }));

    return {
      totalExpense: total,
      totalEntries: entries,
      averageExpense: average,
      highestExpense: highest,
      monthlyExpense: monthlyTotal,
      sortedCategories: categories,
      categoryChartData: categoryData,
      monthlyChartData: recentMonths
    };
  }, [safeExpenses]);

  const selectedMonthData = useMemo(() => {
    let total = 0;
    let entries = 0;

    const categoryTotals = {};

    safeExpenses.forEach((expense) => {
      const expenseMonthKey = getMonthKey(
        expense.date
      );

      if (expenseMonthKey !== selectedMonth) {
        return;
      }

      const amount = Number(expense.amount);

      if (
        !Number.isFinite(amount) ||
        amount < 0 ||
        amount > MAX_AMOUNT
      ) {
        return;
      }

      total += amount;
      entries += 1;

      const category =
        expense.category?.trim() || "Other";

      categoryTotals[category] =
        (categoryTotals[category] || 0) +
        amount;
    });

    const categories = Object.entries(
      categoryTotals
    )
      .sort(
        ([, amountA], [, amountB]) =>
          amountB - amountA
      )
      .slice(0, 5);

    return {
      total,
      entries,
      average:
        entries > 0
          ? total / entries
          : 0,
      categories
    };
  }, [safeExpenses, selectedMonth]);

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

      {/* SUMMARY CARDS */}

      <div className="dashboard-grid">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className={`stat-card ${
              stat.className || ""
            }`}
          >
            <div
              className="stat-icon"
              aria-hidden="true"
            >
              {stat.icon}
            </div>

            <div className="stat-content">
              <span>{stat.title}</span>

              <h2>{stat.value}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* MONTHLY SPENDING */}

      <div className="card analytics-section">
        <div className="section-heading">
          <div>
            <span className="section-eyebrow">
              Analytics
            </span>

            <h2>Monthly Spending</h2>

            <p>
              Review your spending for a selected
              month.
            </p>
          </div>

          <CustomSelect
            id="analytics-month"
            label="Select month"
            value={selectedMonth}
            options={monthOptions}
            onChange={setSelectedMonth}
          />
        </div>

        {/* SELECTED MONTH CARDS */}

        <div className="dashboard-grid">
          <div className="stat-card">
            <div
              className="stat-icon"
              aria-hidden="true"
            >
              ₹
            </div>

            <div className="stat-content">
              <span>
                {formatMonthLabel(selectedMonth)}
              </span>

              <h2>
                {formatCurrency(
                  selectedMonthData.total
                )}
              </h2>
            </div>
          </div>

          <div className="stat-card">
            <div
              className="stat-icon"
              aria-hidden="true"
            >
              #
            </div>

            <div className="stat-content">
              <span>Transactions</span>

              <h2>
                {selectedMonthData.entries}
              </h2>
            </div>
          </div>

          <div className="stat-card">
            <div
              className="stat-icon"
              aria-hidden="true"
            >
              ↗
            </div>

            <div className="stat-content">
              <span>Monthly Average</span>

              <h2>
                {formatCurrency(
                  selectedMonthData.average
                )}
              </h2>
            </div>
          </div>
        </div>

        {/* CATEGORY BREAKDOWN */}

        {selectedMonthData.categories.length > 0 && (
          <div className="category-summary">
            <div className="section-heading">
              <div>
                <span className="section-eyebrow">
                  Category breakdown
                </span>

                <h2>
                  Top Categories in{" "}
                  {formatMonthLabel(selectedMonth)}
                </h2>

                <p>
                  Where you spent the most during
                  the selected month.
                </p>
              </div>
            </div>

            <div className="category-list">
              {selectedMonthData.categories.map(
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

      {/* CATEGORY CHART */}

      {categoryChartData.length > 0 && (
        <div className="card analytics-section">
          <div className="section-heading">
            <div>
              <span className="section-eyebrow">
                Analytics
              </span>

              <h2>Spending by Category</h2>

              <p>
                Distribution of your spending
                across categories.
              </p>
            </div>
          </div>

          <div
            className="chart-container"
            style={{
              width: "100%",
              height: 320
            }}
          >
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={categoryChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) =>
                    `${name} ${(
                      percent * 100
                    ).toFixed(0)}%`
                  }
                >
                  {categoryChartData.map(
                    (entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                      />
                    )
                  )}
                </Pie>

                <Tooltip
                  formatter={(value) =>
                    formatCurrency(
                      Number(value)
                    )
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* MONTHLY TREND */}

      {monthlyChartData.length > 0 && (
        <div className="card analytics-section">
          <div className="section-heading">
            <div>
              <span className="section-eyebrow">
                Analytics
              </span>

              <h2>Spending Trend</h2>

              <p>
                Your spending across the recent
                months.
              </p>
            </div>
          </div>

          <div
            className="chart-container"
            style={{
              width: "100%",
              height: 320
            }}
          >
            <ResponsiveContainer>
              <BarChart
                data={monthlyChartData}
                margin={{
                  top: 10,
                  right: 20,
                  left: 10,
                  bottom: 10
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis dataKey="label" />

                <YAxis />

                <Tooltip
                  formatter={(value) =>
                    formatCurrency(
                      Number(value)
                    )
                  }
                />

                <Bar
                  dataKey="amount"
                  name="Spending"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* TOP SPENDING CATEGORIES */}

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
                Your highest spending categories.
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