import axios from "axios";

export const loginApi = async (data) => {
    const res = await axios.post(
        "http://localhost:8080/api/v1/auth/login",
        data
    );

    return res.data;
};