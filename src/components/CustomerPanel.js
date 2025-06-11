import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCustomerOrders } from "../services/orderService";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import homeIconImg from "../assets/home-icon.png";
import restaurantIconImg from "../assets/restaurant-icon.png";
import deliveryPersonIconImg from "../assets/deliveryPerson-icon.png";
import ChatBox from "./ChatBox";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const homeIcon = new L.Icon({
    iconUrl: homeIconImg,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

const restaurantIcon = new L.Icon({
    iconUrl: restaurantIconImg,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

const deliveryPersonIcon = new L.Icon({
    iconUrl: deliveryPersonIconImg,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

function RecenterMap({ lat, lng }) {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lng]);
    }, [lat, lng]);
    return null;
}

export default function CustomerPanel() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [orders, setOrders] = useState([]);
    const [unreadMessages, setUnreadMessages] = useState({});
    const [pageNumber, setPageNumber] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [error, setError] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [location, setLocation] = useState(null);
    const [showMap, setShowMap] = useState(false);
    const [initialMapCenter, setInitialMapCenter] = useState([40.4168, -3.7038]);

    const customerId = localStorage.getItem("userId");
    const pageSize = 5;

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) setUsername(storedUsername);
    }, []);

    useEffect(() => {
        loadOrders();
    }, [pageNumber]);

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

    useEffect(() => {
        if (!selectedOrder || !showMap) return;

        const socket = new SockJS("http://localhost:8080/tfg/api/ws-location");
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                client.subscribe(`/topic/order/${selectedOrder.id}`, (msg) => {
                    const loc = JSON.parse(msg.body);
                    setLocation({ lat: loc.latitude, lng: loc.longitude });
                });
            },
        });

        client.activate();
        return () => {
            client.deactivate();
        };
    }, [selectedOrder, showMap]);

    const loadOrders = async () => {
        try {
            const data = await fetchCustomerOrders(customerId, pageNumber, pageSize);
            setOrders(data.content || []);
            setTotalElements(data.totalElements || 0);
        } catch (err) {
            setError(err.message || "Error al cargar pedidos");
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <aside className="fixed top-0 right-0 h-full w-64 bg-white shadow-lg border-l z-40 p-4 overflow-y-auto">
            <div className="flex items-center gap-2 text-blue-700 font-bold text-xl mb-6">🧑‍💻 {username}</div>

            <button
                onClick={handleLogout}
                className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition mb-6"
            >
                Cerrar sesión
            </button>

            <h3 className="text-md font-semibold text-blue-600 mb-2">Tus pedidos:</h3>

            {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

            <ul className="text-sm space-y-3 mb-4">
                {orders.map((order) => (
                    <li
                        key={order.id}
                        className="relative border p-2 rounded shadow-sm cursor-pointer hover:bg-blue-50"
                        onClick={() => {
                            setSelectedOrder(order);
                            setInitialMapCenter([
                                order.restaurant.latitude || 40.4168,
                                order.restaurant.longitude || -3.7038,
                            ]);
                            setShowMap(true);
                            setUnreadMessages((prev) => ({ ...prev, [order.id]: false }));
                        }}
                    >
                        {unreadMessages[order.id] && (
                            <span className="absolute top-1 right-1 bg-red-500 text-white rounded-full px-1 text-xs animate-pulse">
                                💬
                            </span>
                        )}
                        <p><strong>Restaurante:</strong> {order.restaurant.name}</p>
                        <p><strong>Total:</strong> {order.totalPrice.toFixed(2)} €</p>
                        <p><strong>Estado:</strong> {order.orderStatus}</p>
                    </li>
                ))}
            </ul>

            {totalElements > pageSize && (
                <div className="flex justify-between mt-4">
                    <button
                        onClick={() => setPageNumber((prev) => Math.max(0, prev - 1))}
                        disabled={pageNumber === 0}
                        className="px-2 py-1 bg-blue-500 text-white rounded text-xs disabled:opacity-50"
                    >
                        ◀
                    </button>
                    <button
                        onClick={() => setPageNumber((prev) => prev + 1)}
                        disabled={(pageNumber + 1) * pageSize >= totalElements}
                        className="px-2 py-1 bg-blue-500 text-white rounded text-xs disabled:opacity-50"
                    >
                        ▶
                    </button>
                </div>
            )}

            {showMap && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-lg p-4 w-[95%] h-[85%] max-w-6xl flex">
                        <div className="w-2/3 h-full pr-4">
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-lg font-bold text-blue-700">Mapa del repartidor</h2>
                                <button
                                    onClick={() => setShowMap(false)}
                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                >
                                    Cerrar
                                </button>
                            </div>
                            <div className="w-full h-[90%]">
                                <MapContainer
                                    center={initialMapCenter}
                                    zoom={14}
                                    scrollWheelZoom={false}
                                    style={{ height: "100%", width: "100%" }}
                                >
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                                    {selectedOrder?.customer?.latitude && (
                                        <Marker
                                            position={[selectedOrder.customer.latitude, selectedOrder.customer.longitude]}
                                            icon={homeIcon}
                                        >
                                            <Popup>Casa del cliente</Popup>
                                        </Marker>
                                    )}

                                    {selectedOrder?.restaurant?.latitude && (
                                        <Marker
                                            position={[selectedOrder.restaurant.latitude, selectedOrder.restaurant.longitude]}
                                            icon={restaurantIcon}
                                        >
                                            <Popup>Restaurante</Popup>
                                        </Marker>
                                    )}

                                    {location && (
                                        <>
                                            <Marker position={[location.lat, location.lng]} icon={deliveryPersonIcon}>
                                                <Popup>Repartidor</Popup>
                                            </Marker>
                                            <RecenterMap lat={location.lat} lng={location.lng} />
                                        </>
                                    )}
                                </MapContainer>
                            </div>
                        </div>
                        <div className="w-1/3 h-full flex flex-col border-l pl-4">
                            <h2 className="text-lg font-bold text-blue-700 mb-2">Chat con el repartidor</h2>
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
        </aside>
    );
}
