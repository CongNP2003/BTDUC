import axiosClient from "./axiosClient";
 
export const getDepartments = () => axiosClient.get("/department");
 
export const createDepartment = (data) => axiosClient.post("/department", data);
 
export const updateDepartment = (id, data) => axiosClient.patch(`/department/${id}`, data);
 
export const deleteDepartment = (id) => axiosClient.delete(`/department/${id}`);
 