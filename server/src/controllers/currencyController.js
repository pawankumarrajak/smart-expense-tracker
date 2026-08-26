const {
  getExchangeRate
} = require("../services/currencyService");

const convertCurrency = async (req, res) => {
  try {
    const { from, to, amount } = req.query;

    if (!from || !to || !amount) {
      return res.status(400).json({
        success: false,
        message: "from, to and amount are required"
      });
    }

    const numericAmount = Number(amount);

    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be a positive number"
      });
    }

    const result = await getExchangeRate(
      from.toUpperCase(),
      to.toUpperCase()
    );

    const convertedAmount =
      numericAmount * result.conversion_rate;

    res.status(200).json({
      success: true,
      data: {
        from: from.toUpperCase(),
        to: to.toUpperCase(),
        amount: numericAmount,
        exchangeRate: result.conversion_rate,
        convertedAmount
      }
    });
  } catch (error) {
    console.error("Currency conversion error:", error.message);

    res.status(500).json({
      success: false,
      message: "Currency conversion failed"
    });
  }
};

module.exports = {
  convertCurrency
};