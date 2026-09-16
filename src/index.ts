import * as readline from "readline";

import { foodItems } from "./data";

import {
  addToCart,
  calculateSubtotal,
  findCartItem,
  removeFromCart,
  updateQuantity
} from "./cart";

import {
  createGuest,
  createMember,
  getCustomerType
} from "./customer";

import {
  createCardPayment,
  createCashPayment,
  createUpiPayment,
  getPaymentDetails,
  processPayment
} from "./payment";

import {
  calculateDiscount,
  generateBill
} from "./billing";

import {
  getOrderStatusMessage,
  updateOrderStatus
} from "./order";

import {
  BillResult,
  CartItem,
  CustomerType,
  OrderStatus,
  Payment
} from "./types";

// =====================================
// READLINE SETUP
// =====================================

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// =====================================
// APPLICATION STATE
// =====================================

let customer: CustomerType | undefined;

let cart: CartItem[] = [];

let currentPayment: Payment | undefined;

let orderStatus: OrderStatus = "pending";

let orderId = 1001;

// =====================================
// QUESTION HELPER
// =====================================

function ask(
  question: string
): Promise<string> {
  return new Promise(
    (
      resolve: (value: string) => void
    ) => {
      rl.question(
        question,
        resolve
      );
    }
  );
}

// =====================================
// HEADER
// =====================================

function showHeader(): void {
  console.log("\n");
  console.log(
    "========================================"
  );
  console.log(
    "       🍔 FOOD ORDERING SYSTEM"
  );
  console.log(
    "========================================"
  );
}

// =====================================
// VIEW FOOD MENU
// =====================================

function displayFoodMenu(): void {
  console.log("\n========== FOOD MENU ==========");

  foodItems.forEach((item) => {
    const availability = item.isAvailable
      ? "Available"
      : "Unavailable";

    console.log(
      `${item.id}. ${item.name} | ${item.category} | ₹${item.price} | ${availability}`
    );
  });

  console.log(
    "================================"
  );
}

// =====================================
// SEARCH FOOD
// =====================================

async function searchFood(): Promise<void> {
  const keyword = (
    await ask(
      "\nEnter food name to search: "
    )
  )
    .trim()
    .toLowerCase();

  const results = foodItems.filter(
    (item) =>
      item.name
        .toLowerCase()
        .includes(keyword)
  );

  if (results.length === 0) {
    console.log(
      "\n❌ No food item found."
    );
    return;
  }

  console.log(
    "\n========== SEARCH RESULTS =========="
  );

  results.forEach((item) => {
    console.log(
      `${item.id}. ${item.name} | ₹${item.price}`
    );
  });
}

// =====================================
// CREATE CUSTOMER
// =====================================

async function createCustomer(): Promise<void> {
  console.log(
    "\n========== CREATE CUSTOMER =========="
  );

  const name = (
    await ask("Enter name: ")
  ).trim();

  const phone = (
    await ask(
      "Enter phone (optional): "
    )
  ).trim();

  const street = (
    await ask("Enter street: ")
  ).trim();

  const city = (
    await ask("Enter city: ")
  ).trim();

  const pincode = (
    await ask("Enter pincode: ")
  ).trim();

  const address = {
    street,
    city,
    pincode
  };

  const type = (
    await ask(
      "Are you a Guest or Member? (guest/member): "
    )
  )
    .trim()
    .toLowerCase();

  if (type === "member") {
    const membershipLevel = (
      await ask(
        "Membership (silver/gold/platinum): "
      )
    )
      .trim()
      .toLowerCase();

    if (
      membershipLevel !== "silver" &&
      membershipLevel !== "gold" &&
      membershipLevel !== "platinum"
    ) {
      console.log(
        "\n❌ Invalid membership level."
      );
      return;
    }

    const membershipId = (
      await ask(
        "Enter membership ID: "
      )
    ).trim();

    customer = createMember(
      Date.now(),
      name,
      address,
      membershipLevel,
      membershipId,
      phone || undefined
    );

    console.log(
      "\n✅ Member created successfully."
    );
  } else {
    customer = createGuest(
      Date.now(),
      name,
      address,
      phone || undefined
    );

    console.log(
      "\n✅ Guest customer created successfully."
    );
  }

  console.log(
    `Customer: ${customer.name}`
  );

  console.log(
    `Type: ${getCustomerType(customer)}`
  );
}

