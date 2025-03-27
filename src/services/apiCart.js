const BASE_URL = "http://localhost:5056/api";

export const getCarts = async (jwt) => {
  try {
    const res = await fetch(`${BASE_URL}/cart`, {
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

export const createCart = async (cart, jwt) => {
  try {
    console.log("Cart:", cart);
    const res = await fetch(`${BASE_URL}/cart`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cart),
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

export const updateCartQuantity = async (cart, jwt) => {
  try {
    const res = await fetch(`${BASE_URL}/cart`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cart),
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

export const deleteCart = async (cartId, jwt) => {
  try {
    const res = await fetch(`${BASE_URL}/cart/${cartId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
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

export const deleteAllCartsByUserId = async (userId, jwt) => {
  try {
    const res = await fetch(`${BASE_URL}/cart/clear/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
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
