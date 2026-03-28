export type CartItem = {
  itemId: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
};

export type Cart = {
  cartId: string;
  userId: string;
  items: CartItem[];
  totalPrice: number;
};

export type AddCartItemRequest = {
  productId: string;
  quantity: number;
};

export type UpdateCartItemRequest = {
  quantity: number;
};
