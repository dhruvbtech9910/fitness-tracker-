// Base API configuration and request client for Spring Boot REST backend integration

const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || "http://localhost:8080/api";

/**
 * Standard HTTP Request handler
 * Ready to connect with Spring Boot @CrossOrigin REST Controllers
 */
async function request(endpoint, { method = "GET", body = null, headers = {} } = {}) {
  const token = localStorage.getItem("fitpulse_token");

  const config = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    // If backend is not running or unreachable, log notice and propagate error
    // so service layer can seamlessly use mock fallback data
    console.debug(`API request to ${endpoint} failed (backend offline or unavailable). Falling back to mock data.`, error.message);
    throw error;
  }
}

export const api = {
  get: (endpoint, headers) => request(endpoint, { method: "GET", headers }),
  post: (endpoint, body, headers) => request(endpoint, { method: "POST", body, headers }),
  put: (endpoint, body, headers) => request(endpoint, { method: "PUT", body, headers }),
  delete: (endpoint, headers) => request(endpoint, { method: "DELETE", headers }),
  BASE_URL: API_BASE_URL,
};

export default api;
