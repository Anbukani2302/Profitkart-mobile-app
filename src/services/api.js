import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_URL = 'http://localhost:5000';

const pendingGets = new Map();

async function readResponse(response) {
  const responseText = await response.text();
  if (!responseText) return null;

  try {
    return JSON.parse(responseText);
  } catch {
    throw new Error('The server returned an unreadable response.');
  }
}

async function request(path, { method = 'GET', body, authenticated = false } = {}) {
  if (API_URL.includes('YOUR_PC_IP')) {
    throw new Error('Set your computer LAN IP in src/services/api.js before connecting.');
  }

  const token = authenticated ? await AsyncStorage.getItem('token') : null;
  if (authenticated && !token) throw new Error('Your session has expired. Please sign in again.');

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
  } catch {
    throw new Error('Could not reach the server. Check that your phone and computer share Wi-Fi.');
  }

  const data = await readResponse(response);
  if (!response.ok) {
    throw new Error(data?.message || data?.error || `Request failed (${response.status}).`);
  }
  return data;
}

async function getOnce(path, authenticated = true) {
  const requestKey = `${path}:${authenticated}`;
  if (pendingGets.has(requestKey)) return pendingGets.get(requestKey);

  const pendingRequest = request(path, { authenticated });
  pendingGets.set(requestKey, pendingRequest);
  try {
    return await pendingRequest;
  } finally {
    if (pendingGets.get(requestKey) === pendingRequest) pendingGets.delete(requestKey);
  }
}

export function registerUser(name, email, password) {
  return request('/api/auth/register', {
    method: 'POST',
    body: { name, email, password },
  });
}

export function loginUser(email, password) {
  return request('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}

export async function getDashboard() {
  const result = await getOnce('/api/dashboard');
  return result?.data ?? result;
}

export async function getProducts() {
  const result = await getOnce('/api/products');
  const products = Array.isArray(result) ? result : result?.products ?? result?.data;
  if (!Array.isArray(products)) throw new Error('The products response has an unexpected format.');
  return products;
}

export async function getNotifications() {
  const result = await getOnce('/api/notifications');
  const notifications = Array.isArray(result) ? result : result?.notifications ?? result?.data;
  if (!Array.isArray(notifications)) {
    throw new Error('The notifications response has an unexpected format.');
  }
  return notifications;
}

export async function getProfile() {
  const result = await getOnce('/api/profile');
  return result?.profile ?? result?.user ?? result?.data ?? result;
}