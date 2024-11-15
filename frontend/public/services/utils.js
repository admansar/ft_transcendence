async function verifyToken(token) {
    const response = await fetch('http://localhost:8000/api/token/verify/', {
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

    let response = await fetch(url, options);
    // console.log(await response.json());
    let data = await response.json();
    let token = data.access;
    console.log('token', token);
    response = await verifyToken(token);
    if (!response) {
        const refreshRes = await fetch('http://localhost:8000/api/auth/refresh/', {
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

export async function isAuth() {
    const response = await fetch('http://localhost:8000/api/accounts/me', {
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