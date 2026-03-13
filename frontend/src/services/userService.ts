import api from "../api";
import type { UserPayload } from "../types/models";

export const getSites = async () => {
  const res = await api.get("/sites");
  return res.data;
};

export const getUsers = async () => {
  const res = await api.get("/users");
  return res.data;
};

export const getUserById = async (id: number) => {
  const res = await api.get(`/users/${id}`);
  return res.data;
};

export const createUser = async (payload: UserPayload) => {
  const res = await api.post("/users", payload);
  return res.data;
};

export const updateUser = async (id: number, payload: UserPayload) => {
  const res = await api.put(`/users/${id}`, payload);
  return res.data;
};

export const deleteUser = async (id: number) => {
  const res = await api.delete(`/users/${id}`);
  return res.data;
};