const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export async function fetchRestaurantProducts(restaurantId, pageNumber = 0, pageSize = 5) {
    const res = await fetch(
        `${API_BASE_URL}/v1/rep-eat/restaurant/${restaurantId}/products?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Error al cargar los productos");
    }

    return await res.json();
}

export async function fetchRestaurants(userId, pageNumber = 0, pageSize = 5) {
    const res = await fetch(
        `${API_BASE_URL}/v1/rep-eat/users/${userId}/restaurants?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Error al cargar los restaurantes");
    }

    return await res.json();
}

export async function updateProduct(restaurantId, productId, productData) {
    const res = await fetch(`${API_BASE_URL}/v1/rep-eat/restaurant/${restaurantId}/product/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData)
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Error al actualizar el producto");
    }
}

export async function deleteProduct(restaurantId, productId) {
    const res = await fetch(`${API_BASE_URL}/v1/rep-eat/restaurant/${restaurantId}/product/${productId}`, {
        method: "DELETE"
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Error al eliminar el producto");
    }
}

export async function createProduct(restaurantId, productData) {
    const res = await fetch(`${API_BASE_URL}/v1/rep-eat/restaurant/${restaurantId}/product`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData)
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Error al crear el producto");
    }
}

export async function updateProductAddings(restaurantId, productId, data) {
    const res = await fetch(
        `${API_BASE_URL}/v1/rep-eat/restaurant/${restaurantId}/product/${productId}/updateAddings`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }
    );

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Error al actualizar suplementos");
    }
}

export async function updateAdding(restaurantId, addingId, data) {
    const res = await fetch(`${API_BASE_URL}/v1/rep-eat/restaurant/${restaurantId}/adding/${addingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Error al actualizar el suplemento");
    }
}

export async function deleteAdding(restaurantId, addingId) {
    const res = await fetch(`${API_BASE_URL}/v1/rep-eat/restaurant/${restaurantId}/adding/${addingId}`, {
        method: "DELETE",
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Error al eliminar el suplemento");
    }
}

export async function createAdding(restaurantId, addingData) {
    const res = await fetch(`${API_BASE_URL}/v1/rep-eat/restaurant/${restaurantId}/adding`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addingData)
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Error al crear suplemento");
    }
}
