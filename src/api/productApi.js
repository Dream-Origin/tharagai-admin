// const API_BASE_URL = "https://tharagai.vercel.app/products";
const API_BASE_URL = "http://localhost:3002/products";

export async function fetchProducts() {
    const res = await fetch(API_BASE_URL);
    if (!res.ok) throw new Error("Failed to fetch products");
    return await res.json();
}

export async function saveProduct(product) {
    const res = await fetch(API_BASE_URL, {
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
    const res = await fetch(`${API_BASE_URL}/${product._id}`, {
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
    const res = await fetch(`${API_BASE_URL}/${productId}`, {
        method: "DELETE",
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete product");
    }
}
