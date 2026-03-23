import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";
import UserLayout from "../layouts/UserLayout.jsx";

function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/admin/*" element={<AdminLayout />} />
            <Route path="/user/*" element={<UserLayout />} />
        </Routes>
    );
}

export default AppRouter;