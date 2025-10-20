import api from "./api";

export const getQuestionSets = async () => {
  try {
    const response = await api.get("/admin/questionsets");
    console.log(response);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error("Failed to fetch groups");
  }
};
