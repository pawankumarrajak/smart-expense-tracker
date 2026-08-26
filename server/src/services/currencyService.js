const axios = require("axios");

const getExchangeRate = async (from, to) => {
  const apiKey = process.env.EXCHANGE_API_KEY;

  if (!apiKey) {
    throw new Error("Exchange API key is missing");
  }

  const url = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${from}/${to}`;

  const response = await axios.get(url);

  return response.data;
};

module.exports = {
  getExchangeRate
};