import { OrderStatus } from "./types";

// Update the order status
export function updateOrderStatus(
  currentStatus: OrderStatus,
  newStatus: OrderStatus
): OrderStatus {
  // Current status is kept as a parameter
  // so the function can be extended later
  void currentStatus;

  switch (newStatus) {
    case "pending":
      return "pending";

    case "confirmed":
      return "confirmed";

    case "preparing":
      return "preparing";

    case "delivered":
      return "delivered";

    case "cancelled":
      return "cancelled";

    default:
      return assertNever(newStatus);
  }
}

// Get a message according to order status
export function getOrderStatusMessage(
  status: OrderStatus
): string {
  switch (status) {
    case "pending":
      return "Order is waiting for confirmation.";

    case "confirmed":
      return "Order has been confirmed.";

    case "preparing":
      return "Your food is being prepared.";

    case "delivered":
      return "Order has been delivered.";

    case "cancelled":
      return "Order has been cancelled.";

    default:
      return assertNever(status);
  }
}

// Exhaustiveness check
function assertNever(
  value: never
): never {
  throw new Error(
    `Unhandled order status: ${value}`
  );
}