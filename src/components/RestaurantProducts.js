import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchRestaurantProducts } from "../services/productService";
import { useCart } from "../context/CartContext";
import CartPanel from "./CartPanel";
import ProductAddingsModal from "./ProductAddingsModal";

export default function RestaurantProducts() {
    const { restaurantId } = useParams();
    const [products, setProducts] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [error, setError] = useState("");
    const [lastAdded, setLastAdded] = useState(null);
    const [showAddingsModal, setShowAddingsModal] = useState(false);
    const [activeProduct, setActiveProduct] = useState(null);

    const { addToCart, cart, clearCart } = useCart();
    const navigate = useNavigate();
    const pageSize = 5;

    useEffect(() => {
        if (!restaurantId) {
            navigate("/dashboard/customer");
            return;
        }
        loadProducts();
    }, [pageNumber]);

    const loadProducts = async () => {
        try {
            const data = await fetchRestaurantProducts(restaurantId, pageNumber, pageSize);
            setProducts(data.content || []);
            setTotalElements(data.totalElements || 0);
        } catch (err) {
            setError(err.message);
        }
    };

    const totalPages = Math.ceil(totalElements / pageSize);

    const handleAdd = (product) => {
        addToCart(product);
        setLastAdded(product.name);
        setTimeout(() => setLastAdded(null), 2500);
    };

    const handleOpenAddings = (product) => {
        setActiveProduct(product);
        setShowAddingsModal(true);
    };

    const handleConfirmAddings = (selectedAddings) => {
        const addingsTotal = selectedAddings.reduce((sum, a) => sum + a.price, 0);
        const fullPrice = activeProduct.price + addingsTotal;

        addToCart({
            ...activeProduct,
            addings: selectedAddings,
            price: fullPrice,
        });

        setLastAdded(`${activeProduct.name} + addings`);
        setShowAddingsModal(false);
        setTimeout(() => setLastAdded(null), 2500);
    };

    const handleBack = () => {
        if (cart.length > 0) {
            const confirmed = window.confirm("¿Estás seguro? El contenido del carrito se perderá.");
            if (!confirmed) return;
            clearCart();
        }
        navigate("/dashboard/customer");
    };

    return (
        <>
            {/* Botón de volver */}
            <button
                onClick={handleBack}
                className="fixed top-5 left-5 z-50 bg-blue-600 text-white px-3 py-2 rounded-full shadow-lg hover:bg-blue-700 transition text-lg"
                title="Volver"
            >
                ←
            </button>

            {/* Popup de añadido */}
            {lastAdded && (
                <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
                    <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg text-lg font-medium animate-bounce pointer-events-auto">
                        ✅ {lastAdded} añadido al carrito
                    </div>
                </div>
            )}

            <div className="min-h-screen bg-gradient-to-br from-blue-100 to-emerald-100 px-4 py-8 relative">
                <CartPanel />

                <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-xl mr-72 min-h-[500px]">
                    <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
                        Productos del restaurante
                    </h1>

                    {error && <p className="text-red-600 text-center mb-4">{error}</p>}

                    {products.length === 0 ? (
                        <p className="text-center text-gray-500">No hay productos disponibles.</p>
                    ) : (
                        <ul className="space-y-6">
                            {products.map((p) => (
                                <li key={p.id} className="flex gap-4 border p-4 rounded-lg shadow-sm">
                                    {p.image && (
                                        <img src={p.image} alt={p.name} className="w-32 h-32 object-cover rounded" />
                                    )}
                                    <div className="flex-1">
                                        <h2 className="text-xl font-bold text-emerald-600">{p.name}</h2>
                                        <p className="text-gray-600">{p.description}</p>
                                        <p className="text-blue-600 font-semibold mt-1">Precio base: {p.price} €</p>
                                        <div className="flex gap-4 mt-3">
                                            <button
                                                onClick={() => handleAdd(p)}
                                                className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600 transition text-sm"
                                            >
                                                Añadir al carrito
                                            </button>
                                            <button
                                                onClick={() => handleOpenAddings(p)}
                                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm"
                                            >
                                                Añadir suplementos
                                            </button>
                                        </div>
                                    </div>
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

                {showAddingsModal && activeProduct && (
                    <ProductAddingsModal
                        restaurantId={restaurantId}
                        productId={activeProduct.id}
                        basePrice={activeProduct.price}
                        onClose={() => setShowAddingsModal(false)}
                        onConfirm={handleConfirmAddings}
                    />
                )}
            </div>
        </>
    );
}
