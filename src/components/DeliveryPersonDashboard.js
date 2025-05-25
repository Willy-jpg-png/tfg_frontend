import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserPanel from "./UserPanel";

export default function DeliveryPersonDashboard() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");

    useEffect(() => {
        const userRole = localStorage.getItem("role");
        const user = localStorage.getItem("username");
        if (!user || userRole !== "DELIVERY_PERSON") {
            navigate("/");
        } else {
            setUsername(user);
        }
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-100 to-blue-100 px-4 py-8">
            <UserPanel />
            <div className="max-w-4xl mr-72 mx-auto bg-white p-6 rounded-2xl shadow-xl">
                <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
                    Panel del Repartidor
                </h1>
                <p className="text-center text-gray-600">
                    Bienvenido, {username}. Aquí se mostrará el contenido específico del repartidor.
                </p>
            </div>
        </div>
    );
}
