import { useEffect, useState } from "react";

function VerifyEmail({ onVerified }) {
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (!token) {
        setStatus("error");
        setMessage("Invalid verification link.");
        return;
      }

      try {
        const apiUrl = import.meta.env.VITE_API_URL;

        const response = await fetch(
          `${apiUrl}/api/auth/verify-email?token=${encodeURIComponent(token)}`
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result?.message || "Email verification failed."
          );
        }

        setStatus("success");
        setMessage(
          result?.message ||
            "Email verified successfully. You can now login."
        );
      } catch (error) {
        setStatus("error");
        setMessage(
          error?.message ||
            "Email verification failed. Please try again."
        );
      }
    };

    verifyEmail();
  }, []);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-logo" aria-hidden="true">
            ₹
          </div>

          <div>
            <h1>Smart Expense Tracker</h1>
            <p>Track smarter. Spend better.</p>
          </div>
        </div>

        <div className="auth-heading">
          {status === "loading" && (
            <>
              <h2>Verifying your email...</h2>
              <p>Please wait a moment.</p>
            </>
          )}

          {status === "success" && (
            <>
              <h2>Email verified successfully</h2>
              <p>{message}</p>

              <button
                type="button"
                className="auth-submit"
                onClick={onVerified}
              >
                Go to Login
              </button>
            </>
          )}

          {status === "error" && (
            <>
              <h2>Verification failed</h2>
              <p>{message}</p>

              <button
                type="button"
                className="auth-submit"
                onClick={onVerified}
              >
                Go to Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
