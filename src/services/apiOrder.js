const BASE_URL =
  "https://cakeshop-ewfffsajfrasd6db.newzealandnorth-01.azurewebsites.net";

export const createOrder = async (order, jwt) => {
  try {
    const res = await fetch(`${BASE_URL}/order`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });
    if (!res.ok) {
      const data = await res.json();
      return { success: false, message: data.message };
    }
    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error:", error.message);
    return { success: false, message: "Network error, please try again" };
  }
};

export const getOrders = async (jwt) => {
  try {
    const res = await fetch(`${BASE_URL}/order`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    if (!res.ok) {
      const data = await res.json();
      return { success: false, message: data.message };
    }

    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error:", error.message);
    return { success: false, message: "Network error, please try again" };
  }
};

export const deleteOrder = async (id, jwt) => {
  try {
    const res = await fetch(`${BASE_URL}/order/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    if (!res.ok) {
      const data = await res.json();
      return { success: false, message: data.message };
    } else {
      return { success: true };
    }
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: error.message };
  }
};

export const updateOrder = async (id, jwt, order) => {
  try {
    const res = await fetch(`${BASE_URL}/order/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });
    if (!res.ok) {
      const data = await res.json();
      return { success: false, message: data.message };
    }
    return { success: true };
  } catch (error) {
    console.error("Error:", error.message);
    return { success: false, message: "Network error, please try again" };
  }
};
