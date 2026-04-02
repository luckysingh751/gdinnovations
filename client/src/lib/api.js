const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

export async function apiRequest(path, options = {}) {
  const { headers: customHeaders = {}, ...restOptions } = options

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...restOptions,
    headers: {
      "Content-Type": "application/json",
      ...customHeaders,
    },
  })

  const contentType = response.headers.get("content-type") || ""
  const data = contentType.includes("application/json")
    ? await response.json()
    : null

  if (!response.ok) {
    throw new Error(data?.message || "Request failed")
  }

  return data
}

export function authHeaders(token) {
  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {}
}
