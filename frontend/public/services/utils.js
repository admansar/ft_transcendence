export async function makeAuthRequest(url, options = {}) {
    options.credentials = 'include';

    let response = await fetch(url, options);
    // console.log(await response.json());

    if (response.status === 401) {
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
    if (!response.ok) {
        throw new Error('Failed to make auth request')
    }
    return response
}