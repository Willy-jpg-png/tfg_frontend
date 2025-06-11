import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchRestaurantOrders } from "../services/orderService";

export default function RestaurantPanel() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [orders, setOrders] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [error, setError] = useState("");
    const pageSize = 5;
    const restaurantId = localStorage.getItem("userId");

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) setUsername(storedUsername);
        if (restaurantId) loadOrders();
    }, [pageNumber]);

    const loadOrders = async () => {
        try {
            const data = await fetchRestaurantOrders(restaurantId, pageNumber, pageSize);
            setOrders(data.content || []);
            setTotalElements(data.totalElements || 0);
        } catch (err) {
            setError("Error al cargar los pedidos");
        }
    };

    const totalPages = Math.ceil(totalElements / pageSize);

    return (
        <aside className="fixed top-0 right-0 h-full w-64 bg-white shadow-lg border-l z-40 p-4 overflow-y-auto">
            <div className="flex items-center gap-2 text-blue-700 font-bold text-xl mb-6">
                🍽️ {username}
            </div>

            <button
                onClick={() => {
                    localStorage.clear();
                    navigate("/");
                }}
                className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition mb-4"
            >
                Cerrar sesión
            </button>

            <h3 className="text-lg font-semibold text-emerald-600 mb-2">Pedidos</h3>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <ul className="space-y-2">
                {orders.map((order) => (
                    <li key={order.id} className="border p-2 rounded text-sm bg-emerald-50">
                        <p><strong>Cliente:</strong> {order.customer?.name}</p>
                        <p><strong>Repartidor:</strong> {order.deliveryPerson?.name}</p>
                        <p><strong>Dirección:</strong> {order.customer?.address}</p>
                        <p><strong>Estado:</strong> {order.orderStatus}</p>
                        <p><strong>Total:</strong> {order.totalPrice?.toFixed(2)} €</p>
                    </li>
                ))}
            </ul>

            {totalPages > 1 && (
                <div className="flex justify-center mt-4 gap-2">
                    <button
                        disabled={pageNumber === 0}
                        onClick={() => setPageNumber((prev) => Math.max(0, prev - 1))}
                        className="px-2 py-1 bg-blue-500 text-white rounded text-xs disabled:opacity-50"
                    >
                        ←
                    </button>
                    <button
                        disabled={pageNumber >= totalPages - 1}
                        onClick={() => setPageNumber((prev) => prev + 1)}
                        className="px-2 py-1 bg-blue-500 text-white rounded text-xs disabled:opacity-50"
                    >
                        →
                    </button>
                </div>
            )}
        </aside>
    );
}
