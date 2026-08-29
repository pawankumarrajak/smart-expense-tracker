const API_URL = `${import.meta.env.VITE_API_URL}/api/expenses`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication required");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };
};

const parseResponse = async (response) => {
  const contentType =
    response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return {
    message: "Unexpected server response"
  };
};

const handleResponse = async (
  response,
  fallbackMessage = "Request failed"
) => {
  const result = await parseResponse(response);

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.reload();

      throw new Error(
        "Session expired. Please login again."
      );
    }

    throw new Error(
      result.message || fallbackMessage
    );
  }

  return result;
};

const request = async (
  url,
  options = {},
  fallbackMessage = "Request failed"
) => {
  try {
    const response = await fetch(url, options);

    return await handleResponse(
      response,
      fallbackMessage
    );
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Unable to connect to the server. Please try again."
      );
    }

    throw error;
  }
};

export const getExpenses = async () => {
  return request(
    API_URL,
    {
      headers: getAuthHeaders()
    },
    "Failed to fetch expenses"
  );
};

export const createExpense = async (expenseData) => {
  return request(
    API_URL,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(expenseData)
    },
    "Failed to create expense"
  );
};

export const updateExpense = async (
  id,
  expenseData
) => {
  return request(
    `${API_URL}/${id}`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(expenseData)
    },
    "Failed to update expense"
  );
};

export const deleteExpense = async (id) => {
  return request(
    `${API_URL}/${id}`,
    {
      method: "DELETE",
      headers: getAuthHeaders()
    },
    "Failed to delete expense"
  );
};