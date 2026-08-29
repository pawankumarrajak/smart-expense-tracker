const API_URL = `${import.meta.env.VITE_API_URL}/api/auth`;

const parseResponse = async (response) => {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return {
    message: "Unexpected server response"
  };
};

const handleResponse = async (response, fallbackMessage) => {
  const result = await parseResponse(response);

  if (!response.ok) {
    throw new Error(
      result.message || fallbackMessage
    );
  }

  return result;
};

export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(credentials)
    });

    return await handleResponse(
      response,
      "Login failed"
    );
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Unable to connect to the server. Please try again."
      );
    }

    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userData)
    });

    return await handleResponse(
      response,
      "Registration failed"
    );
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Unable to connect to the server. Please try again."
      );
    }

    throw error;
  }
};