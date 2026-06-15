import { CONFIG } from "../config";
const { API_BASE_URL, ORDERS_API } = CONFIG;

/* ================================
      GET ALL ORDERS
================================ */
export async function fetchOrders() {
    const res = await fetch(`${API_BASE_URL}${ORDERS_API}`);
    if (!res.ok) throw new Error("Failed to fetch orders");
    return await res.json();
}

/* ================================
      CREATE ORDER
================================ */
export async function createOrder(orderData) {
    const res = await fetch(`${API_BASE_URL}${ORDERS_API}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || "Failed to create order");
    }

    return data;
}

/* ================================
      GET ORDER BY ID
================================ */
export async function fetchOrderById(orderId) {
    const res = await fetch(`${API_BASE_URL}${ORDERS_API}/${orderId}`);
    if (!res.ok) throw new Error("Order not found");
    return await res.json();
}

/* ================================
      SEARCH ORDERS (email or mobile)
      /orders/user/search?email=...
      /orders/user/search?mobile=...
================================ */
export async function searchOrders({ email, mobile }) {
    let url = `${API_BASE_URL}${ORDERS_API}/user/search?`;

    if (email) url += `email=${email}`;
    if (mobile) url += `mobile=${mobile}`;

    const res = await fetch(url);

    if (!res.ok) throw new Error("Failed to fetch orders");

    return await res.json();
}

/* ================================
      UPDATE ORDER STATUS
      PUT /orders/:id/status
================================ */
export async function updateOrderStatus(orderId, status, paymentId = null) {
    const res = await fetch(`${API_BASE_URL}${ORDERS_API}/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, paymentId }),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || "Failed to update order status");
    }

    return data;
}

/* ================================
      DELETE ORDER
================================ */
export async function deleteOrder(orderId) {
    const res = await fetch(`${API_BASE_URL}${ORDERS_API}/${orderId}`, {
        method: "DELETE",
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || "Failed to delete order");
    }

    return data;
}
