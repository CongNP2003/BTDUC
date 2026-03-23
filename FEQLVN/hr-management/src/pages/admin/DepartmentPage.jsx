import { useEffect, useState } from "react";
import { getDepartments } from "../../api/departmentApi";

function DepartmentPage() {
    const [list, setList] = useState([]);

    const loadData = async () => {
        const res = await getDepartments();
        setList(res.data);
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <div>
            <h3>Phòng ban</h3>
            <ul>
                {list.map((d) => (
                    <li key={d.id}>{d.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default DepartmentPage;