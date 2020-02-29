const headers = {
  'Content-Type': 'application/json',
};

const baseUrl = process.env.REACT_APP_BASE_URL ?? 'http://localhost:8080/api/';

async function postRequest(payload, uri) {
  const token = localStorage.getItem('token');
  const url = baseUrl + uri;
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      ...headers,
      authorization: `Bearer ${token}`,
    },
  });
  return response.json();
}

async function getRequest(uri, token = null) {
  const usedToken = token || localStorage.getItem('token');
  const url = baseUrl + uri;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      ...headers,
      authorization: `Bearer ${usedToken}`,
    },
  });
  return response.json();
}

export async function auth(payload) {
  const url = `${baseUrl}auth/login`;
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers,
  });
  return response.json();
}

export async function validate(token) {
  const uri = 'auth/validate';
  return getRequest(uri, token);
}

export async function signin(payload) {
  const uri = 'auth/signin';
  return postRequest(payload, uri);
}

export async function getUsers() {
  const uri = 'users';
  return getRequest(uri);
}

export async function getTickets() {
  const uri = 'tickets';
  return getRequest(uri);
}

export async function postTicket(payload) {
  const uri = 'tickets';
  return postRequest(payload, uri);
}

export async function editTicket(payload) {
  const uri = 'tickets/edit';
  return postRequest(payload, uri);
}

export async function deleteTicket(payload) {
  const uri = 'tickets/delete';
  return postRequest(payload, uri);
}

export async function giveMeTickets() {
  const uri = 'tickets/more';
  return getRequest(uri);
}

export async function assignTicket(payload) {
  const uri = 'tickets/assign';
  return postRequest(payload, uri);
}
