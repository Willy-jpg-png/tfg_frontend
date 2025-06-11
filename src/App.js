import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginScreen from "./components/LoginScreen";
import SignUpForm from "./components/SignUpForm";
import CustomerDashboard from "./components/CustomerDashboard";
import RestaurantDashboard from "./components/RestaurantDashboard";
import DeliveryPersonDashboard from "./components/DeliveryPersonDashboard";
import RestaurantProducts from "./components/RestaurantProducts";
import { CartProvider } from "./context/CartContext";

function App() {
    return (
        <CartProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LoginScreen />} />
                    <Route path="/register" element={<SignUpForm />} />
                    <Route path="/dashboard/customer" element={<CustomerDashboard />} />
                    <Route path="/dashboard/restaurant" element={<RestaurantDashboard />} />
                    <Route path="/dashboard/deliveryPerson" element={<DeliveryPersonDashboard />} />
                    <Route path="/restaurants/:restaurantId/products" element={<RestaurantProducts />} />
                </Routes>
            </BrowserRouter>
        </CartProvider>
    );
}

export default App;
