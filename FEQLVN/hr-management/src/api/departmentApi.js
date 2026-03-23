import axiosClient from "./axiosClient";

export const getDepartments = () =>
    axiosClient.get("/department");