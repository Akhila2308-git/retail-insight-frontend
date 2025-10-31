import axios from "axios";

// 🔗 Your Render backend link
const API = axios.create({
  baseURL: "http://localhost:5000",
});


// Example API calls
export const getProducts = async () => {
  try {
    const response = await API.get("/products");
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const addProduct = async (productData) => {
  try {
    const response = await API.post("/products", productData);
    return response.data;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    const response = await API.delete(`/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

export const updateProduct = async (productId, updatedData) => {
  try {
    const response = await API.put(`/products/${productId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};




