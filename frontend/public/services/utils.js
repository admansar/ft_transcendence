async function verifyToken(token) {
    // const response = await fetch('http://localhost:8000/api/token/verify/', {
    const response = await fetch('/api/auth/token/verify/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
    })
    console.log('verifyToken', response.ok);
    return response.ok;
}

export async function makeAuthRequest(url, options = {}) {
    options.credentials = 'include';

    let token = await getToken();
    console.log('token', token);
    let response = await verifyToken(token);
    if (!response) {
        // const refreshRes = await fetch('http://localhost:8000/api/auth/refresh/', {
        const refreshRes = await fetch('/api/auth/refresh/', {
            method: 'POST',
            credentials: 'include'
        })
        if (refreshRes.ok) {
            response = await fetch(url, options)
        } else {
            console.log('Session expired, please login again');
            return;
        }
    }
    response = await fetch(url, options);
    return response
}

async function getToken() {
    const response = await fetch('/api/auth/me', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });
    const data = await response.json();
    return data.access;
}

export async function isAuth() {
    // const response = await fetch('http://localhost:8000/api/accounts/me', {
    const response = await fetch('/api/auth/me', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });
    if (response.ok) {
        return true;
    }
    return false;
}