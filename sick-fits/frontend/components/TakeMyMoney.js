import React from "react";
import StripeCheckout from "react-stripe-checkout";
import { Mutation } from "react-apollo";
import Router from "next/router";
import NProgress from "nprogress";
import gql from "graphql-tag";

import calcTotalPrice from "../lib/calcTotalPrice";

import Error from "./ErrorMessage";
import User, { CURRENT_USER_QUERY } from "./User";
import Order from "../pages/order";

const CREATE_ORDER_MUTATION = gql`
  mutation CREATE_ORDER_MUTATION($token: String!) {
    createOrder(token: $token) {
      id
      charge
      total
      items {
        id
        title
      }
    }
  }
`;

class TakeMyMoney extends React.Component {
  totalItems(cart) {
    return cart.reduce((acc, cartItem) => acc + cartItem.quantity, 0);
  }

  async onToken(res, createOrder) {
    const order = await createOrder({
      variables: {
        token: res.id
      }
    }).catch(err => alert(err.message));

    Router.push({
      pathname: "/order",
      query: { id: order.data.createOrder.id }
    });
  }

  render() {
    return (
      <User>
        {({ data: { me }, loading }) => {
          if (loading) return null;

          return (
            <Mutation
              mutation={CREATE_ORDER_MUTATION}
              refetchQueries={[{ query: CURRENT_USER_QUERY }]}
            >
              {createOrder => (
                <StripeCheckout
                  amount={calcTotalPrice(me.cart)}
                  name="Sick Fits"
                  description={`Order of ${this.totalItems(me.cart)} items`}
                  image={
                    me.cart.length && me.cart[0].item && me.cart[0].item.image
                  }
                  stripeKey="pk_test_QB2uGuuPPQhrdievgH3SEB6y"
                  currency="GBP"
                  email={me.email}
                  token={res => this.onToken(res, createOrder)}
                >
                  {this.props.children}
                </StripeCheckout>
              )}
            </Mutation>
          );
        }}
      </User>
    );
  }
}

export default TakeMyMoney;
