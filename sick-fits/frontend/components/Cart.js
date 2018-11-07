import React from "react";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import { adopt } from "react-adopt";

import CartStyles from "./styles/CartStyles";
import Supreme from "./styles/Supreme";
import CloseButton from "./styles/CloseButton";
import SickButton from "./styles/SickButton";

import { formatPossessive } from "../lib/formatPossessive";
import { formatPlural } from "../lib/formatPlural";
import calcTotalPrice from "../lib/calcTotalPrice";

import User from "./User";
import CartItem from "./CartItem";
import formatMoney from "../lib/formatMoney";

const LOCAL_STATE_QUERY = gql`
  query {
    cartOpen @client
  }
`;

const TOGGLE_CART_MUTATION = gql`
  mutation TOGGLE_CART_MUTATION {
    toggleCart @client
  }
`;

const Composed = adopt({
  user: ({ render }) => <User>{render}</User>,
  toggleCart: ({ render }) => (
    <Mutation mutation={TOGGLE_CART_MUTATION}>{render}</Mutation>
  ),
  localState: ({ render }) => <Query query={LOCAL_STATE_QUERY}>{render}</Query>
});

const Cart = () => {
  return (
    <Composed>
      {({ user, toggleCart, localState }) => {
        const me = user.data.me;
        
        if (!me) return null;

        return (
          <CartStyles open={localState.data.cartOpen}>
            <header>
              <CloseButton onClick={toggleCart} title="close">
                &times;
              </CloseButton>

              <Supreme>{formatPossessive(me.name)} Cart</Supreme>

              <p>
                You have {me.cart.length} {formatPlural(me.cart, "Item")} in
                your Cart
              </p>
            </header>

            <ul>
              {me.cart.map(cartItem => (
                <CartItem key={cartItem.id} cartItem={cartItem} />
              ))}
            </ul>

            <footer>
              <p>{formatMoney(calcTotalPrice(me.cart))}</p>
              <SickButton>Checkout</SickButton>
            </footer>
          </CartStyles>
        );
      }}
    </Composed>
  );
};

export default Cart;
export { LOCAL_STATE_QUERY, TOGGLE_CART_MUTATION };
