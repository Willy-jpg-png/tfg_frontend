import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchRestaurants } from "../services/restaurantService";
import UserPanel from "./UserPanel";

export default function CustomerDashboard() {
    const navigate = useNavigate();
    const [restaurants, setRestaurants] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const pageSize = 5;
    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("role");

    useEffect(() => {
        if (!userId || role !== "CUSTOMER") {
            navigate("/");
            return;
        }

        loadRestaurants();
    }, [pageNumber]);

    const loadRestaurants = async () => {
        setIsLoading(true);
        setError("");
        try {
            const data = await fetchRestaurants(userId, pageNumber, pageSize);
            setRestaurants(data.content || []);
            setTotalElements(data.totalElements || 0);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const totalPages = Math.ceil(totalElements / pageSize);

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-100 to-blue-100 px-4 py-8 relative">
            <UserPanel />

            <div className="max-w-4xl bg-white p-6 rounded-2xl shadow-xl mr-72">
                <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
                    Restaurantes disponibles
                </h1>

                {error && <p className="text-red-600 text-center mb-4">{error}</p>}

                {isLoading ? (
                    <p className="text-center text-gray-500">Cargando restaurantes...</p>
                ) : restaurants.length === 0 ? (
                    <p className="text-center text-gray-500">No hay restaurantes disponibles.</p>
                ) : (
                    <ul className="space-y-4">
                        {restaurants.map((r) => (
                            <li
                                key={r.id}
                                className="border p-4 rounded-lg shadow-sm hover:bg-blue-50 cursor-pointer transition"
                                onClick={() => navigate(`/restaurants/${r.id}/products`)}
                            >
                                <h2 className="text-xl font-semibold text-emerald-600">{r.name}</h2>
                                <p className="text-gray-600">{r.description}</p>
                                <p className="text-sm text-gray-500">{r.address}</p>
                                {r.website && (
                                    <a
                                        href={r.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline text-sm"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {r.website}
                                    </a>
                                )}
                            </li>
                        ))}
                    </ul>
                )}

                {totalPages > 1 && (
                    <div className="flex justify-center mt-6 space-x-4">
                        <button
                            disabled={pageNumber === 0}
                            onClick={() => setPageNumber(pageNumber - 1)}
                            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                        >
                            Anterior
                        </button>
                        <button
                            disabled={pageNumber >= totalPages - 1}
                            onClick={() => setPageNumber(pageNumber + 1)}
                            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                        >
                            Siguiente
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
