const BACKEND_BASE_URL = "https://gdinnovations-api.onrender.com/api"

export default async function handler(req, res) {
  const { path = [] } = req.query
  const targetPath = Array.isArray(path) ? path.join("/") : path
  const searchIndex = req.url.indexOf("?")
  const queryString = searchIndex >= 0 ? req.url.slice(searchIndex) : ""
  const targetUrl = `${BACKEND_BASE_URL}/${targetPath}${queryString}`

  const headers = {}
  if (req.headers.authorization) {
    headers.Authorization = req.headers.authorization
  }
  if (req.headers["content-type"]) {
    headers["Content-Type"] = req.headers["content-type"]
  }

  const fetchOptions = {
    method: req.method,
    headers,
  }

  if (!["GET", "HEAD"].includes(req.method)) {
    fetchOptions.body =
      typeof req.body === "string" ? req.body : JSON.stringify(req.body || {})
  }

  try {
    const response = await fetch(targetUrl, fetchOptions)
    const contentType = response.headers.get("content-type") || ""
    const responseText = await response.text()

    if (contentType) {
      res.setHeader("content-type", contentType)
    }

    res.status(response.status).send(responseText)
  } catch (error) {
    res.status(502).json({
      message: "Unable to reach backend service.",
    })
  }
}
