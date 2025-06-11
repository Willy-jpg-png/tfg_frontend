import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export async function fetchUnassignedOrders(pageNumber = 0, pageSize = 5) {
    const response = await axios.get(`${API_BASE_URL}/v1/rep-eat/orders`, {
        params: { pageNumber, pageSize },
    });
    return response.data;
}

export async function assignOrderToDeliveryPerson(orderId, deliveryPersonId) {
    const res = await fetch(`${API_BASE_URL}/v1/rep-eat/order/${orderId}/deliveryPerson/${deliveryPersonId}`, {
        method: "PATCH",
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Error al asignar pedido");
    }
}

export async function fetchCustomerOrders(customerId, pageNumber = 0, pageSize = 5) {
    const response = await fetch(
        `${API_BASE_URL}/v1/rep-eat/order/customer/${customerId}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    if (!response.ok) throw new Error("Error al obtener pedidos del cliente");
    return await response.json();
}

export async function fetchRestaurantOrders(restaurantId, pageNumber = 0, pageSize = 5) {
    const response = await fetch(
        `${API_BASE_URL}/v1/rep-eat/order/restaurant/${restaurantId}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    if (!response.ok) throw new Error("Error al obtener pedidos del restaurante");
    return await response.json();
}

export async function fetchDeliveryPersonOrders(deliveryPersonId, pageNumber = 0, pageSize = 5) {
    const response = await fetch(
        `${API_BASE_URL}/v1/rep-eat/order/deliveryPerson/${deliveryPersonId}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    if (!response.ok) throw new Error("Error al obtener pedidos del repartidor");
    return await response.json();
}

export async function updateOrderStatus(orderId, deliveryPersonId, orderStatus) {
    const response = await fetch(
        `${API_BASE_URL}/v1/rep-eat/order/${orderId}/deliveryPerson/${deliveryPersonId}/status`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ orderStatus }),
        }
    );

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Error al actualizar el estado");
    }
}

export async function createOrder(customerId, restaurantId, orderBody) {
    const response = await fetch(
        `${API_BASE_URL}/v1/rep-eat/order/customer/${customerId}/restaurant/${restaurantId}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(orderBody),
        }
    );

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Error al crear el pedido");
    }

    return response.json();
}



