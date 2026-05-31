const isProd = import.meta.env.PROD;

export const API_URL = isProd
  ? "https://pinpoint-backend-cq9k.onrender.com/api"
  : "http://localhost:3000/api";

export const SOCKET_URL = isProd
  ? "https://pinpoint-backend-cq9k.onrender.com"
  : "http://localhost:3000";

export const WIDGET_URL = isProd
  ? "https://pinpoint-backend-cq9k.onrender.com/widget.js"
  : "http://localhost:5500/widget.js";
