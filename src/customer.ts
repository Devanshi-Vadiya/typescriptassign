import {
  Address,
  CustomerType,
  Guest,
  Member,
  MembershipLevel
} from "./types";

export function createGuest(
  id: number,
  name: string,
  address: Address,
  phone?: string
): Guest {
  return {
    id,
    name,
    phone,
    address,
    type: "guest"
  };
}

export function createMember(
  id: number,
  name: string,
  address: Address,
  membershipLevel: MembershipLevel,
  membershipId: string,
  phone?: string
): Member {
  const discountPercentage =
    getMembershipDiscount(membershipLevel);

  return {
    id,
    name,
    phone,
    address,
    type: "member",
    membershipId,
    membershipLevel,
    discountPercentage
  };
}

export function getMembershipDiscount(
  level: MembershipLevel
): number {
  switch (level) {
    case "silver":
      return 5;

    case "gold":
      return 10;

    case "platinum":
      return 15;
  }
}

export function getCustomerType(
  customer: CustomerType
): string {
  if ("membershipId" in customer) {
    return `${customer.membershipLevel.toUpperCase()} Member`;
  }

  return "Guest";
}