const BASE_URL = import.meta.env.VITE_BASE_URL;

export const createCake = async (cake, jwt) => {
  try {
    const res = await fetch(`${BASE_URL}/api/cake`, {
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
    const res = await fetch(`${BASE_URL}/api/cake/${id}`, {
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
    const res = await fetch(`${BASE_URL}/api/cake/${id}`, {
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
    const res = await fetch(`${BASE_URL}/api/cake/available`, {
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
    const res = await fetch(`${BASE_URL}/api/cake`, {
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
