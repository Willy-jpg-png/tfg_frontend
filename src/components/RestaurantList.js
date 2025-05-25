import React, { useEffect, useState } from "react";
import { getRestaurants } from "../services/restaurantService";

export default function RestaurantList({ userId }) {
    const [restaurants, setRestaurants] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [pageSize] = useState(5);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await getRestaurants(userId, pageNumber, pageSize);
                setRestaurants(data.content);
                setTotalElements(data.totalElements);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId, pageNumber, pageSize]);

    const totalPages = Math.ceil(totalElements / pageSize);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Restaurantes</h1>

            {loading && <p className="text-gray-600">Cargando...</p>}
            {error && <p className="text-red-600">{error}</p>}

            {!loading && !error && (
                <>
                    <ul className="space-y-4">
                        {restaurants.map((r) => (
                            <li
                                key={r.id}
                                className="bg-white p-6 rounded-xl shadow border border-gray-200"
                            >
                                <h2 className="text-xl font-semibold text-gray-900">{r.name}</h2>
                                <p className="text-gray-700">{r.description}</p>
                                <p className="text-gray-500">{r.address}</p>
                                {r.website && (
                                    <a
                                        href={r.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline"
                                    >
                                        Visitar sitio web
                                    </a>
                                )}
                            </li>
                        ))}
                    </ul>

                    <div className="flex justify-between items-center mt-6">
                        <button
                            onClick={() => setPageNumber(pageNumber - 1)}
                            disabled={pageNumber === 0}
                            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-300"
                        >
                            Anterior
                        </button>

                        <span className="text-gray-600">
                            Página {pageNumber + 1} de {totalPages}
                        </span>

                        <button
                            onClick={() => setPageNumber(pageNumber + 1)}
                            disabled={pageNumber >= totalPages - 1}
                            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-300"
                        >
                            Siguiente
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
