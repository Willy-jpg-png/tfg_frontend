import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export async function fetchProductAddings(restaurantId, productId, pageNumber = 0, pageSize = 5) {
    const response = await axios.get(
        `${API_BASE_URL}/v1/rep-eat/restaurant/${restaurantId}/product/${productId}/addings`,
        {
            params: { pageNumber, pageSize },
        }
    );
    return response.data;
}

export async function fetchRestaurantAddings(restaurantId, pageNumber = 0, pageSize = 5) {
    const response = await axios.get(
        `${API_BASE_URL}/v1/rep-eat/restaurant/${restaurantId}/addings`,
        {
            params: { pageNumber, pageSize },
        }
    );
    return response.data;
}
