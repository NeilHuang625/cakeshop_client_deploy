const BASE_URL =
  "https://cakeshop-ewfffsajfrasd6db.newzealandnorth-01.azurewebsites.net";

export const createCake = async (cake, jwt) => {
  try {
    const res = await fetch(`${BASE_URL}/cake`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      body: cake,
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

export const updateCake = async (id, cake, jwt) => {
  try {
    const res = await fetch(`${BASE_URL}/cake/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      body: cake,
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

export const deleteCake = async (id, jwt) => {
  try {
    const res = await fetch(`${BASE_URL}/cake/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (!res.ok) {
      const { message } = await res.json();
      return { success: false, message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error:", error.message);
    return { success: false, message: "Network error, please try again" };
  }
};

export const getAvailableCakes = async () => {
  try {
    const res = await fetch(`${BASE_URL}/cake/available`, {
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

export const getAllCakes = async (jwt) => {
  try {
    const res = await fetch(`${BASE_URL}/cake`, {
      method: "GET",
      headers: { Authorization: `Bearer ${jwt}` },
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
