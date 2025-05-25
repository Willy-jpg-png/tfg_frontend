import { useCart } from "../context/CartContext";
import { useState } from "react";

export default function CartPanel() {
    const {
        cart,
        addToCart,
        removeItem,
        clearCart,
        decrementItem,
        getTotalItems,
    } = useCart();
    const [isOpen, setIsOpen] = useState(false);

    const totalPrice = cart.reduce(
        (acc, { product, quantity }) => acc + product.price * quantity,
        0
    );

    const handleCheckout = () => {
        alert("✅ Pedido confirmado. Gracias por tu compra.");
        clearCart();
        setIsOpen(false);
    };

    return (
        <>
            {/* Botón que abre el carrito */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed top-5 right-5 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition"
                >
                    🛒 Carrito ({getTotalItems()})
                </button>
            )}

            {/* Panel lateral */}
            <aside
                className={`fixed top-0 right-0 h-full w-72 bg-white shadow-lg border-l z-40 transform transition-transform duration-300 ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                {/* Cabecera clicable */}
                <div
                    onClick={() => setIsOpen(false)}
                    className="flex justify-center items-center bg-blue-600 text-white px-4 py-3 font-bold text-lg cursor-pointer hover:bg-blue-700 transition"
                >
                    🛒 Carrito
                </div>

                {/* Contenido del carrito */}
                <div className="p-4 overflow-y-auto h-[calc(100%-160px)]">
                    {cart.length === 0 ? (
                        <p className="text-gray-500">El carrito está vacío</p>
                    ) : (
                        <>
                            <ul className="space-y-3">
                                {cart.map(({ product, quantity }, index) => (
                                    <li
                                        key={index}
                                        className="text-sm border-b pb-2 flex justify-between items-start"
                                    >
                                        <div>
                                            <p className="font-medium">{product.name}</p>

                                            {product.addings && product.addings.length > 0 && (
                                                <ul className="text-sm text-gray-500 list-disc ml-4">
                                                    {product.addings.map((a) => (
                                                        <li key={a.id}>
                                                            {a.name} ({a.price.toFixed(2)} €)
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}

                                            <p className="text-gray-600">Cantidad: {quantity}</p>
                                            <p className="text-blue-600">
                                                Total: {(product.price * quantity).toFixed(2)} €
                                            </p>
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <button
                                                onClick={() => addToCart(product)}
                                                className="bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded hover:bg-emerald-600"
                                            >
                                                +
                                            </button>
                                            <button
                                                onClick={() => decrementItem(product)}
                                                className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded hover:bg-yellow-600"
                                            >
                                                −
                                            </button>
                                            <button
                                                onClick={() => removeItem(product)}
                                                className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded hover:bg-red-600"
                                            >
                                                x
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>

                {/* Total y confirmar */}
                <div className="p-4 border-t">
                    <p className="text-lg font-bold text-blue-700 mb-2">
                        Total: {totalPrice.toFixed(2)} €
                    </p>
                    <button
                        onClick={handleCheckout}
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-semibold"
                    >
                        Confirmar pedido
                    </button>
                </div>
            </aside>
        </>
    );
}
