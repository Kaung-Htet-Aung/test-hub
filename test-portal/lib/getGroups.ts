import api from "./api";

export const getGroups = async () => {
  try {
    const response = await api.get("/admin/groups");
    console.log(response.data);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error("Failed to fetch groups");
  }
};
