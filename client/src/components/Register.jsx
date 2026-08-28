import { useState } from "react";
import { registerUser } from "../services/authApi";

function Register({ onRegister, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }));

    if (error) {
      setError("");
    }

    if (success) {
      setSuccess("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const name = formData.name
      .trim()
      .replace(/\s+/g, " ");

    const email = formData.email
      .trim()
      .toLowerCase();

    const password = formData.password;

    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    if (name.length < 2) {
      setError(
        "Name must contain at least 2 characters"
      );
      return;
    }

    if (name.length > 50) {
      setError(
        "Name cannot exceed 50 characters"
      );
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must contain at least 8 characters"
      );
      return;
    }

    if (password.length > 128) {
      setError(
        "Password cannot exceed 128 characters"
      );
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const result = await registerUser({
        name,
        email,
        password
      });

      const message =
        result?.message ||
        "Account created successfully";

      setSuccess(message);

      setFormData({
        name: "",
        email: "",
        password: ""
      });
    } catch (error) {
      setError(
        error?.message ||
          "Registration failed. Please try again."
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
          <h2>Create your account</h2>
          <p>
            Start managing your expenses today.
          </p>
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

        {success && (
          <div
            className="auth-success"
            role="status"
            aria-live="polite"
          >
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="register-name">
              Full name
            </label>

            <input
              id="register-name"
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
              minLength={2}
              maxLength={50}
              disabled={loading}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="register-email">
              Email address
            </label>

            <input
              id="register-email"
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
            <label htmlFor="register-password">
              Password
            </label>

            <input
              id="register-password"
              type="password"
              name="password"
              placeholder="Minimum 8 characters"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              minLength={8}
              maxLength={128}
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
              ? "Creating account..."
              : "Create account"}
          </button>
        </form>

        <div className="auth-switch">
          <span>
            Already have an account?
          </span>

          <button
            type="button"
            className="auth-link"
            onClick={onSwitchToLogin}
            disabled={loading}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;