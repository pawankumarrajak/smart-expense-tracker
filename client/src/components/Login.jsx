import { useState } from "react";
import { loginUser } from "../services/authApi";

function Login({ onLogin, onSwitchToRegister }) {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await loginUser({
        email,
        password
      });

      const token = result?.data?.token;
      const user = result?.data?.user;

      if (!token || !user) {
        throw new Error(
          "Invalid login response. Please try again."
        );
      }

      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      onLogin(user);
    } catch (error) {
      setError(
        error?.message ||
          "Login failed. Please check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-brand">
          <div
            className="auth-logo"
            aria-hidden="true"
          >
            ₹
          </div>

          <div>
            <h1>Smart Expense Tracker</h1>
            <p>Track smarter. Spend better.</p>
          </div>
        </div>

        <div className="auth-heading">
          <h2>Welcome back</h2>
          <p>Login to manage your expenses.</p>
        </div>

        {error && (
          <div
            className="auth-error"
            role="alert"
            aria-live="polite"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="login-email">
              Email address
            </label>

            <input
              id="login-email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              inputMode="email"
              spellCheck="false"
              disabled={loading}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="login-password">
              Password
            </label>

            <input
              id="login-password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              minLength={6}
              disabled={loading}
              required
            />
          </div>

          <button
            className="auth-submit"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : "Login"}
          </button>
        </form>

        <div className="auth-switch">
          <span>Don't have an account?</span>

          <button
            type="button"
            className="auth-link"
            onClick={onSwitchToRegister}
            disabled={loading}
          >
            Create account
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;