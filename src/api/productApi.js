const API_BASE_URL = "https://tharagai-api.onrender.com";
// const API_BASE_URL = "http://localhost:3000/products";

export async function fetchProducts() {
  const res = await fetch(`${API_BASE_URL}/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return await res.json();
}

export async function saveProduct(product) {
  const res = await fetch(`${API_BASE_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to save product");
  }
  return await res.json();
}

export async function updateProduct(product) {
  const res = await fetch(`${API_BASE_URL}/products/${product._id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to update product");
  }
  return await res.json();
}

export async function deleteProduct(productId) {
  const res = await fetch(`${API_BASE_URL}/products/${productId}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to delete product");
  }
}

export async function uploadAssets(file) {
  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch(`${API_BASE_URL}/file-upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      errorData.message || "Failed to upload the product assets."
    );
  }
  return await res.json();
}
