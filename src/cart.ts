import { CartItem, FoodItem } from "./types";



export function addToCart(
  cart: CartItem[],
  foodItem: FoodItem,
  quantity: number,
  specialInstruction?: string
): CartItem[] {
  if (quantity <= 0) {
    return cart;
  }

  const existingItem = cart.find(
    (item: CartItem): boolean =>
      item.id === foodItem.id
  );

  if (existingItem) {
    return cart.map(
      (item: CartItem): CartItem =>
        item.id === foodItem.id
          ? {
              ...item,
              quantity: item.quantity + quantity,
              specialInstruction:
                specialInstruction ??
                item.specialInstruction
            }
          : item
    );
  }

  const newItem: CartItem = {
    ...foodItem,
    quantity,
    specialInstruction
  };

  return [...cart, newItem];
}


export function removeFromCart(
  cart: CartItem[],
  foodItemId: number
): CartItem[] {
  return cart.filter(
    (item: CartItem): boolean =>
      item.id !== foodItemId
  );
}



export function updateQuantity(
  cart: CartItem[],
  foodItemId: number,
  quantity: number
): CartItem[] {
  if (quantity <= 0) {
    return removeFromCart(cart, foodItemId);
  }

  return cart.map(
    (item: CartItem): CartItem =>
      item.id === foodItemId
        ? {
            ...item,
            quantity
          }
        : item
  );
}



export function calculateItemTotal(
  item: CartItem
): number {
  return item.price * item.quantity;
}


export function calculateSubtotal(
  cart: CartItem[]
): number {
  return cart.reduce(
    (
      total: number,
      item: CartItem
    ): number => {
      return total + calculateItemTotal(item);
    },
    0
  );
}



export function findCartItem(
  cart: CartItem[],
  foodItemId: number
): CartItem | undefined {
  return cart.find(
    (item: CartItem): boolean =>
      item.id === foodItemId
  );
}


export function hasItem(
  cart: CartItem[],
  foodItemId: number
): boolean {
  return cart.some(
    (item: CartItem): boolean =>
      item.id === foodItemId
  );
}