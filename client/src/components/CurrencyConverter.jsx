import { useState } from "react";
import { convertCurrency } from "../services/currencyApi";

function CurrencyConverter() {
  const [amount, setAmount] = useState("");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("INR");

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConvert = async (event) => {
    event.preventDefault();

    setError("");
    setResult(null);
    setLoading(true);

    try {
      const data = await convertCurrency(
        from,
        to,
        amount
      );

      setResult(data.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Currency Converter</h2>

      <form onSubmit={handleConvert}>
        <div>
          <label>Amount</label>

          <input
            type="number"
            min="1"
            value={amount}
            onChange={(event) =>
              setAmount(event.target.value)
            }
            required
          />
        </div>

        <div>
          <label>From</label>

          <select
            value={from}
            onChange={(event) =>
              setFrom(event.target.value)
            }
          >
            <option value="USD">USD</option>
            <option value="INR">INR</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>

        <div>
          <label>To</label>

          <select
            value={to}
            onChange={(event) =>
              setTo(event.target.value)
            }
          >
            <option value="INR">INR</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Converting..." : "Convert"}
        </button>
      </form>

      {error && (
        <p>{error}</p>
      )}

      {result && (
        <div>
          <h3>Conversion Result</h3>

          <p>
            {result.amount} {result.from}
            {" = "}
            {result.convertedAmount.toFixed(2)}{" "}
            {result.to}
          </p>

          <p>
            Exchange Rate:{" "}
            {result.exchangeRate}
          </p>
        </div>
      )}
    </div>
  );
}

export default CurrencyConverter;