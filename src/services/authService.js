const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export async function login({ username, password }) {
    const res = await fetch(`${API_BASE_URL}/v1/rep-eat/users/signIn`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Error al iniciar sesión");
    }

    return await res.json();
}
