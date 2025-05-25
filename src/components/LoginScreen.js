import { useState } from 'react';
import { login } from '../services/authService';
import { useNavigate } from 'react-router-dom';

export default function LoginScreen() {
    const [form, setForm] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const user = await login(form);

            // Guardar en localStorage
            localStorage.setItem('userId', user.id);
            localStorage.setItem('username', user.username);
            localStorage.setItem('role', user.role);

            // 🔁 Redirigir según el rol
            if (user.role === 'CUSTOMER') {
                navigate('/dashboard/customer');
            } else if (user.role === 'RESTAURANT') {
                navigate('/dashboard/restaurant');
            } else if (user.role === 'DELIVERY_PERSON') {
                navigate('/dashboard/deliveryPerson');
            }
        } catch (err) {
            setError(err.message);
        }
    };




    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-100 to-blue-100 px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl space-y-6">
                <h1 className="text-5xl font-extrabold text-center text-blue-700">
                    <span className="text-emerald-500">Rep</span>Eat
                </h1>
                <p className="text-center text-gray-600">Inicia sesión para continuar</p>

                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        name="username"
                        type="text"
                        placeholder="Nombre de usuario"
                        value={form.username}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Contraseña"
                        value={form.password}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                        Iniciar sesión
                    </button>
                </form>

                {error && <p className="text-red-600 text-center">{error}</p>}

                <div className="text-center">
                    <p className="text-gray-600">¿No tienes una cuenta?</p>
                    <button
                        onClick={() => navigate('/register')}
                        className="mt-2 text-blue-600 font-medium hover:underline"
                    >
                        Regístrate aquí
                    </button>
                </div>
            </div>
        </div>
    );
}
