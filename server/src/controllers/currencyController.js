const {
  getExchangeRate
} = require("../services/currencyService");

const convertCurrency = async (req, res, next) => {
  try {
    const { from, to, amount } = req.query;

    if (!from || !to || !amount) {
      const error = new Error(
        "from, to and amount are required"
      );

      error.statusCode = 400;
      return next(error);
    }

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      const error = new Error(
        "Amount must be a positive number"
      );

      error.statusCode = 400;
      return next(error);
    }

    const result = await getExchangeRate(
      from.toUpperCase(),
      to.toUpperCase()
    );

    const convertedAmount = Number(
      (numericAmount * result.conversion_rate).toFixed(2)
    );

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
    next(error);
  }
};

module.exports = {
  convertCurrency
};