const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export async function fetchRestaurants(userId, pageNumber = 0, pageSize = 5) {
    const res = await fetch(
        `${API_BASE_URL}/v1/rep-eat/users/${userId}/restaurants?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Error al cargar los restaurantes");
    }

    return await res.json(); // será un objeto tipo PagedRestaurantRest
}