// =====================================
// ADD ITEM TO CART
// =====================================

async function addItemToCart(): Promise<void> {
  displayFoodMenu();

  const id = Number(
    await ask(
      "\nEnter food item ID: "
    )
  );

  const item = foodItems.find(
    (foodItem) =>
      foodItem.id === id
  );

  if (!item) {
    console.log(
      "\n❌ Food item not found."
    );
    return;
  }

  if (!item.isAvailable) {
    console.log(
      "\n❌ This item is unavailable."
    );
    return;
  }

  const quantity = Number(
    await ask(
      "Enter quantity: "
    )
  );

  if (
    !Number.isInteger(quantity) ||
    quantity <= 0
  ) {
    console.log(
      "\n❌ Invalid quantity."
    );
    return;
  }

  const instruction = (
    await ask(
      "Special instruction (optional): "
    )
  ).trim();

  cart = addToCart(
    cart,
    item,
    quantity,
    instruction || undefined
  );

  console.log(
    `\n✅ ${item.name} added to cart.`
  );
}

// =====================================
// VIEW CART
// =====================================

function displayCart(): void {
  console.log(
    "\n========== YOUR CART =========="
  );

  if (cart.length === 0) {
    console.log(
      "Cart is empty."
    );
    return;
  }

  cart.forEach((item) => {
    const itemTotal =
      item.price * item.quantity;

    console.log(
      `${item.name} x${item.quantity} = ₹${itemTotal}`
    );

    if (item.specialInstruction) {
      console.log(
        `   Note: ${item.specialInstruction}`
      );
    }
  });

  console.log(
    "--------------------------------"
  );

  console.log(
    `Subtotal: ₹${calculateSubtotal(cart).toFixed(2)}`
  );
}

// =====================================
// UPDATE CART QUANTITY
// =====================================

async function updateCartQuantity(): Promise<void> {
  displayCart();

  if (cart.length === 0) {
    return;
  }

  const id = Number(
    await ask(
      "\nEnter food item ID: "
    )
  );

  const item = findCartItem(
    cart,
    id
  );

  if (!item) {
    console.log(
      "\n❌ Item not found in cart."
    );
    return;
  }

  const quantity = Number(
    await ask(
      "Enter new quantity: "
    )
  );

  if (
    !Number.isInteger(quantity) ||
    quantity < 0
  ) {
    console.log(
      "\n❌ Invalid quantity."
    );
    return;
  }

  cart = updateQuantity(
    cart,
    id,
    quantity
  );

  console.log(
    "\n✅ Cart updated."
  );
}

// =====================================
// REMOVE ITEM
// =====================================

async function removeItem(): Promise<void> {
  displayCart();

  if (cart.length === 0) {
    return;
  }

  const id = Number(
    await ask(
      "\nEnter food item ID to remove: "
    )
  );

  const item = findCartItem(
    cart,
    id
  );

  if (!item) {
    console.log(
      "\n❌ Item not found."
    );
    return;
  }

  cart = removeFromCart(
    cart,
    id
  );

  console.log(
    `\n✅ ${item.name} removed.`
  );
}

// =====================================
// CHECKOUT
// =====================================

