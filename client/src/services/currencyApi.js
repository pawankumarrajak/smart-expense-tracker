const API_URL =
  `${import.meta.env.VITE_API_URL}/api/currency`;

export const convertCurrency = async (
  from,
  to,
  amount
) => {
  const response = await fetch(
    `${API_URL}/convert?from=${from}&to=${to}&amount=${amount}`
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Currency conversion failed"
    );
  }

  return result;
};