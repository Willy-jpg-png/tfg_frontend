const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

async function sendRequest(url, data) {
    const response = await fetch(`${API_BASE_URL}${url}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Error al registrar usuario");
    }
}

export function signUpCustomer(data) {
    return sendRequest("/v1/rep-eat/users/signUpCustomer", data);
}

export function signUpRestaurant(data) {
    return sendRequest("/v1/rep-eat/users/signUpRestaurant", data);
}

export function signUpDeliveryPerson(data) {
    return sendRequest("/v1/rep-eat/users/signUpDeliveryPerson", data);
}