async function checkout(): Promise<void> {
  if (!customer) {
    console.log(
      "\n❌ Please create a customer first."
    );
    return;
  }

  if (cart.length === 0) {
    console.log(
      "\n❌ Your cart is empty."
    );
    return;
  }

  const subtotal =
    calculateSubtotal(cart);

  const discount =
    calculateDiscount(
      subtotal,
      customer
    );

  console.log(
    "\n========== CHECKOUT =========="
  );

  console.log(
    `Customer: ${customer.name}`
  );

  console.log(
    `Customer Type: ${getCustomerType(customer)}`
  );

  console.log(
    `Subtotal: ₹${subtotal.toFixed(2)}`
  );

  console.log(
    `Membership Discount: ₹${discount.membershipDiscount.toFixed(2)}`
  );

  console.log(
    `Additional Discount: ₹${discount.additionalDiscount.toFixed(2)}`
  );

  const amountAfterDiscount =
    subtotal -
    discount.totalDiscount;

  const tax =
    amountAfterDiscount * 0.05;

  const finalAmount =
    amountAfterDiscount + tax;

  console.log(
    `GST (5%): ₹${tax.toFixed(2)}`
  );

  console.log(
    `Final Amount: ₹${finalAmount.toFixed(2)}`
  );

  await selectPayment(finalAmount);
}



async function selectPayment(
  amount: number
): Promise<void> {
  console.log(
    "\n========== PAYMENT =========="
  );

  console.log(
    "1. Cash"
  );

  console.log(
    "2. Card"
  );

  console.log(
    "3. UPI"
  );

  const choice = (
    await ask(
      "Select payment method: "
    )
  ).trim();

  let payment: Payment;

  switch (choice) {
    case "1": {
      const receivedAmount =
        Number(
          await ask(
            `Amount to pay ₹${amount.toFixed(
              2
            )}. Enter cash received: `
          )
        );

      payment =
        createCashPayment(
          receivedAmount
        );

      break;
    }

    case "2": {
      const last4Digits = (
        await ask(
          "Enter last 4 digits of card: "
        )
      ).trim();

      payment =
        createCardPayment(
          last4Digits
        );

      break;
    }

    case "3": {
      const transactionId = (
        await ask(
          "Enter UPI transaction ID: "
        )
      ).trim();

      payment =
        createUpiPayment(
          transactionId
        );

      break;
    }

    default:
      console.log(
        "\n❌ Invalid payment method."
      );
      return;
  }

  const result =
    processPayment(
      payment,
      amount
    );

  console.log(
    `\n${result.message}`
  );

  if (!result.success) {
    return;
  }

  currentPayment = payment;

  orderStatus =
    updateOrderStatus(
      orderStatus,
      "confirmed"
    );

  console.log(
    "\n✅ Order confirmed!"
  );

  const bill =
    generateBill(
      orderId,
      customer!,
      cart,
      payment,
      orderStatus
    );

  displayBill(bill);

  orderId++;
}



function displayBill(
  result: BillResult
): void {
  if (result.status === "error") {
    console.log(
      `\n❌ ${result.message}`
    );

    return;
  }

  console.log(
    "\n========================================"
  );

  console.log(
    "             ORDER SUMMARY"
  );

  console.log(
    "========================================"
  );

  console.log(
    `Order ID: ${result.orderId}`
  );

  console.log(
    `Customer: ${result.customer.name}`
  );

  console.log(
    `Membership: ${getCustomerType(
      result.customer
    )}`
  );

  console.log(
    "\nItems:"
  );

  console.log(
    "----------------------------------------"
  );

  result.cartItems.forEach(
    (item) => {
      console.log(
        `${item.name} x${item.quantity} = ₹${(
          item.price *
          item.quantity
        ).toFixed(2)}`
      );
    }
  );

  console.log(
    "----------------------------------------"
  );

  console.log(
    `Subtotal: ₹${result.subtotal.toFixed(2)}`
  );

  console.log(
    `Membership Discount: ₹${result.discount.membershipDiscount.toFixed(
      2
    )}`
  );

  console.log(
    `Additional Discount: ₹${result.discount.additionalDiscount.toFixed(
      2
    )}`
  );

  console.log(
    `GST (5%): ₹${result.tax.toFixed(2)}`
  );

  console.log(
    "----------------------------------------"
  );

  console.log(
    `Final Amount: ₹${result.finalAmount.toFixed(2)}`
  );

  console.log(
    `Payment: ${getPaymentDetails(
      result.payment
    )}`
  );

  console.log(
    `Order Status: ${result.orderStatus}`
  );

  console.log(
    "========================================"
  );

  console.log(
    "       Thank you for ordering! 🍔"
  );

  console.log(
    "========================================"
  );
}



