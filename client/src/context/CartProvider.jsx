import React, { createContext, useReducer } from "react";
import { toast } from "react-toastify";

export const CartContext = createContext();

const initialState = {
  cartItems: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "add":
      const exists = state.cartItems.find(
        (item) => item._id === action.payload._id
      );
      if (exists) {
        return state;
      } else {
        const newCart = [...state.cartItems, action.payload];
        toast.info(`${action.payload.title} is added to cart`);
        return {
          cartItems: newCart,
        };
      }

    case "remove":
      return {
        cartItems: state.cartItems.filter(
          (item) => item._id !== action.payload
        ),
      };

    case "clear":
      return {
        cartItems: [],
      };

    default:
      return state;
  }
};

const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
