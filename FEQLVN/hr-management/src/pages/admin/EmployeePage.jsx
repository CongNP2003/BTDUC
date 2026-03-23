import { useEffect, useState } from "react";
import { getEmployees, deleteEmployee } from "../../api/employeeApi";

function EmployeePage() {
    const [list, setList] = useState([]);

    const loadData = async () => {
        const res = await getEmployees(0, 10);
        setList(res.data);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDelete = async (id) => {
        await deleteEmployee(id);
        loadData();
    };

    return (
        <div>
            <h3>Nhân viên</h3>
            <table className="table">
                <thead>
                <tr>
                    <th>Tên</th>
                    <th>Giới tính</th>
                    <th>Phone</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {list.map((e) => (
                    <tr key={e.id}>
                        <td>{e.username}</td>
                        <td>{e.gender}</td>
                        <td>{e.phone}</td>
                        <td>
                            <button onClick={() => handleDelete(e.id)}>
                                Xóa
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default EmployeePage;