async function changeStatus(): Promise<void> {
  console.log(
    "\n========== ORDER STATUS =========="
  );

  console.log(
    `Current status: ${orderStatus}`
  );

  console.log(
    "\n1. pending"
  );

  console.log(
    "2. confirmed"
  );

  console.log(
    "3. preparing"
  );

  console.log(
    "4. delivered"
  );

  console.log(
    "5. cancelled"
  );

  const choice = (
    await ask(
      "\nSelect new status: "
    )
  ).trim();

  let newStatus: OrderStatus;

  switch (choice) {
    case "1":
      newStatus = "pending";
      break;

    case "2":
      newStatus = "confirmed";
      break;

    case "3":
      newStatus = "preparing";
      break;

    case "4":
      newStatus = "delivered";
      break;

    case "5":
      newStatus = "cancelled";
      break;

    default:
      console.log(
        "\n❌ Invalid status."
      );
      return;
  }

  orderStatus =
    updateOrderStatus(
      orderStatus,
      newStatus
    );

  console.log(
    `\n✅ Status updated to: ${orderStatus}`
  );

  console.log(
    getOrderStatusMessage(
      orderStatus
    )
  );
}


function displayCustomer(): void {
  if (!customer) {
    console.log(
      "\n❌ No customer created yet."
    );

    return;
  }

  console.log(
    "\n========== CUSTOMER =========="
  );

  console.log(
    `ID: ${customer.id}`
  );

  console.log(
    `Name: ${customer.name}`
  );

  console.log(
    `Phone: ${customer.phone ?? "Not provided"}`
  );

  console.log(
    `Address: ${customer.address.street}, ${customer.address.city} - ${customer.address.pincode}`
  );

  console.log(
    `Type: ${getCustomerType(customer)}`
  );

  if ("membershipId" in customer) {
    console.log(
      `Membership ID: ${customer.membershipId}`
    );

    console.log(
      `Discount: ${customer.discountPercentage}%`
    );
  }
}


async function showMenu(): Promise<void> {
  while (true) {
    showHeader();

    console.log(
      "\n1. View Food Menu"
    );

    console.log(
      "2. Search Food"
    );

    console.log(
      "3. Create Customer"
    );

    console.log(
      "4. View Customer"
    );

    console.log(
      "5. Add Item to Cart"
    );

    console.log(
      "6. View Cart"
    );

    console.log(
      "7. Update Quantity"
    );

    console.log(
      "8. Remove Item"
    );

    console.log(
      "9. Checkout"
    );

    console.log(
      "10. Change Order Status"
    );

    console.log(
      "11. Exit"
    );

    const choice = (
      await ask(
        "\nSelect an option: "
      )
    ).trim();

    switch (choice) {
      case "1":
        displayFoodMenu();
        break;

      case "2":
        await searchFood();
        break;

      case "3":
        await createCustomer();
        break;

      case "4":
        displayCustomer();
        break;

      case "5":
        await addItemToCart();
        break;

      case "6":
        displayCart();
        break;

      case "7":
        await updateCartQuantity();
        break;

      case "8":
        await removeItem();
        break;

      case "9":
        await checkout();
        break;

      case "10":
        await changeStatus();
        break;

      case "11":
        console.log(
          "\n👋 Thank you for using Food Ordering System!"
        );

        rl.close();

        return;

      default:
        console.log(
          "\n❌ Invalid option. Please try again."
        );
    }
  }
}


showMenu().catch(
  (error: unknown) => {
    console.error(
      "Application error:",
      error
    );

    rl.close();
  }
);