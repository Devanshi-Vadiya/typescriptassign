import {
  BillResult,
  CartItem,
  CustomerType,
  DiscountDetails,
  Payment
} from "./types";

import { calculateSubtotal } from "./cart";


export function calculateDiscount(
  subtotal: number,
  customer: CustomerType
): DiscountDetails {
  let membershipDiscount = 0;

  if ("membershipId" in customer) {
    membershipDiscount =
      subtotal *
      (customer.discountPercentage / 100);
  }

  const amountAfterMembership =
    subtotal - membershipDiscount;

  let additionalDiscount = 0;

  if (subtotal > 2000) {
    additionalDiscount =
      amountAfterMembership * 0.05;
  }

  const totalDiscount =
    membershipDiscount +
    additionalDiscount;

  return {
    membershipDiscount,
    additionalDiscount,
    totalDiscount
  };
}

export function calculateTax(
  amountAfterDiscount: number
): number {
  return amountAfterDiscount * 0.05;
}

export function calculateFinalAmount(
  subtotal: number,
  discount: DiscountDetails,
  tax: number
): number {
  return (
    subtotal -
    discount.totalDiscount +
    tax
  );
}

export function generateBill(
  orderId: number,
  customer: CustomerType,
  cartItems: CartItem[],
  payment: Payment,
  orderStatus:
    | "pending"
    | "confirmed"
    | "preparing"
    | "delivered"
    | "cancelled"
): BillResult {
  if (cartItems.length === 0) {
    return {
      status: "error",
      message:
        "Cannot generate bill for an empty cart."
    };
  }

  const subtotal =
    calculateSubtotal(cartItems);

  const discount =
    calculateDiscount(
      subtotal,
      customer
    );

  const amountAfterDiscount =
    subtotal - discount.totalDiscount;

  const tax =
    calculateTax(amountAfterDiscount);

  const finalAmount =
    calculateFinalAmount(
      subtotal,
      discount,
      tax
    );

  return {
    status: "success",
    orderId,
    customer,
    cartItems,
    subtotal,
    discount,
    tax,
    finalAmount,
    payment,
    orderStatus
  };
}