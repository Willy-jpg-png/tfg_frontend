import { useState } from "react";
import {
    signUpCustomer,
    signUpRestaurant,
    signUpDeliveryPerson,
} from "../services/userService";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";
import LocationPickerMap from "./LocationPickerMap";

const initialForms = {
    customer: {
        username: "", name: "", password: "", email: "",
        street: "", number: "", floor: "", latitude: null, longitude: null
    },
    restaurant: {
        username: "", name: "", password: "", email: "",
        street: "", number: "", floor: "", description: "",
        phone: "", website: "", latitude: null, longitude: null
    },
    deliveryPerson: {
        username: "", name: "", password: "", email: "", photo: ""
    },
};

export default function SignUpForm() {
    const [userType, setUserType] = useState("customer");
    const [form, setForm] = useState(initialForms["customer"]);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleTypeChange = (e) => {
        const type = e.target.value;
        setUserType(type);
        setForm(initialForms[type]);
        setConfirmPassword("");
        setError("");
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (form.password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        try {
            if (userType === "customer") await signUpCustomer(form);
            else if (userType === "restaurant") await signUpRestaurant(form);
            else if (userType === "deliveryPerson") await signUpDeliveryPerson(form);

            const user = await login({
                username: form.username,
                password: form.password,
            });

            localStorage.setItem("username", user.username);
            localStorage.setItem("role", user.role);
            localStorage.setItem("userId", user.id);

            if (user.role === "CUSTOMER") {
                navigate("/dashboard/customer");
            } else if (user.role === "RESTAURANT") {
                navigate("/dashboard/restaurant");
            } else if (user.role === "DELIVERY_PERSON") {
                navigate("/dashboard/deliveryPerson");
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const isMapUser = userType === "customer" || userType === "restaurant";

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-100 to-blue-100 px-4">
            <div className="w-full max-w-2xl bg-white p-8 rounded-3xl shadow-2xl space-y-6 my-12">
                <h1 className="text-4xl font-extrabold text-center text-blue-700">
                    <span className="text-emerald-500">Rep</span>Eat
                </h1>
                <p className="text-center text-gray-600">Regístrate para comenzar</p>

                <div className="flex justify-center">
                    <select
                        className="p-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={userType}
                        onChange={handleTypeChange}
                    >
                        <option value="customer">Cliente</option>
                        <option value="restaurant">Restaurante</option>
                        <option value="deliveryPerson">Repartidor</option>
                    </select>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                    {Object.keys(form).map((key) => {
                        if (
                            key === "password" ||
                            key === "latitude" ||
                            key === "longitude"
                        ) return null;

                        return (
                            <input
                                key={key}
                                name={key}
                                type="text"
                                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                                value={form[key]}
                                onChange={handleChange}
                                required
                                className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            />
                        );
                    })}

                    <div className="relative">
                        <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Contraseña"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="w-full p-3 pr-16 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-sm text-blue-600 hover:underline"
                        >
                            {showPassword ? "Ocultar" : "Mostrar"}
                        </button>
                    </div>

                    <div className="relative">
                        <input
                            name="confirmPassword"
                            type={showPassword ? "text" : "password"}
                            placeholder="Confirmar contraseña"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full p-3 pr-16 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-sm text-blue-600 hover:underline"
                        >
                            {showPassword ? "Ocultar" : "Mostrar"}
                        </button>
                    </div>

                    {isMapUser && (
                        <>
                            <h3 className="text-lg font-semibold text-blue-700 mt-4">
                                Selecciona tu ubicación en el mapa
                            </h3>
                            <LocationPickerMap
                                onLocationSelect={({ latitude, longitude }) =>
                                    setForm((prev) => ({ ...prev, latitude, longitude }))
                                }
                            />
                        </>
                    )}

                    <button
                        type="submit"
                        className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                    >
                        Registrarse
                    </button>
                </form>

                {error && <p className="text-red-600 text-center font-medium">{error}</p>}

                <div className="text-center">
                    <p className="text-gray-600">¿Ya tienes una cuenta?</p>
                    <button
                        onClick={() => navigate("/")}
                        className="mt-2 text-blue-600 font-medium hover:underline"
                    >
                        Inicia sesión aquí
                    </button>
                </div>
            </div>
        </div>
    );
}
