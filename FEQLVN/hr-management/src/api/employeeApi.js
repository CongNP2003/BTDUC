import axiosClient from "./axiosClient";

export const getEmployees = (from, size) =>
    axiosClient.get(`/employee?from=${from}&size=${size}`);

export const deleteEmployee = (id) =>
    axiosClient.delete(`/employee/${id}`);