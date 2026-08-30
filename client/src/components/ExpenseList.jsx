import { useMemo, useState } from "react";
import CustomSelect from "./CustomSelect";

const currencyFormatter = new Intl.NumberFormat(
  "en-IN",
  {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }
);

const dateFormatter = new Intl.DateTimeFormat(
  "en-IN",
  {
    day: "numeric",
    month: "short",
    year: "numeric"
  }
);

function formatCurrency(amount) {
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount)) {
    return "₹0.00";
  }

  return currencyFormatter.format(numericAmount);
}

function formatDate(date) {
  if (!date) {
    return "Date unavailable";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return dateFormatter.format(parsedDate);
}

function ExpenseList({
  expenses = [],
  onEdit,
  onDelete
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        expenses
          .map((expense) =>
            expense.category?.trim()
          )
          .filter(Boolean)
      )
    ];

    return [
      "All",
      ...uniqueCategories.sort((a, b) =>
        a.localeCompare(b)
      )
    ];
  }, [expenses]);

  const categoryOptions = useMemo(
    () =>
      categories.map((item) => ({
        value: item,
        label: item
      })),
    [categories]
  );

  const sortOptions = [
    {
      value: "newest",
      label: "Newest first"
    },
    {
      value: "oldest",
      label: "Oldest first"
    },
    {
      value: "highest",
      label: "Highest amount"
    },
    {
      value: "lowest",
      label: "Lowest amount"
    }
  ];

  const filteredExpenses = useMemo(() => {
    const searchText =
      search.trim().toLowerCase();

    const result = expenses.filter((expense) => {
      const expenseCategory =
        expense.category
          ?.trim()
          .toLowerCase() || "";

      const expenseDescription =
        expense.description
          ?.trim()
          .toLowerCase() || "";

      const expenseAmount =
        String(
          expense.amount ?? ""
        ).toLowerCase();

      const matchesSearch =
        !searchText ||
        expenseCategory.includes(searchText) ||
        expenseDescription.includes(searchText) ||
        expenseAmount.includes(searchText);

      const matchesCategory =
        category === "All" ||
        expenseCategory ===
          category.toLowerCase();

      return (
        matchesSearch &&
        matchesCategory
      );
    });

    return [...result].sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return (
            new Date(a.date).getTime() -
            new Date(b.date).getTime()
          );

        case "highest":
          return (
            Number(b.amount) -
            Number(a.amount)
          );

        case "lowest":
          return (
            Number(a.amount) -
            Number(b.amount)
          );

        case "newest":
        default:
          return (
            new Date(b.date).getTime() -
            new Date(a.date).getTime()
          );
      }
    });
  }, [
    expenses,
    search,
    category,
    sortBy
  ]);

  const filtersActive =
    Boolean(search.trim()) ||
    category !== "All" ||
    sortBy !== "newest";

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setSortBy("newest");
  };

  const handleEdit = (expense) => {
    if (typeof onEdit === "function") {
      onEdit(expense);
    }
  };

  const handleDelete = (expenseId) => {
    if (
      typeof onDelete === "function" &&
      expenseId
    ) {
      onDelete(expenseId);
    }
  };

  return (
    <div className="expense-list">
      <div className="section-heading expense-list-heading">
        <div>
          <span className="section-eyebrow">
            Transaction history
          </span>

          <h2>All Expenses</h2>

          <p>
            Search, filter and manage your recorded expenses.
          </p>
        </div>

        <span
          className="expense-count"
          aria-label={`${filteredExpenses.length} expenses shown`}
        >
          {filteredExpenses.length}{" "}
          {filteredExpenses.length === 1
            ? "expense"
            : "expenses"}
        </span>
      </div>

      {expenses.length > 0 && (
        <div className="expense-filters">
          <div className="filter-field">
            <label htmlFor="expense-search">
              Search
            </label>

            <input
              id="expense-search"
              type="search"
              placeholder="Search category, description or amount..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              autoComplete="off"
            />
          </div>

          <CustomSelect
            id="expense-category-filter"
            label="Category"
            value={category}
            options={categoryOptions}
            onChange={setCategory}
          />

          <CustomSelect
            id="expense-sort"
            label="Sort by"
            value={sortBy}
            options={sortOptions}
            onChange={setSortBy}
          />
        </div>
      )}

      {filtersActive &&
        expenses.length > 0 && (
          <button
            className="clear-filters-button"
            type="button"
            onClick={clearFilters}
          >
            Clear filters
          </button>
        )}

      {filteredExpenses.length === 0 ? (
        <div className="empty-state">
          <div
            className="empty-state-icon"
            aria-hidden="true"
          >
            ₹
          </div>

          <h3>
            {expenses.length === 0
              ? "No expenses yet"
              : "No matching expenses"}
          </h3>

          <p>
            {expenses.length === 0
              ? "Add your first expense to start tracking your spending."
              : "Try changing your search or filter options."}
          </p>

          {expenses.length > 0 && (
            <button
              className="secondary-action"
              type="button"
              onClick={clearFilters}
            >
              Reset filters
            </button>
          )}
        </div>
      ) : (
        <div className="expense-items">
          {filteredExpenses.map(
            (expense) => (
              <article
                key={expense._id}
                className="expense-item"
              >
                <div className="expense-main">
                  <div
                    className="expense-icon"
                    aria-hidden="true"
                  >
                    ₹
                  </div>

                  <div className="expense-details">
                    <h3>
                      {formatCurrency(
                        expense.amount
                      )}
                    </h3>

                    <div className="expense-meta">
                      <span className="expense-category">
                        {expense.category ||
                          "Uncategorized"}
                      </span>

                      <span>
                        {formatDate(
                          expense.date
                        )}
                      </span>
                    </div>

                    <p>
                      {expense.description?.trim() ||
                        "No description"}
                    </p>
                  </div>
                </div>

                <div className="expense-actions">
                  <button
                    className="edit-button"
                    type="button"
                    onClick={() =>
                      handleEdit(expense)
                    }
                    aria-label={`Edit expense ${formatCurrency(
                      expense.amount
                    )}`}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-button"
                    type="button"
                    onClick={() =>
                      handleDelete(
                        expense._id
                      )
                    }
                    aria-label={`Delete expense ${formatCurrency(
                      expense.amount
                    )}`}
                  >
                    Delete
                  </button>
                </div>
              </article>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default ExpenseList;