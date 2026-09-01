import { useEffect, useState } from "react";

const API_URL = `${import.meta.env.VITE_API_URL}/api/users`;

const MAX_FILE_SIZE = 2 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp"
];

function Profile({
  onBack,
  onLogout,
  onProfileUpdated
}) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [removePicture, setRemovePicture] = useState(false);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /*
   * Load profile
   */
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error(
            "Authentication token not found."
          );
        }

        const response = await fetch(
          `${API_URL}/profile`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result?.message ||
              "Failed to load profile."
          );
        }

        const profileData =
          result?.data || null;

        setProfile(profileData);
        setName(profileData?.name || "");
      } catch (error) {
        setError(
          error?.message ||
            "Failed to load profile."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  /*
   * Start editing
   */
  const handleEdit = () => {
    setName(profile?.name || "");

    setSelectedImage(null);
    setPreviewUrl("");

    setRemovePicture(false);

    setError("");
    setSuccess("");

    setIsEditing(true);
  };

  /*
   * Cancel editing
   */
  const handleCancel = () => {
    setName(profile?.name || "");

    setSelectedImage(null);
    setPreviewUrl("");

    setRemovePicture(false);

    setError("");
    setSuccess("");

    setIsEditing(false);
  };

  /*
   * Choose new profile picture
   */
  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");
    setSuccess("");

    /*
     * Validate file type
     */
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError(
        "Only JPG, PNG, and WebP images are allowed."
      );

      event.target.value = "";

      return;
    }

    /*
     * Validate file size
     */
    if (file.size > MAX_FILE_SIZE) {
      setError(
        "Profile picture must be smaller than 2 MB."
      );

      event.target.value = "";

      return;
    }

    /*
     * Create preview
     */
    const objectUrl =
      URL.createObjectURL(file);

    setSelectedImage(file);
    setPreviewUrl(objectUrl);

    /*
     * Selecting a new picture cancels
     * remove-picture action.
     */
    setRemovePicture(false);
  };

  /*
   * Remove profile picture
   */
  const handleRemovePicture = () => {
    setSelectedImage(null);
    setPreviewUrl("");

    setRemovePicture(true);

    setError("");
    setSuccess("");
  };

  /*
   * Save profile
   */
  const handleSave = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const trimmedName = name.trim();

    /*
     * Validate name
     */
    if (trimmedName.length < 2) {
      setError(
        "Name must contain at least 2 characters."
      );

      return;
    }

    if (trimmedName.length > 50) {
      setError(
        "Name cannot exceed 50 characters."
      );

      return;
    }

    try {
      setSaving(true);

      const token =
        localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Authentication token not found."
        );
      }

      /*
       * Use FormData because profile picture
       * is uploaded as a file.
       */
      const formData = new FormData();

      formData.append(
        "name",
        trimmedName
      );

      /*
       * New picture
       */
      if (selectedImage) {
        formData.append(
          "profilePicture",
          selectedImage
        );
      }

      /*
       * Remove existing picture
       */
      if (
        removePicture &&
        !selectedImage
      ) {
        formData.append(
          "removeProfilePicture",
          "true"
        );
      }

      const response = await fetch(
        `${API_URL}/profile`,
        {
          method: "PUT",

          headers: {
            Authorization: `Bearer ${token}`
          },

          body: formData
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Failed to update profile."
        );
      }

      const updatedProfile =
        result?.data;

      if (!updatedProfile) {
        throw new Error(
          "Updated profile data is unavailable."
        );
      }

      /*
       * Update local profile state
       */
      setProfile(updatedProfile);

      setName(
        updatedProfile.name || ""
      );

      setSelectedImage(null);
      setPreviewUrl("");
      setRemovePicture(false);

      /*
       * Update localStorage user
       */
      const savedUser =
        JSON.parse(
          localStorage.getItem("user") ||
            "{}"
        );

      const updatedUser = {
        ...savedUser,
        ...updatedProfile
      };

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      /*
       * Notify App.jsx so dashboard
       * avatar updates immediately.
       */
      if (
        onProfileUpdated &&
        updatedProfile
      ) {
        onProfileUpdated(
          updatedProfile
        );
      }

      setIsEditing(false);

      setSuccess(
        "Profile updated successfully."
      );
    } catch (error) {
      setError(
        error?.message ||
          "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * Loading
   */
  if (loading) {
    return (
      <div className="app">
        <main className="page-container">
          <div className="card">
            <p>
              Loading profile...
            </p>
          </div>
        </main>
      </div>
    );
  }

  /*
   * Profile loading error
   */
  if (error && !profile) {
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

  /*
   * No profile
   */
  if (!profile) {
    return (
      <div className="app">
        <main className="page-container">
          <div className="card">
            <p>
              Profile information is
              unavailable.
            </p>

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

  /*
   * Decide which image to display
   */
  const displayedImage =
    previewUrl ||
    (!removePicture
      ? profile.profilePicture
      : "");

  return (
    <div className="app">

      {/* =========================================
          HEADER
          ========================================= */}
      <header className="header">
        <div className="header-inner">

          <div>
            <h1>
              Smart Expense Tracker
            </h1>

            <p>
              Account Profile
            </p>
          </div>

          <div className="header-actions">

            <button
              type="button"
              onClick={onBack}
              disabled={saving}
            >
              Dashboard
            </button>

            <button
              type="button"
              onClick={onLogout}
              disabled={saving}
            >
              Logout
            </button>

          </div>

        </div>
      </header>

      {/* =========================================
          MAIN
          ========================================= */}
      <main className="page-container">

        <div className="card profile-card">

          {/* Profile heading */}
          <div className="section-heading">

            <div>

              <span className="section-eyebrow">
                Account
              </span>

              <h2>
                My Profile
              </h2>

              <p>
                Manage your Smart Expense
                Tracker account information.
              </p>

            </div>

          </div>

          {/* Error */}
          {error && (
            <div
              className="error"
              role="alert"
              aria-live="polite"
            >
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div
              className="profile-success"
              role="status"
              aria-live="polite"
            >
              {success}
            </div>
          )}

          {/* =====================================
              PROFILE CONTENT
              ===================================== */}
          <div className="profile-content">

            {/* =================================
                PROFILE PICTURE
                ================================= */}
            <div className="profile-picture-column">

              <div className="profile-avatar">

                {displayedImage ? (
                  <img
                    src={displayedImage}
                    alt={`${profile.name}'s profile`}
                  />
                ) : (
                  <span
                    aria-hidden="true"
                  >
                    {profile.name
                      ?.trim()
                      ?.charAt(0)
                      ?.toUpperCase() ||
                      "U"}
                  </span>
                )}

              </div>

              {/* ===============================
                  EDIT MODE PICTURE ACTIONS
                  =============================== */}
              {isEditing && (
                <div className="profile-picture-actions">

                  <label
                    htmlFor="profile-picture"
                    className="secondary-action"
                  >
                    Choose Picture
                  </label>

                  <input
                    id="profile-picture"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={
                      handleImageChange
                    }
                    disabled={saving}
                    hidden
                  />

                  {/* Remove button */}
                  {(profile.profilePicture ||
                    selectedImage) &&
                    !removePicture && (
                      <button
                        type="button"
                        className="danger-action"
                        onClick={
                          handleRemovePicture
                        }
                        disabled={saving}
                      >
                        Remove Profile Picture
                      </button>
                    )}

                  {/* Restore picture action */}
                  {removePicture &&
                    profile.profilePicture && (
                      <button
                        type="button"
                        className="secondary-action"
                        onClick={() =>
                          setRemovePicture(
                            false
                          )
                        }
                        disabled={saving}
                      >
                        Keep Current Picture
                      </button>
                    )}

                </div>
              )}

              {!isEditing && (
                <p className="profile-picture-help">
                  Profile picture
                </p>
              )}

              {isEditing && (
                <p className="profile-picture-help">
                  JPG, PNG or WebP • Maximum 2 MB
                </p>
              )}

            </div>

            {/* =================================
                PROFILE DETAILS
                ================================= */}
            {!isEditing ? (
              <div className="profile-details">

                <div>
                  <span>
                    Name
                  </span>

                  <strong>
                    {profile.name}
                  </strong>
                </div>

                <div>
                  <span>
                    Email
                  </span>

                  <strong>
                    {profile.email}
                  </strong>
                </div>

                <div>
                  <span>
                    Email verification
                  </span>

                  <strong>
                    {profile.isEmailVerified
                      ? "Verified"
                      : "Not verified"}
                  </strong>
                </div>

                {profile.createdAt && (
                  <div>
                    <span>
                      Account created
                    </span>

                    <strong>
                      {new Date(
                        profile.createdAt
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "long",
                          year: "numeric"
                        }
                      )}
                    </strong>
                  </div>
                )}

              </div>
            ) : (

              /* =================================
                 EDIT FORM
                 ================================= */
              <form
                className="profile-edit-form"
                onSubmit={handleSave}
              >

                <div className="form-field">

                  <label
                    htmlFor="profile-name"
                  >
                    Name
                  </label>

                  <input
                    id="profile-name"
                    type="text"
                    value={name}
                    onChange={(event) =>
                      setName(
                        event.target.value
                      )
                    }
                    maxLength={50}
                    disabled={saving}
                    autoComplete="name"
                    autoFocus
                  />

                </div>

                <div className="form-field">

                  <label
                    htmlFor="profile-email"
                  >
                    Email
                  </label>

                  <input
                    id="profile-email"
                    type="email"
                    value={profile.email}
                    disabled
                    readOnly
                  />

                  <small>
                    Email cannot be changed here.
                  </small>

                </div>

                {/* Edit actions */}
                <div className="profile-edit-actions">

                  <button
                    type="submit"
                    className="primary-button"
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : "Save Changes"}
                  </button>

                  <button
                    type="button"
                    className="secondary-action"
                    onClick={
                      handleCancel
                    }
                    disabled={saving}
                  >
                    Cancel
                  </button>

                </div>

              </form>
            )}

          </div>

          {/* =====================================
              BOTTOM ACTIONS
              ===================================== */}
          {!isEditing && (
            <div className="form-actions profile-actions">

              <button
                type="button"
                className="primary-button"
                onClick={handleEdit}
              >
                Edit Profile
              </button>

              <button
                type="button"
                className="secondary-action"
                onClick={onBack}
              >
                Back to Dashboard
              </button>

            </div>
          )}

        </div>

      </main>

      {/* =========================================
          FOOTER
          ========================================= */}
      <footer className="footer">
        <div className="footer-inner">
          <p>
            Smart Expense Tracker
          </p>
        </div>
      </footer>

    </div>
  );
}

export default Profile;