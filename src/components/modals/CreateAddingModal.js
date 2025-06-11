import { useState } from "react";

export default function CreateAddingModal({ onClose, onSave }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState("");

    const handleSubmit = () => {
        const parsedPrice = parseFloat(price);
        if (!name || !description || isNaN(parsedPrice) || !image) {
            alert("Por favor, completa todos los campos correctamente.");
            return;
        }

        onSave({
            id: 1,
            name,
            description,
            price: parsedPrice,
            image
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4 shadow-xl">
                <h2 className="text-xl font-bold text-blue-700 text-center">Crear nuevo suplemento</h2>

                <input
                    type="text"
                    placeholder="Nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border rounded"
                />
                <textarea
                    placeholder="Descripción"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 border rounded"
                />
                <input
                    type="number"
                    step="0.01"
                    placeholder="Precio"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full p-2 border rounded"
                />
                <input
                    type="text"
                    placeholder="URL de imagen"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full p-2 border rounded"
                />

                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                    >
                        Crear
                    </button>
                </div>
            </div>
        </div>
    );
}
