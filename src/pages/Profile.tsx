import React, { useState, useEffect } from "react";
import API from "../services/api";

const Profile = () => {
    const [wallet, setWallet] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [isError, setIsError] = useState<boolean>(false);

    useEffect(() => {
        const fetchWallet = async () => {
            try {
                const { data } = await API.get("auth/profile/get_wallet");
                setWallet(data.wallet);
            } catch (error) {
                console.error("Failed to fetch wallet");
            }
        };

        fetchWallet();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { data }  = await API.put("auth/profile/update_wallet", { wallet });
            if (data.status === 500) {
                setIsError(true);
                setMessage("Failed to update wallet");
            } else {
                setIsError(false);
                setMessage("Wallet updated successfully!");
                setWallet(data.wallet);
            }

            // Effacer le message après 3 secondes
            setTimeout(() => {
                setMessage("");
            }, 3000);
        } catch (error) {
            setIsError(true);
            setMessage("Failed to update wallet");
            console.error("Failed to update wallet");
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 space-y-4">
            <h1 className="text-2xl font-bold">Profile</h1>
            {message && (
                <div className={`p-2 rounded ${isError ? 'bg-red-500' : 'bg-green-500'} text-white`}>
                    {message}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Wallet"
                    value={wallet}
                    onChange={(e) => setWallet(e.target.value)}
                    className="w-full p-2 border rounded"
                />
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
                    Update Wallet
                </button>
            </form>
        </div>
    );
};

export default Profile;