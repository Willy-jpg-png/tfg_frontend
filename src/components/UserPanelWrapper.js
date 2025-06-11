import CustomerPanel from "./CustomerPanel";
import RestaurantPanel from "./RestaurantPanel";
import DeliveryPersonPanel from "./DeliveryPersonPanel";

export default function UserPanelWrapper() {
    const role = localStorage.getItem("role");

    if (role === "CUSTOMER") return <CustomerPanel />;
    if (role === "RESTAURANT") return <RestaurantPanel />;
    if (role === "DELIVERY_PERSON") return <DeliveryPersonPanel />;

    return null;
}
