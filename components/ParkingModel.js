import { useEffect, useRef } from "react";

export const ParkingModal = ({ open, mode, form, setForm, onClose, onSubmit }) => {
    const autoRef = useRef(null);
    const autocomplete = useRef(null);

    useEffect(() => {
        if (!open) return;

        // --- Load Google Script Correctly ---
        const scriptId = "google-maps-script";
        const existing = document.getElementById(scriptId);

        if (!existing) {
            const script = document.createElement("script");
            script.id = scriptId;
            script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&libraries=places`;
            script.async = true;

            script.onload = initAutocomplete; 

            document.body.appendChild(script);
        } else {
            initAutocomplete();
        }

        function initAutocomplete() {
            if (!window.google || !autoRef.current) return;

            autocomplete.current = new window.google.maps.places.Autocomplete(autoRef.current, {
                types: ["geocode"],
                // componentRestrictions: { country: "in" },
            });

            autocomplete.current.addListener("place_changed", () => {
                const place = autocomplete.current.getPlace();
                if (!place.geometry) return;

                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();

                setForm({
                    ...form,
                    address: place.formatted_address,
                    latitude: lat,
                    longitude: lng,
                });
            });
        }
    }, [open]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />

            <div className="bg-white rounded-xl w-[600px] max-w-[95%] z-10 p-6 shadow-xl">

                <div className="flex justify-between items-center mb-5">
                    <h3 className="text-xl font-semibold">
                        {mode === "add" ? "Add Parking" : "Edit Parking"}
                    </h3>
                    <button className="text-gray-500 text-xl" onClick={onClose}>✕</button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="text-sm font-medium">Parking Name</label>
                        <input
                            className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-black/70 outline-none"
                            value={form.parkingName}
                            onChange={(e) => setForm({ ...form, parkingName: e.target.value })}
                            placeholder="Enter parking name"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Address</label>
                        <input
                            ref={autoRef}
                            className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-black/70 outline-none"
                            value={form.address}
                            onChange={(e) => setForm({ ...form, address: e.target.value })}
                            placeholder="Search address..."
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-100 cursor-pointer">
                        Cancel
                    </button>

                    <button onClick={onSubmit} className="px-5 py-2 bg-black text-white rounded-lg hover:bg-black/90 cursor-pointer">
                        {mode === "add" ? "Save" : "Update"}
                    </button>
                </div>
            </div>
        </div>
    );
};
