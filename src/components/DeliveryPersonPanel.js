import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    fetchDeliveryPersonOrders,
    updateOrderStatus,
} from "../services/orderService";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import ChatBox from "./ChatBox";

export default function DeliveryPersonPanel({ refreshTrigger }) {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [orders, setOrders] = useState([]);
    const [unreadMessages, setUnreadMessages] = useState({});
    const [pageNumber, setPageNumber] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [error, setError] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [newStatus, setNewStatus] = useState("");
    const [isSharingLocation, setIsSharingLocation] = useState(false);
    const intervalRef = useRef(null);
    const stompRef = useRef(null);

    const pageSize = 5;
    const deliveryPersonId = localStorage.getItem("userId");

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) setUsername(storedUsername);
        if (deliveryPersonId) loadOrders();
    }, [pageNumber, refreshTrigger]);

    useEffect(() => {
        if (orders.length === 0) return;

        const socket = new SockJS("http://localhost:8080/tfg/api/ws-chat");
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                orders.forEach((order) => {
                    client.subscribe(`/topic/chat/${order.id}`, (msg) => {
                        const incoming = JSON.parse(msg.body);
                        if (selectedOrder?.id !== order.id) {
                            setUnreadMessages((prev) => ({ ...prev, [order.id]: true }));
                        }
                    });
                });
            },
        });

        client.activate();
        return () => client.deactivate();
    }, [orders, selectedOrder]);

    const loadOrders = async () => {
        try {
            const data = await fetchDeliveryPersonOrders(deliveryPersonId, pageNumber, pageSize);
            setOrders(data.content || []);
            setTotalElements(data.totalElements || 0);
        } catch (err) {
            setError("Error al cargar los pedidos");
        }
    };

    const handleConfirmStatusChange = async () => {
        if (!selectedOrder || !newStatus || newStatus === selectedOrder.orderStatus) return;

        try {
            await updateOrderStatus(selectedOrder.id, deliveryPersonId, newStatus);
            const updatedOrder = { ...selectedOrder, orderStatus: newStatus };
            setSelectedOrder(updatedOrder);
            setOrders((prevOrders) =>
                prevOrders.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
            );
        } catch (err) {
            alert("Error al actualizar el estado del pedido");
        }
    };

    const startSharingLocation = () => {
        if (!selectedOrder) return;

        const socket = new SockJS("http://localhost:8080/tfg/api/ws-location");
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                const sendLocation = () => {
                    if (!navigator.geolocation) return;
                    navigator.geolocation.getCurrentPosition((pos) => {
                        const payload = {
                            orderId: selectedOrder.id,
                            deliveryPersonId,
                            latitude: pos.coords.latitude,
                            longitude: pos.coords.longitude,
                        };
                        client.publish({
                            destination: "/app/location/update",
                            body: JSON.stringify(payload),
                        });
                    });
                };

                sendLocation();
                intervalRef.current = setInterval(sendLocation, 5000);
            },
        });

        client.activate();
        stompRef.current = client;
        setIsSharingLocation(true);
    };

    useEffect(() => {
        return () => {
            if (stompRef.current) stompRef.current.deactivate();
            if (intervalRef.current) clearInterval(intervalRef.current);
            setIsSharingLocation(false);
        };
    }, [selectedOrder]);

    const totalPages = Math.ceil(totalElements / pageSize);

    return (
        <>
            <aside className="fixed top-0 right-0 h-full w-64 bg-white shadow-lg border-l z-40 p-4 overflow-y-auto">
                <div className="flex items-center gap-2 text-blue-700 font-bold text-xl mb-6">
                    🚚 {username}
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

                <h3 className="text-lg font-semibold text-emerald-600 mb-2">Tus pedidos</h3>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <ul className="space-y-2">
                    {orders.map((order) => (
                        <li
                            key={order.id}
                            className="relative border p-2 rounded text-sm bg-emerald-50 cursor-pointer hover:bg-emerald-100"
                            onClick={() => {
                                setSelectedOrder(order);
                                setNewStatus(order.orderStatus);
                                setIsSharingLocation(false);
                                setUnreadMessages((prev) => ({ ...prev, [order.id]: false }));
                            }}
                        >
                            {unreadMessages[order.id] && (
                                <span className="absolute top-1 right-1 bg-red-500 text-white rounded-full px-1 text-xs animate-pulse">
                                    💬
                                </span>
                            )}
                            <p><strong>Pedido:</strong> {order.id}</p>
                            <p><strong>Cliente:</strong> {order.customer?.name}</p>
                            <p><strong>Restaurante:</strong> {order.restaurant?.name}</p>
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

            {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-lg p-4 w-[95%] h-[85%] max-w-6xl flex">
                        <div className="w-4/12 h-full pr-4 overflow-y-auto">
                            <h2 className="text-xl font-bold text-blue-600 mb-4">Pedido #{selectedOrder.id}</h2>
                            <p><strong>Cliente:</strong> {selectedOrder.customer?.name}</p>
                            <p><strong>Dirección Cliente:</strong> {selectedOrder.customer?.address}</p>
                            <p><strong>Restaurante:</strong> {selectedOrder.restaurant?.name}</p>
                            <p><strong>Dirección Restaurante:</strong> {selectedOrder.restaurant?.address}</p>

                            <p className="mt-4 mb-1"><strong>Cambiar estado del pedido:</strong></p>
                            <select
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                                className="w-full p-2 border rounded"
                            >
                                <option value="ON_PREPARATION">ON_PREPARATION</option>
                                <option value="ON_DELIVERY">ON_DELIVERY</option>
                                <option value="DELIVERED">DELIVERED</option>
                            </select>

                            <div className="flex flex-col mt-4 gap-2">
                                <button
                                    onClick={handleConfirmStatusChange}
                                    className={`w-full px-4 py-2 rounded text-white ${
                                        newStatus !== selectedOrder.orderStatus
                                            ? "bg-green-500 hover:bg-green-600"
                                            : "bg-gray-400 cursor-not-allowed"
                                    }`}
                                    disabled={newStatus === selectedOrder.orderStatus}
                                >
                                    Confirmar
                                </button>

                                {["ON_PREPARATION", "ON_DELIVERY"].includes(selectedOrder.orderStatus) && !isSharingLocation && (
                                    <button
                                        onClick={startSharingLocation}
                                        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    >
                                        📍 Compartir ubicación
                                    </button>
                                )}

                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="w-full bg-red-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>

                        <div className="w-8/12 h-full flex flex-col border-l pl-4">
                            <h2 className="text-lg font-bold text-blue-700 mb-2">Chat con el cliente</h2>
                            <div className="flex-1 overflow-y-auto">
                                <ChatBox
                                    orderId={selectedOrder.id}
                                    sender={username}
                                    onNewMessage={() => {}}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isSharingLocation && (
                <div className="fixed bottom-4 left-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-pulse">
                    <span>🛱️ Enviando ubicación</span>
                </div>
            )}
        </>
    );
}
