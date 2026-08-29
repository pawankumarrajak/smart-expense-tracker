const API_URL =
  `${import.meta.env.VITE_API_URL}/api/currency`;

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

export const convertCurrency = async (
  from,
  to,
  amount
) => {
  if (!from || !to) {
    throw new Error(
      "Source and target currencies are required"
    );
  }

  const numericAmount = Number(amount);

  if (
    !Number.isFinite(numericAmount) ||
    numericAmount <= 0
  ) {
    throw new Error(
      "Amount must be greater than 0"
    );
  }

  const params = new URLSearchParams({
    from: from.toUpperCase(),
    to: to.toUpperCase(),
    amount: String(numericAmount)
  });

  try {
    const response = await fetch(
      `${API_URL}/convert?${params.toString()}`
    );

    const result = await parseResponse(response);

    if (!response.ok) {
      throw new Error(
        result.message ||
          "Currency conversion failed"
      );
    }

    return result;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Unable to connect to the server. Please try again."
      );
    }

    throw error;
  }
};