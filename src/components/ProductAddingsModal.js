import { useEffect, useState } from "react";
import { fetchProductAddings } from "../services/addingService";

export default function ProductAddingsModal({ restaurantId, productId, basePrice, onClose, onConfirm }) {
    const [addings, setAddings] = useState([]);
    const [selectedAddings, setSelectedAddings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadAddings = async () => {
            try {
                const data = await fetchProductAddings(restaurantId, productId);
                setAddings(data.content || []);
                setLoading(false);
            } catch (err) {
                console.error("Error al cargar addings:", err.response?.data || err.message);
                setError("No se pudieron cargar los addings.");
                setLoading(false);
            }
        };

        loadAddings();
    }, [restaurantId, productId]);

    const toggleAdding = (adding) => {
        if (selectedAddings.some((a) => a.id === adding.id)) {
            setSelectedAddings(selectedAddings.filter((a) => a.id !== adding.id));
        } else {
            setSelectedAddings([...selectedAddings, adding]);
        }
    };

    const finalPrice = basePrice + selectedAddings.reduce((sum, a) => sum + a.price, 0);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold text-center text-blue-700">Selecciona los suplementos</h2>

                {loading && <p className="text-center text-gray-500">Cargando suplementos...</p>}

                {error && <p className="text-center text-red-600">{error}</p>}

                {!loading && !error && (
                    <>
                        {addings.length === 0 ? (
                            <p className="text-center text-gray-500">No hay suplementos disponibles.</p>
                        ) : (
                            <ul className="space-y-2">
                                {addings.map((a) => (
                                    <li key={a.id} className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedAddings.some((sel) => sel.id === a.id)}
                                            onChange={() => toggleAdding(a)}
                                        />
                                        <span>{a.name} ({a.price.toFixed(2)} €)</span>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <p className="text-right text-blue-600 font-semibold pt-2">
                            Precio total: {finalPrice.toFixed(2)} €
                        </p>

                        <div className="flex justify-end gap-2 pt-4">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => onConfirm(selectedAddings)}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-semibold"
                            >
                                Añadir
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
