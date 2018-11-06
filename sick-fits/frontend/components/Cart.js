import React, { Component } from 'react'

import CartStyles from "./styles/CartStyles";
import Supreme from "./styles/Supreme";
import CloseButton from "./styles/CloseButton";
import SickButton from "./styles/SickButton";

const Cart = () => {
  return (
    <CartStyles open>
      <header>
        <CloseButton title="close">&times;</CloseButton>
        <Supreme>Your Cart</Supreme>
        <p>You have __ Items in your Cart</p>
      </header>

      <footer>
        <p>£10.10</p>
        <SickButton>Checkout</SickButton>
      </footer>
    </CartStyles>
  )
}

export default Cart;
