import React from "react";
import { Navigate } from "react-router-dom";

const Logout = () => {

    localStorage.removeItem('user');
    return (
        <div>
            <Navigate to="/login" />
        </div>
    );
};

export default Logout;