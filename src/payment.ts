import {
  Payment,
  CashPayment,
  CardPayment,
  UpiPayment
} from "./types";


export function createCashPayment(
  receivedAmount: number
): CashPayment {
  return {
    method: "cash",
    receivedAmount
  };
}


export function createCardPayment(
  last4Digits: string
): CardPayment {
  return {
    method: "card",
    last4Digits
  };
}


export function createUpiPayment(
  transactionId: string
): UpiPayment {
  return {
    method: "upi",
    transactionId
  };
}


export function processPayment(
  payment: Payment,
  amount: number
): {
  success: boolean;
  message: string;
} {
  switch (payment.method) {
    case "cash":
      if (payment.receivedAmount < amount) {
        return {
          success: false,
          message:
            "Insufficient cash amount."
        };
      }

      return {
        success: true,
        message:
          `Payment successful. Change: ₹${(
            payment.receivedAmount - amount
          ).toFixed(2)}`
      };

    case "card":
      if (payment.last4Digits.length !== 4) {
        return {
          success: false,
          message:
            "Invalid card details."
        };
      }

      return {
        success: true,
        message:
          `Card payment successful. Card ending ${payment.last4Digits}`
      };

    case "upi":
      if (payment.transactionId.trim() === "") {
        return {
          success: false,
          message:
            "Invalid UPI transaction ID."
        };
      }

      return {
        success: true,
        message:
          `UPI payment successful. Transaction ID: ${payment.transactionId}`
      };

    default:
      return assertNever(payment);
  }
}


function assertNever(
  value: never
): never {
  throw new Error(
    `Unhandled payment type: ${value}`
  );
}




export function getPaymentDetails(
  payment: Payment
): string {
  switch (payment.method) {
    case "cash":
      return `Cash - Received ₹${payment.receivedAmount.toFixed(2)}`;

    case "card":
      return `Card - ****${payment.last4Digits}`;

    case "upi":
      return `UPI - ${payment.transactionId}`;

    default:
      return assertNever(payment);
  }
}