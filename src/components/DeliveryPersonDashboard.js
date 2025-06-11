import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DeliveryPersonPanel from "./DeliveryPersonPanel";
import { fetchUnassignedOrders, assignOrderToDeliveryPerson } from "../services/orderService";

export default function DeliveryPersonDashboard() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [orders, setOrders] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [error, setError] = useState("");
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const pageSize = 5;
    const deliveryPersonId = localStorage.getItem("userId");

    useEffect(() => {
        const userRole = localStorage.getItem("role");
        const user = localStorage.getItem("username");
        if (!user || userRole !== "DELIVERY_PERSON") {
            navigate("/");
        } else {
            setUsername(user);
        }
    }, [navigate]);

    useEffect(() => {
        loadOrders();
    }, [pageNumber]);

    const loadOrders = async () => {
        try {
            const data = await fetchUnassignedOrders(pageNumber, pageSize);

            if ((data.content || []).length === 0 && pageNumber > 0) {
                setPageNumber((prev) => prev - 1);
                return;
            }

            setOrders(data.content || []);
            setTotalElements(data.totalElements || 0);
        } catch (err) {
            setError(err.message || "Error al cargar pedidos");
        }
    };

    const handleAssignOrder = async (orderId) => {
        try {
            await assignOrderToDeliveryPerson(orderId, deliveryPersonId);
            await loadOrders();
            setRefreshTrigger(prev => prev + 1);
        } catch (err) {
            alert("Error al asignarse el pedido.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-100 to-blue-100 px-4 py-8">
            <DeliveryPersonPanel refreshTrigger={refreshTrigger} />
            <div className="max-w-4xl mr-72 mx-auto bg-white p-6 rounded-2xl shadow-xl">
                <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
                    Selección de pedidos
                </h1>

                {error && <p className="text-red-600 text-center">{error}</p>}

                <ul className="space-y-4">
                    {orders.map((order) => (
                        <li key={order.id} className="border rounded p-4 shadow bg-white flex justify-between items-center gap-4">
                            <div>
                                <p><strong>Cliente:</strong> {order.customer?.name || "Desconocido"}</p>
                                <p><strong>Dirección de entrega:</strong> {order.customer?.street || "Desconocida"}</p>
                                <p><strong>Restaurante:</strong> {order.restaurant?.name || "Desconocido"}</p>
                                <p><strong>Dirección del restaurante:</strong> {order.restaurant?.street || "Desconocida"}</p>
                            </div>
                            <button
                                onClick={() => handleAssignOrder(order.id)}
                                className="self-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Seleccionar pedido
                            </button>
                        </li>
                    ))}
                </ul>

                {totalElements > pageSize && (
                    <div className="flex justify-center mt-6 gap-4">
                        <button
                            onClick={() => setPageNumber((prev) => Math.max(0, prev - 1))}
                            disabled={pageNumber === 0}
                            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                        >
                            Anterior
                        </button>
                        <button
                            onClick={() => setPageNumber((prev) => prev + 1)}
                            disabled={(pageNumber + 1) * pageSize >= totalElements}
                            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                        >
                            Siguiente
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
