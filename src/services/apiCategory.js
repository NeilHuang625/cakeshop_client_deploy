const BASE_URL =
  "https://cakeshop-ewfffsajfrasd6db.newzealandnorth-01.azurewebsites.net";

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
