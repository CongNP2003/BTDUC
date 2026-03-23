import { Link, Routes, Route } from "react-router-dom";
import EmployeePage from "../pages/admin/EmployeePage.jsx";
import DepartmentPage from "../pages/admin/DepartmentPage.jsx";

function AdminLayout() {
    return (
        <div className="d-flex">
            <div style={{ width: 200, background: "#222", color: "#fff" }}>
                <h4 className="p-3">ADMIN</h4>
                <Link to="employees" className="d-block p-2 text-white">
                    Nhân viên
                </Link>
                <Link to="departments" className="d-block p-2 text-white">
                    Phòng ban
                </Link>
            </div>

            <div className="p-3 w-100">
                <Routes>
                    <Route path="employees" element={<EmployeePage />} />
                    <Route path="departments" element={<DepartmentPage />} />
                </Routes>
            </div>
        </div>
    );
}

export default AdminLayout;