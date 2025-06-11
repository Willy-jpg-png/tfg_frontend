import { useEffect, useState } from "react";
import {
    fetchRestaurantProducts,
    updateProduct,
    deleteProduct,
    createProduct,
    updateProductAddings,
    updateAdding,
    deleteAdding,
    createAdding
} from "../services/restaurantService";
import { fetchRestaurantAddings } from "../services/addingService";
import UserPanelWrapper from "./UserPanelWrapper";
import EditProductModal from "./modals/EditProductModal";
import CreateProductModal from "./modals/CreateProductModal";
import AddAddingsModal from "./modals/AddAddingModal";
import EditAddingModal from "./modals/EditAddingModal";
import CreateAddingModal from "./modals/CreateAddingModal";

export default function RestaurantDashboard() {
    const [view, setView] = useState("product");
    const [products, setProducts] = useState([]);
    const [addings, setAddings] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [error, setError] = useState("");

    const [editingProduct, setEditingProduct] = useState(null);
    const [editingAdding, setEditingAdding] = useState(null);
    const [showEditProductModal, setShowEditProductModal] = useState(false);
    const [showEditAddingModal, setShowEditAddingModal] = useState(false);
    const [showCreateProductModal, setShowCreateProductModal] = useState(false);
    const [showCreateAddingModal, setShowCreateAddingModal] = useState(false);
    const [showAddAddingsModal, setShowAddAddingsModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const restaurantId = localStorage.getItem("userId");
    const pageSize = 5;

    useEffect(() => {
        view === "product" ? loadProducts() : loadAddings();
    }, [view]);

    const loadProducts = async () => {
        try {
            const data = await fetchRestaurantProducts(restaurantId, pageNumber, pageSize);
            setProducts(data.content || []);
            setTotalElements(data.totalElements || 0);
        } catch (err) {
            setError(err.message || "Error al cargar productos");
        }
    };

    const loadAddings = async () => {
        try {
            const data = await fetchRestaurantAddings(restaurantId, pageNumber, pageSize);
            setAddings(data.content || []);
            setTotalElements(data.totalElements || 0);
        } catch (err) {
            setError(err.message || "Error al cargar suplementos");
        }
    };

    const handleDelete = async (itemId) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este elemento?")) {
            try {
                if (view === "product") {
                    await deleteProduct(restaurantId, itemId);
                    loadProducts();
                } else {
                    await deleteAdding(restaurantId, itemId);
                    loadAddings();
                }
            } catch {
                alert("Error al eliminar");
            }
        }
    };

    const handleEdit = (item) => {
        if (view === "product") {
            setEditingProduct(item);
            setShowEditProductModal(true);
        } else {
            setEditingAdding(item);
            setShowEditAddingModal(true);
        }
    };

    const handleSaveEditProduct = async (productId, updatedData) => {
        try {
            await updateProduct(restaurantId, productId, { ...updatedData, addingIds: [] });
            setShowEditProductModal(false);
            setEditingProduct(null);
            loadProducts();
        } catch {
            alert("Error al actualizar el producto");
        }
    };

    const handleSaveEditAdding = async (addingId, updatedData) => {
        try {
            await updateAdding(restaurantId, addingId, updatedData);
            setShowEditAddingModal(false);
            setEditingAdding(null);
            loadAddings();
        } catch {
            alert("Error al actualizar el suplemento");
        }
    };

    const handleCreateProduct = async (data) => {
        try {
            await createProduct(restaurantId, data);
            setShowCreateProductModal(false);
            loadProducts();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleCreateAdding = async (data) => {
        try {
            await createAdding(restaurantId, data);
            setShowCreateAddingModal(false);
            loadAddings();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleOpenAddings = (product) => {
        setSelectedProduct(product);
        setShowAddAddingsModal(true);
    };

    const handleConfirmAddings = async (addingIds) => {
        try {
            await updateProductAddings(restaurantId, selectedProduct.id, { addingIds });
            setShowAddAddingsModal(false);
            setSelectedProduct(null);
            loadProducts();
        } catch {
            alert("Error al actualizar suplementos");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-100 to-blue-100 px-4 py-8 relative">
            <UserPanelWrapper />
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-xl mr-72">
                <div className="flex justify-center mb-6">
                    <button
                        className={`px-4 py-2 rounded-l-lg ${view === "product" ? "bg-blue-600 text-white" : "bg-white text-blue-600 border border-blue-600"}`}
                        onClick={() => setView("product")}
                    >
                        Productos
                    </button>
                    <button
                        className={`px-4 py-2 rounded-r-lg ${view === "adding" ? "bg-blue-600 text-white" : "bg-white text-blue-600 border border-blue-600"}`}
                        onClick={() => setView("adding")}
                    >
                        Suplementos
                    </button>
                </div>

                <h2 className="text-2xl font-bold text-blue-700 text-center mb-4">
                    Gestión de {view === "product" ? "productos" : "suplementos"}
                </h2>

                {error && <p className="text-red-600 text-center">{error}</p>}

                <ul className="space-y-4">
                    {(view === "product" ? products : addings).map((item) => (
                        <li key={item.id} className="border rounded p-4 shadow bg-white flex gap-4 items-start">
                            {item.image && (
                                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded" />
                            )}
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold text-emerald-600">{item.name}</h3>
                                <p className="text-gray-600">{item.description}</p>
                                <p className="text-blue-600 font-semibold">{item.price.toFixed(2)} €</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <button onClick={() => handleEdit(item)} className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm">Editar</button>
                                <button onClick={() => handleDelete(item.id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm">Eliminar</button>
                                {view === "product" && (
                                    <button onClick={() => handleOpenAddings(item)} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">Añadir suplementos</button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>

                <div className="text-center mt-8">
                    {view === "product" ? (
                        <button onClick={() => setShowCreateProductModal(true)} className="bg-emerald-600 text-white px-6 py-3 rounded hover:bg-emerald-700 font-semibold">
                            + Añadir nuevo producto
                        </button>
                    ) : (
                        <button onClick={() => setShowCreateAddingModal(true)} className="bg-emerald-600 text-white px-6 py-3 rounded hover:bg-emerald-700 font-semibold">
                            + Añadir nuevo suplemento
                        </button>
                    )}
                </div>
            </div>

            {showEditProductModal && editingProduct && (
                <EditProductModal
                    product={editingProduct}
                    onClose={() => setShowEditProductModal(false)}
                    onSave={handleSaveEditProduct}
                />
            )}

            {showEditAddingModal && editingAdding && (
                <EditAddingModal
                    adding={editingAdding}
                    onClose={() => setShowEditAddingModal(false)}
                    onSave={handleSaveEditAdding}
                />
            )}

            {showCreateProductModal && (
                <CreateProductModal
                    onClose={() => setShowCreateProductModal(false)}
                    onSave={handleCreateProduct}
                />
            )}

            {showCreateAddingModal && (
                <CreateAddingModal
                    onClose={() => setShowCreateAddingModal(false)}
                    onSave={handleCreateAdding}
                />
            )}

            {showAddAddingsModal && selectedProduct && (
                <AddAddingsModal
                    restaurantId={restaurantId}
                    product={selectedProduct}
                    onClose={() => setShowAddAddingsModal(false)}
                    onConfirm={handleConfirmAddings}
                />
            )}
        </div>
    );
}
