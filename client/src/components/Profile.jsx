import { useEffect, useState } from "react";

const API_URL = `${import.meta.env.VITE_API_URL}/api/users`;

function Profile({ onBack, onLogout }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Authentication token not found.");
        }

        const response = await fetch(`${API_URL}/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result?.message || "Failed to load profile."
          );
        }

        setProfile(result?.data || null);
      } catch (error) {
        setError(
          error?.message || "Failed to load profile."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="app">
        <main className="page-container">
          <div className="card">
            <p>Loading profile...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <main className="page-container">
          <div className="card">
            <div
              className="error"
              role="alert"
              aria-live="polite"
            >
              {error}
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={onBack}
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="app">
        <main className="page-container">
          <div className="card">
            <p>Profile information is unavailable.</p>

            <div className="form-actions">
              <button
                type="button"
                onClick={onBack}
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>Smart Expense Tracker</h1>
          <p>Account Profile</p>
        </div>

        <div className="header-actions">
          <button
            type="button"
            onClick={onBack}
          >
            Dashboard
          </button>

          <button
            type="button"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="page-container">
        <div className="card">
          <div className="section-heading">
            <div>
              <span className="section-eyebrow">
                Account
              </span>

              <h2>My Profile</h2>

              <p>
                View your Smart Expense Tracker account
                information.
              </p>
            </div>
          </div>

          <div className="profile-content">
            <div className="profile-avatar">
              {profile.profilePicture ? (
                <img
                  src={profile.profilePicture}
                  alt={`${profile.name}'s profile`}
                />
              ) : (
                <span aria-hidden="true">
                  {profile.name?.charAt(0)?.toUpperCase() || "U"}
                </span>
              )}
            </div>

            <div className="profile-details">
              <div>
                <span>Name</span>
                <strong>{profile.name}</strong>
              </div>

              <div>
                <span>Email</span>
                <strong>{profile.email}</strong>
              </div>

              <div>
                <span>Email verification</span>

                <strong>
                  {profile.isEmailVerified
                    ? "Verified"
                    : "Not verified"}
                </strong>
              </div>

              {profile.createdAt && (
                <div>
                  <span>Account created</span>

                  <strong>
                    {new Date(
                      profile.createdAt
                    ).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric"
                    })}
                  </strong>
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={onBack}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>Smart Expense Tracker</p>
      </footer>
    </div>
  );
}

export default Profile;