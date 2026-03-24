import axiosClient from "./axiosClient";
 
export const getUsers = () => axiosClient.get("/user");
 
export const createUser = (data) => axiosClient.post("/auth/register", data);
 
export const updateUser = (id, data) => axiosClient.patch(`/user/${id}`, data);
 
export const deleteUser = (id) => axiosClient.delete(`/user/${id}`);
 