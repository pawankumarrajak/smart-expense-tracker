import { useState } from "react";
import { convertCurrency } from "../services/currencyApi";
import CustomSelect from "./CustomSelect";

const MAX_AMOUNT = 100000000;

const currencyOptions = [
  {
    value: "USD",
    label: "USD — US Dollar"
  },
  {
    value: "INR",
    label: "INR — Indian Rupee"
  },
  {
    value: "EUR",
    label: "EUR — Euro"
  },
  {
    value: "GBP",
    label: "GBP — British Pound"
  }
];

function CurrencyConverter() {
  const [amount, setAmount] = useState("");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("INR");

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConvert = async (event) => {
    event.preventDefault();

    const numericAmount = Number(amount);

    if (
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      setError(
        "Please enter a valid amount greater than 0"
      );
      setResult(null);
      return;
    }

    if (numericAmount > MAX_AMOUNT) {
      setError(
        "Amount cannot exceed ₹10,00,00,000"
      );
      setResult(null);
      return;
    }

    if (from === to) {
      setResult({
        amount: numericAmount,
        from,
        convertedAmount: numericAmount,
        to,
        exchangeRate: 1
      });

      setError("");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const response = await convertCurrency(
        from,
        to,
        numericAmount
      );

      if (!response?.data) {
        throw new Error(
          "Invalid response from currency service"
        );
      }

      setResult(response.data);
    } catch (error) {
      setError(
        error?.message ||
          "Unable to convert currency. Please try again."
      );

      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
    setResult(null);
    setError("");
  };

  const handleAmountChange = (event) => {
    const value = event.target.value;

    setAmount(value);
    setResult(null);

    if (error) {
      setError("");
    }
  };

  const handleFromChange = (value) => {
    setFrom(value);
    setResult(null);
    setError("");
  };

  const handleToChange = (value) => {
    setTo(value);
    setResult(null);
    setError("");
  };

  return (
    <section className="converter">
      <div className="section-heading">
        <div>
          <span className="section-eyebrow">
            Quick tool
          </span>

          <h2>Currency Converter</h2>

          <p>
            Convert currencies using the latest
            available exchange rate.
          </p>
        </div>
      </div>

      {error && (
        <div
          className="form-error"
          role="alert"
          aria-live="polite"
        >
          {error}
        </div>
      )}

      <form
        className="converter-form"
        onSubmit={handleConvert}
      >
        <div className="form-field">
          <label htmlFor="currency-amount">
            Amount
          </label>

          <input
            id="currency-amount"
            type="number"
            min="0.01"
            max={MAX_AMOUNT}
            step="0.01"
            inputMode="decimal"
            placeholder="Enter amount"
            value={amount}
            onChange={handleAmountChange}
            disabled={loading}
            required
          />
        </div>

        <div className="converter-row">
          <CustomSelect
            id="currency-from"
            label="From"
            value={from}
            options={currencyOptions}
            onChange={handleFromChange}
            disabled={loading}
          />

          <button
            type="button"
            className="swap-button"
            onClick={handleSwap}
            disabled={loading}
            aria-label="Swap currencies"
            title="Swap currencies"
          >
            ⇄
          </button>

          <CustomSelect
            id="currency-to"
            label="To"
            value={to}
            options={currencyOptions}
            onChange={handleToChange}
            disabled={loading}
          />
        </div>

        <button
          className="primary-button converter-button"
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Converting..."
            : "Convert Currency"}
        </button>
      </form>

      {result && (
        <div
          className="conversion-result"
          aria-live="polite"
        >
          <span className="result-label">
            Conversion result
          </span>

          <div className="result-main">
            <strong>
              {Number(result.amount).toFixed(2)}{" "}
              {result.from}
            </strong>

            <span
              className="result-arrow"
              aria-hidden="true"
            >
              →
            </span>

            <strong className="result-value">
              {Number(
                result.convertedAmount
              ).toFixed(2)}{" "}
              {result.to}
            </strong>
          </div>

          <div className="exchange-rate">
            <span>Exchange rate</span>

            <strong>
              {Number(
                result.exchangeRate
              ).toFixed(4)}
            </strong>
          </div>
        </div>
      )}
    </section>
  );
}

export default CurrencyConverter;