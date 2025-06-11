import { useState } from "react";

export default function CreateProductModal({ onClose, onSave }) {
    const [form, setForm] = useState({
        id: 1,
        name: "",
        description: "",
        price: "",
        image: "",
        addingIds: []
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === "price" ? parseFloat(value) || "" : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name || !form.description || !form.price || !form.image) {
            alert("Por favor, completa todos los campos.");
            return;
        }
        onSave(form);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-bold text-blue-700 mb-4 text-center">Añadir nuevo producto</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Nombre"
                        required
                        className="w-full p-2 border rounded"
                    />
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Descripción"
                        required
                        className="w-full p-2 border rounded"
                    />
                    <input
                        type="number"
                        step="0.01"
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        placeholder="Precio"
                        required
                        className="w-full p-2 border rounded"
                    />
                    <input
                        type="text"
                        name="image"
                        value={form.image}
                        onChange={handleChange}
                        placeholder="URL de la imagen"
                        required
                        className="w-full p-2 border rounded"
                    />

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 rounded"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
