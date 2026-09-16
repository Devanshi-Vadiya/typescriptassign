

export type ID = number;


export type FoodCategory =
  | "pizza"
  | "burger"
  | "drink"
  | "dessert";

export interface FoodItem {
  id: ID;
  name: string;
  category: FoodCategory;
  price: number;
  isAvailable: boolean;
}


export interface Address {
  street: string;
  city: string;
  pincode: string;
}

export interface Customer {
  id: ID;
  name: string;
  phone?: string;
  address: Address;
}

export type MembershipLevel =
  | "silver"
  | "gold"
  | "platinum";

export interface Guest extends Customer {
  type: "guest";
}

export interface Member extends Customer {
  type: "member";
  membershipId: string;
  discountPercentage: number;
  membershipLevel: MembershipLevel;
}

export type CustomerType = Guest | Member;



export interface OrderInformation {
  quantity: number;
  specialInstruction?: string;
}

export type CartItem = FoodItem & OrderInformation;


export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "delivered"
  | "cancelled";


export interface CashPayment {
  method: "cash";
  receivedAmount: number;
}

export interface CardPayment {
  method: "card";
  last4Digits: string;
}

export interface UpiPayment {
  method: "upi";
  transactionId: string;
}

export type Payment =
  | CashPayment
  | CardPayment
  | UpiPayment;


export interface DiscountDetails {
  membershipDiscount: number;
  additionalDiscount: number;
  totalDiscount: number;
}

export interface SuccessfulBill {
  status: "success";
  orderId: ID;
  customer: CustomerType;
  cartItems: CartItem[];
  subtotal: number;
  discount: DiscountDetails;
  tax: number;
  finalAmount: number;
  payment: Payment;
  orderStatus: OrderStatus;
}

export interface FailedBill {
  status: "error";
  message: string;
}

export type BillResult = SuccessfulBill | FailedBill;