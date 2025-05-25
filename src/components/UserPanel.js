import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function UserPanel() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) setUsername(storedUsername);
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <aside className="fixed top-0 right-0 h-full w-64 bg-white shadow-lg border-l z-40 p-4">
            <div className="flex items-center gap-2 text-blue-700 font-bold text-xl mb-6">
                👤 {username}
            </div>

            <button
                onClick={handleLogout}
                className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
            >
                Cerrar sesión
            </button>
        </aside>
    );
}
