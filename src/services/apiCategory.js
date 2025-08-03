import { BASE_URL } from '../config/env.js';

export const getAllCategories = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/category`, {
      method: "GET",
    });

    if (!res.ok) {
      const { message } = await res.json();
      return { success: false, message };
    }

    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error:", error.message);
    return { success: false, message: "Network error, please try again" };
  }
};
