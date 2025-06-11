import { useEffect, useState } from "react";
import { fetchRestaurantAddings } from "../../services/addingService";

export default function AddAddingsModal({ restaurantId, product, onClose, onConfirm }) {
    const [addings, setAddings] = useState([]);
    const [selectedAddings, setSelectedAddings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadAddings = async () => {
            try {
                const data = await fetchRestaurantAddings(restaurantId);
                setAddings(data.content || []);

                console.log("Producto recibido:", product);
                const existingIds = product.addings?.map((a) => a.id) || [];
                console.log("IDs de suplementos ya asignados al producto:", existingIds);

                setSelectedAddings(existingIds);
            } catch (err) {
                setError("Error al cargar suplementos");
            } finally {
                setLoading(false);
            }
        };

        loadAddings();
    }, [restaurantId, product]);

    const toggleAdding = (adding) => {
        if (selectedAddings.includes(adding.id)) {
            setSelectedAddings(selectedAddings.filter(id => id !== adding.id));
        } else {
            setSelectedAddings([...selectedAddings, adding.id]);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4 shadow-xl max-h-[80vh] overflow-y-auto">
                <h2 className="text-xl font-bold text-blue-700 text-center">
                    Añadir suplementos al producto
                </h2>

                {loading && <p className="text-center text-gray-500">Cargando suplementos...</p>}
                {error && <p className="text-red-600 text-center">{error}</p>}

                {!loading && !error && (
                    <>
                        <ul className="space-y-2">
                            {addings.map((adding) => (
                                <li key={adding.id} className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={selectedAddings.includes(adding.id)}
                                        onChange={() => toggleAdding(adding)}
                                    />
                                    <span>{adding.name} ({adding.price.toFixed(2)} €)</span>
                                </li>
                            ))}
                        </ul>

                        <div className="flex justify-end gap-2 pt-4">
                            <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
                                Cancelar
                            </button>
                            <button
                                onClick={() => onConfirm(selectedAddings)}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Confirmar
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
