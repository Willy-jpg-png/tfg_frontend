import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

function LocationSelector({ onSelect }) {
    const [position, setPosition] = useState(null);

    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            setPosition([lat, lng]);
            onSelect({ latitude: lat, longitude: lng });
        },
    });

    return position ? <Marker position={position} /> : null;
}

export default function LocationPickerMap({ onLocationSelect }) {
    const [initialCenter, setInitialCenter] = useState(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setInitialCenter([position.coords.latitude, position.coords.longitude]);
                },
                () => {
                    setInitialCenter([40.4168, -3.7038]);
                }
            );
        } else {
            setInitialCenter([40.4168, -3.7038]);
        }
    }, []);

    if (!initialCenter) return <p className="text-gray-500">Cargando mapa...</p>;

    return (
        <MapContainer center={initialCenter} zoom={14} style={{ height: "300px", width: "100%" }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationSelector onSelect={onLocationSelect} />
        </MapContainer>
    );
}
