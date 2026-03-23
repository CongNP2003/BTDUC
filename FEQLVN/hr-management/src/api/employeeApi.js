import axiosClient from "./axiosClient";

export const getEmployees = () => axiosClient.get("/employee");

export const createEmployee = (data) => axiosClient.post("/employee", data);

export const updateEmployee = (id, data) => axiosClient.patch(`/employee/${id}`, data);

export const deleteEmployee = (id) => axiosClient.delete(`/employee/${id}`);
