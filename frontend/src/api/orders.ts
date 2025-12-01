import axiosInstance from "./axiosInstance";

// src/api/orders.ts
export const createOrder = async (data: any) => {
  const res = await axiosInstance.post("/orders", data);
  return { success: true, data: res.data };
};

export const getAllOrders = async () => {
  const res = await axiosInstance.get("/orders");
  return { success: true, data: res.data };
};

export const updateOrder = async (id: string, data: any) => {
  const res = await axiosInstance.put(`/orders/${id}`, data);
  return { success: true, data: res.data };
};