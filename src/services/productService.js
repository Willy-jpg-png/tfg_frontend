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
