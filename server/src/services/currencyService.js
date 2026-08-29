const axios = require("axios");

const getExchangeRate = async (from, to) => {
  const apiKey = process.env.EXCHANGE_API_KEY;

  if (!apiKey) {
    throw new Error("Exchange API configuration is missing");
  }

  if (!/^[A-Z]{3}$/.test(from) || !/^[A-Z]{3}$/.test(to)) {
    const error = new Error("Invalid currency code");
    error.statusCode = 400;
    throw error;
  }

  const url = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${from}/${to}`;

  try {
    const response = await axios.get(url, {
      timeout: 5000
    });

    if (
      !response.data ||
      response.data.result !== "success" ||
      typeof response.data.conversion_rate !== "number"
    ) {
      const error = new Error("Unable to fetch exchange rate");
      error.statusCode = 502;
      throw error;
    }

    return response.data;
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }

    if (error.code === "ECONNABORTED") {
      const timeoutError = new Error(
        "Currency service request timed out"
      );

      timeoutError.statusCode = 504;
      throw timeoutError;
    }

    const apiError = new Error(
      "Currency service is currently unavailable"
    );

    apiError.statusCode = 502;
    throw apiError;
  }
};

module.exports = {
  getExchangeRate
};