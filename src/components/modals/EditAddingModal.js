import { useState } from "react";

export default function EditAddingModal({ adding, onClose, onSave }) {
    const [form, setForm] = useState({
        name: adding.name || "",
        description: adding.description || "",
        price: adding.price || 0,
        image: adding.image || "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === "price" ? parseFloat(value) : value,
        }));
    };

    const handleSubmit = () => {
        if (!form.name || !form.description || isNaN(form.price) || !form.image) {
            alert("Todos los campos son obligatorios.");
            return;
        }
        onSave(adding.id, form);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl space-y-4">
                <h2 className="text-xl font-bold text-blue-700 text-center">Editar suplemento</h2>

                <div className="space-y-3">
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        placeholder="Nombre"
                    />
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        placeholder="Descripción"
                    />
                    <input
                        name="price"
                        type="number"
                        value={form.price}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        placeholder="Precio"
                    />
                    <input
                        name="image"
                        value={form.image}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        placeholder="URL de la imagen"
                    />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Guardar cambios
                    </button>
                </div>
            </div>
        </div>
    );
}
