import { useState, useEffect } from "react";

export default function EditProductModal({ product, onClose, onSave }) {
    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        image: "",
    });

    useEffect(() => {
        if (product) {
            setForm({
                name: product.name,
                description: product.description,
                price: product.price,
                image: product.image,
            });
        }
    }, [product]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const updated = {
            ...form,
            price: parseFloat(form.price),
        };
        onSave(product.id, updated);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-bold text-blue-700 mb-4">Editar producto</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Nombre"
                        className="w-full p-2 border rounded"
                        required
                    />
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Descripción"
                        className="w-full p-2 border rounded"
                        required
                    />
                    <input
                        type="number"
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        placeholder="Precio"
                        className="w-full p-2 border rounded"
                        required
                    />
                    <input
                        name="image"
                        value={form.image}
                        onChange={handleChange}
                        placeholder="URL de imagen"
                        className="w-full p-2 border rounded"
                        required
                    />
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 text-black px-4 py-2 rounded"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
