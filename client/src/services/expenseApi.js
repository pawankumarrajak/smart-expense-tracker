const API_URL = `${import.meta.env.VITE_API_URL}/api/expenses`;

export const getExpenses = async () => {
  const response = await fetch(API_URL);

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to fetch expenses"
    );
  }

  return result;
};

export const createExpense = async (expenseData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(expenseData)
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to create expense"
    );
  }

  return result;
};

export const updateExpense = async (id, expenseData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(expenseData)
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to update expense"
    );
  }

  return result;
};

export const deleteExpense = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to delete expense"
    );
  }

  return result;
};