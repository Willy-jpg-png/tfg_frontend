import { useCart } from "../context/CartContext";

export default function CartSummary() {
    const { cart, getTotalItems } = useCart();

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold">🛒 Carrito ({getTotalItems()} items)</h2>
            <ul className="mt-2 space-y-2">
                {cart.map(({ product, quantity }) => (
                    <li key={product.id}>
                        {product.name} × {quantity}
                    </li>
                ))}
            </ul>
        </div>
    );
}
